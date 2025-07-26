import express from 'express';
import multer from 'multer';
import CloudConvert from 'cloudconvert';
import { authenticateToken } from '../middleware/authMiddleware.js';
import FileHistory from '../models/FileHistory.js';
import User from '../models/User.js';

const router = express.Router();
const cloudConvert = new CloudConvert(process.env.CLOUDCONVERT_API_KEY);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024,
        files: 5
    }
});

const sanitizeFilename = (filename) => {
  return filename
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s.-]/g, '')
    .replace(/[\s-]+/g, ' ')
    .trim();
};

router.post('/batch', [authenticateToken, upload.array('files', 5)], async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const { toFormat } = req.body;
    if (!toFormat) {
        return res.status(400).json({ message: 'Target output format was not specified.' });
    }

    const settingsArray = req.body.settings ? JSON.parse(req.body.settings) : [];
    const settingsMap = new Map(settingsArray.map(s => [s.originalName, s.settings]));

    const conversionPromises = req.files.map(async (file) => {
        const safeOriginalName = sanitizeFilename(file.originalname);
        let job;

        try {
            const fileSettings = settingsMap.get(file.originalname) || {};
            const fromFormat = file.originalname.split('.').pop().toLowerCase();
            
            console.log(`[CloudConvert] Preparing job for ${safeOriginalName}: ${fromFormat} -> ${toFormat}`);

            let conversionTask = {
                operation: 'convert',
                input: 'import-1',
                output_format: toFormat,
            };

            if (['mp4', 'webm', 'mkv', 'mov', 'avi'].includes(toFormat)) {
                console.log('Using VIDEO conversion recipe...');
                conversionTask.engine = 'ffmpeg';
                conversionTask.video_codec = 'x264';
                if (fileSettings.removeAudio) {
                    conversionTask.audio_codec = 'none';
                } else {
                    conversionTask.audio_codec = 'copy';
                }
                const qualityMap = { high: 18, medium: 23, low: 28 };
                conversionTask.crf = qualityMap[fileSettings.video_quality] || 23;
                if (fileSettings.resolution && fileSettings.resolution !== 'original') {
                    const [width, height] = fileSettings.resolution.split('x');
                    conversionTask.width = parseInt(width);
                    conversionTask.height = parseInt(height);
                }
                if (fileSettings.trimStart && fileSettings.trimEnd) {
                    conversionTask.video_start_time = fileSettings.trimStart;
                    conversionTask.video_end_time = fileSettings.trimEnd;
                }
            }
            else if (['mp3', 'wav', 'aac', 'flac'].includes(toFormat)) {
                console.log('Using AUDIO conversion recipe...');
                conversionTask.engine = 'ffmpeg';
                
                const videoFormats = ['mp4', 'mov', 'mkv', 'avi', 'webm', 'flv'];
                if (videoFormats.includes(fromFormat)) {
                    console.log(`Source is a video (${fromFormat}). Forcing re-encode to ${toFormat}.`);
                    conversionTask.audio_codec = toFormat;
                } else {
                    if (fileSettings.audioCodec && fileSettings.audioCodec !== 'auto') {
                        conversionTask.audio_codec = fileSettings.audioCodec;
                    } else {
                        conversionTask.audio_codec = toFormat;
                    }
                }
                
                conversionTask.audio_bitrate = fileSettings.audioRateControl === 'cbr' ? parseInt(fileSettings.bitrate) * 1000 : undefined;
                conversionTask.audio_qscale = fileSettings.audioRateControl === 'vbr' ? 2 : undefined;
            }
            else if (['png', 'jpg', 'svg', 'webp', 'jfif'].includes(toFormat)) {
                console.log('Using IMAGE conversion recipe...');
                conversionTask.engine = 'imagemagick';
                if (fileSettings.quality) {
                    conversionTask.quality = fileSettings.quality;
                }
            }
            else if (fromFormat === 'pdf' && ['jpg', 'png'].includes(toFormat)) {
                console.log('Using PDF to IMAGE conversion recipe...');
                conversionTask.engine = 'poppler';
                conversionTask.pages = '1';
            }
            else if (toFormat === 'gif') {
                console.log('Using VIDEO to GIF conversion recipe...');
                conversionTask.engine = 'ffmpeg';
                conversionTask.video_codec = 'gif';
            }
            else {
                throw new Error(`Unsupported conversion from .${fromFormat} to .${toFormat}`);
            }

            job = await cloudConvert.jobs.create({
                tag: `${fromFormat}-to-${toFormat}`,
                tasks: {
                    'import-1': { operation: 'import/upload' },
                    'convert-1': conversionTask,
                    'export-1': { operation: 'export/url', input: 'convert-1' }
                }
            });

            const uploadTask = job.tasks.find(task => task.name === 'import-1');
            await cloudConvert.tasks.upload(uploadTask, file.buffer, safeOriginalName);

            const awaitedJob = await cloudConvert.jobs.wait(job.id);
            const exportTask = awaitedJob.tasks.find(task => task.operation === 'export/url' && task.status === 'finished');

            if (!exportTask || !exportTask.result.files || exportTask.result.files.length === 0) {
                console.log("Full CloudConvert Job Details:", JSON.stringify(awaitedJob, null, 2));
                throw new Error('Conversion process did not produce an output file.');
            }

            const outputFile = exportTask.result.files[0];
            const downloadUrl = outputFile.url;

            try {
                const historyRecord = new FileHistory({
                    userId: req.user.id,
                    filename: outputFile.filename,
                    format: toFormat,
                    sizeInBytes: outputFile.size,
                });
                await historyRecord.save();
                await User.findByIdAndUpdate(req.user.id, {
                    $push: { fileHistory: historyRecord._id }
                });
                console.log(`[DB] Saved history for converted file: ${outputFile.filename}`);
            } catch (dbError) {
                console.error(`[CRITICAL DB ERROR] Could not save history for user ${req.user.id}. File: ${outputFile.filename}`, dbError);
            }

            console.log(`[CloudConvert] Finished job for: ${safeOriginalName}`);
            return { originalName: file.originalname, success: true, downloadUrl };

        } catch (error) {
            console.error(`[CloudConvert] Error converting ${safeOriginalName}:`, error);
            return { originalName: file.originalname, success: false, message: error.message || 'Conversion failed.' };
        }
    });

    try {
        const results = await Promise.all(conversionPromises);
        res.json(results);
    } catch (error) {
        console.error('Critical batch processing error:', error);
        res.status(500).json({ message: 'A critical error occurred during batch processing.' });
    }
});

export default router;

import { UAParser } from 'ua-parser-js';
import axios from 'axios';
import UserMetadata from '../models/UserMetadata.js';

export async function saveUserMetadata(req, userId) {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';

        // Skip local IPs to avoid errors during development
        if (ip === '::1' || ip === '127.0.0.1') {
            console.log('🧪 Localhost IP detected. Skipping metadata storage.');
            return; // Exit the function early
        }

        const userAgent = req.headers['user-agent'] || '';
        console.log('📥 Updating metadata for user:', userId);
        console.log('🌐 IP:', ip);
        console.log('🧠 UA:', userAgent);

        // --- Data Gathering (remains the same) ---
        const parser = new UAParser();
        parser.setUA(userAgent);
        const uaResult = parser.getResult();

        const geoRes = await axios.get(`http://ip-api.com/json/${ip}`);
        console.log('📍 Location:', geoRes.data);


        // --- "Upsert" Logic ---
        const filter = { user: userId }; // The condition to find the document

        const update = { // The data to set if found, or for the new document
            ip,
            location: {
                country: geoRes.data.country || '',
                region: geoRes.data.regionName || '',
                city: geoRes.data.city || '',
            },
            device: {
                type: uaResult.device.type || 'desktop',
                browser: uaResult.browser.name || '',
                os: uaResult.os.name || '',
            },
            userAgent,
            // Note: `createdAt` will only be set on the initial insert
            // You could add a new field like `lastLoginAt` if you wanted
        };

        const options = {
            upsert: true, // <-- If no document is found, create a new one
            new: true,    // <-- Return the new or updated document, not the old one
        };

        const doc = await UserMetadata.findOneAndUpdate(filter, update, options);

        console.log('✅ User metadata upserted:', doc._id);

    } catch (err) {
        // It's good practice to check if the error is from the axios call
        if (err.isAxiosError) {
            console.error('❌ Error fetching geolocation data:', err.response?.data || err.message);
        } else {
            console.error('❌ Error saving user metadata:', err.message);
        }
    }
}

import React from 'react';
import ConverterPage from '@/components/ConverterPage';
// Import BOTH the component AND its named export for the default settings.
import AudioSetting, { defaultAudioSettings } from '@/components/AudioSetting';

const Mp4ToMp3Converter = () => {
  return (
    <ConverterPage
      fromFormat="mp4"
      toFormat="mp3"
      title="MP4 to MP3 Converter"
      description="Extract high-quality audio from MP4 videos"
      settingsComponent={AudioSetting}
      // Pass the imported defaults object as a prop
      defaultSettings={defaultAudioSettings} 
    />
  );
};

export default Mp4ToMp3Converter;
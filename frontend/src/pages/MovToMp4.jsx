import React from 'react';
import ConverterPage from '@/components/ConverterPage';
import VideoSetting, { defaultVideoSettings } from '@/components/VideoSetting';

const MovToMp4Converter = () => {
  return (
    <ConverterPage
      fromFormat="mov"
      toFormat="mp4"
      title="MOV to MP4 Converter"
      description="Easily convert your MOV video files to the universally compatible MP4 format."
      // We pass in the NEW VideoSetting component
      settingsComponent={VideoSetting}
      // And we pass in its default settings
      defaultSettings={defaultVideoSettings} 
    />
  );
};

export default MovToMp4Converter;
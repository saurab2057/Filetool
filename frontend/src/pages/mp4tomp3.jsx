import React from 'react';
import ConverterPage from '@/components/Converterpage';

const Mp4ToMp3Converter = () => {
  return (
    <ConverterPage
      fromFormat="mp4"
      toFormat="mp3"
      title="MP4 to MP3 Converter"
      description="Extract high-quality audio from MP4 videos and convert to MP3 format"
    />
  );
};

export default Mp4ToMp3Converter;
import React from 'react';
import ConverterPage from '@/components/ConverterPage';
// Import both the component AND its named export for the default settings.
import PNGSetting, { defaultImageSettings } from '@/components/PNGSetting';

const PngToSvgConverter = () => {
  return (
    <ConverterPage
      fromFormat="png"
      toFormat="svg"
      title="PNG to SVG Converter"
      description="Convert PNG images to scalable SVG vector format"
      settingsComponent={PNGSetting}
      // Pass the imported defaults object as a prop
      defaultSettings={defaultImageSettings}
    />
  );
};

export default PngToSvgConverter;
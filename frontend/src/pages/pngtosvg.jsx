import React from 'react';
import ConverterPage from '@/components/Converterpage';

const PngToSvgConverter = () => {
  return (
    <ConverterPage
      fromFormat="png"
      toFormat="svg"
      title="PNG to SVG Converter"
      description="Convert PNG images to scalable SVG vector format online for free"
    />
  );
};

export default PngToSvgConverter;
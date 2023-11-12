import { motion } from 'framer-motion';
import React from 'react';

import { Box, Image } from '@chakra-ui/react';

const MotionImage = motion(Image);

function ImageStack({ images }) {
  return (
    <Box
      position="relative"
      width={180}
      height={220}
      style={{ perspective: '1000px' }}
    >
      {images.map((imageSrc, index) => (
        <MotionImage
          key={index}
          src={imageSrc}
          alt={`image${index}`}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            ...generateTransform(images.length, index),
          }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: 10,
            zIndex: -index + 100,
          }}
        />
      ))}
    </Box>
  );
}

function generateTransform(totalImages, currentIndex) {
  const maxRotation = 15;
  const rotationStep = maxRotation / (totalImages - 1);
  const rotation = currentIndex * rotationStep;

  const maxTranslation = 10;
  const translationStep = maxTranslation / (totalImages - 1);
  const translation = currentIndex * translationStep;

  return {
    rotate: rotation,
    y: translation,
    x: translation,
  };
}

export default ImageStack;

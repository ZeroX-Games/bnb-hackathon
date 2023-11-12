import { Box, Image } from '@chakra-ui/react';

function ProfileImage({ src, size = 200, ...rest }) {
  return (
    <Box
      borderRadius="400px 400px 20px 20px"
      border="10px solid rgba(255, 255, 255, 0.80)"
      overflow="hidden"
    >
      <Image src={src} width={size} height={size} {...rest} />
    </Box>
  );
}

export default ProfileImage;

import { Button as CkButton, VStack } from '@chakra-ui/react';

function Button(props) {
  return (
    <CkButton
      border="3px solid rgba(255, 255, 255, 0.50);"
      borderRadius={10}
      boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.25);"
      {...props}
    />
  );
}

export default Button;

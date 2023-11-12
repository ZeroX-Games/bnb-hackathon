import { VStack } from '@chakra-ui/react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Button from '@components/Button';

function Home() {
  const navigate = useNavigate();
  const { userData } = useOutletContext();

  return (
    <VStack gap={10}>
      <Button
        colorScheme="twitter"
        width={350}
        height={100}
        onClick={() => navigate('/game', { state: { userData } })}
        style={{ fontSize: '35px' }}
      >
        START GAME
      </Button>
      <Button
        colorScheme="pink"
        width={350}
        height={100}
        onClick={() => navigate('/friends')}
        style={{ fontSize: '35px' }}
      >
        FRIENDS
      </Button>
    </VStack>
  );
}

export default Home;

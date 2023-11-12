import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "@/components/Button";
import ProfileImage from "@/components/ProfileImage";
import apiClient from "@/utils/apiClient";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";

import { assets } from "../assets";

const opponentDefault = {
  name: "opponent",
  profileImage: assets.bayc6139,
  health: 100,
  ens: "bustinjieber.bnb",
  nft: {
    name: "BAYC",
    id: "6139",
  },
  cards: [
    {
      image: assets.pancake10,
      name: "Pancake #10",
      id: "10",
      damage: 60,
      health: 100,
    },
    {
      image: assets.mayc8102,
      name: "MAYC #8102",
      id: "8102",
      damage: 60,
      health: 100,
    },
  ],
};

const userDefault = {
  name: "user",
  profileImage: assets.doodles2933,
  health: 100,
  ens: "satoshi.eth",
  nft: {
    name: "BAYC",
    id: "1463",
  },
  cards: [
    {
      image: assets.bakc711,
      name: "BAKC",
      id: "711",
      damage: 10,
      health: 100,
    },
    {
      image: assets.mayc5361,
      name: "MAYC",
      id: "5361",
      damage: 75,
      health: 100,
    },
    {
      image: assets.mayc8102,
      name: "MAYC",
      id: "8102",
      damage: 20,
      health: 100,
    },
    {
      image: assets.mayc8102,
      name: "MAYC",
      id: "8102",
      damage: 5,
      health: 100,
    },
  ],
};

function Game() {
  const [opponent, setOpponent] = useState(opponentDefault);
  const [user] = useState(userDefault);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const controls = useAnimation();
  const location = useLocation();
  const [userData, setUserData] = useState<any>(location.state?.userData);
  const userCards = userData?.nftsCardUsedInGame?.map((card, index) => ({
    ...Object.values(card)[0],
    health: 100,
    damage: userDefault.cards[index].damage,
  }));

  useEffect(() => {
    const fetchData = async () => {
      const res = await apiClient.get(
        "/twitter-profile-and-nfts-info/0xc6c4aaa9c6fa57fb938d864999a713bc7c72e1d1"
      );

      setUserData(res);
    };

    fetchData();
  }, []);

  console.log(userData, userCards);

  const handleDragEnd = (event) => {
    if (event.over && event.over.id === opponent.name) {
      console.log("dragged", event);
      setOpponent((prev) => {
        let health = prev.health - event.active.data.current.damage;

        if (health < 0) {
          health = 0;
          // display close modal
          console.log("game end");
          onOpen();
        }

        shake();
        return {
          ...prev,
          health,
        };
      });
    }
  };

  const shake = () =>
    controls.start({
      x: [0, -8, 8, -6, 6, -4, 4, -2, 2, 0],
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    });

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Flex
        backgroundImage={assets.gameBg}
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        height="100vh"
        color="white"
        flex={1}
      >
        <VStack
          flexDirection="column"
          flex={1}
          alignItems="center"
          justifyContent="space-between"
          padding={8}
        >
          <Player player={opponent} animationControl={controls} />
          <CardsPool opponentCards={opponent.cards} userCards={userCards} />
          <Player
            player={{ ...user, profileImage: userData?.nftsData?.image }}
          />
        </VStack>
        <Flex position="absolute" right={50} alignItems="center" height="100%">
          <Button
            colorScheme="twitter"
            width={120}
            height={50}
            onClick={() => navigate("/")}
            style={{ fontSize: "25px" }}
          >
            EXIT
          </Button>
        </Flex>
      </Flex>
      <ResultModal
        isOpen={isOpen}
        onClose={onClose}
        user={{ ...user, ...userData }}
        opponent={opponent}
      />
    </DndContext>
  );
}

function CardsPool({ opponentCards, userCards }) {
  return (
    <VStack gap={5}>
      <motion.div
        initial={{ opacity: 0, y: -200, x: -500 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
      >
        <HStack gap={3}>
          {opponentCards.map((card) => (
            <Card {...card} key={card.id} />
          ))}
        </HStack>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 200, x: -500 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
      >
        <HStack gap={3}>
          {userCards.map((card) => (
            <Card {...card} key={card.id} />
          ))}
        </HStack>
      </motion.div>
    </VStack>
  );
}
function Player({ player, animationControl = {} }) {
  const { setNodeRef } = useDroppable({
    id: player.name,
  });

  return (
    <motion.div animate={animationControl}>
      <Box position="relative" ref={setNodeRef}>
        <ProfileImage src={player.profileImage} size={160} />
        <Flex
          position="absolute"
          right={1}
          bottom={1}
          bgGradient="linear(180deg, #F00 0%, #000 100%)"
          alignItems="center"
          justifyContent="center"
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
          }}
        >
          <Text fontWeight="bold" fontSize="smaller">
            {player.health}
          </Text>
        </Flex>
      </Box>
    </motion.div>
  );
}

function Card({ image, name, damage, health, description: id }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: {
      name,
      id,
      damage,
      health,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <VStack
      padding={2}
      backgroundColor="rgba(0, 0, 0, 0.8)"
      height={220}
      borderRadius={10}
      alignItems="center"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      position="relative"
    >
      <Box
        border="3px solid rgba(200, 92, 79, 0.80)"
        borderRadius={10}
        overflow="hidden"
      >
        <Image src={image} height={130} />
      </Box>
      <Text fontWeight="bold" color="whiteAlpha.900">
        {name} {id}
      </Text>
      <Flex
        position="absolute"
        left={1}
        bottom={1}
        bgGradient="linear-gradient(48deg, #D5AD4C 50%, rgba(255, 255, 255, 0.00) 180.16%)"
        alignItems="center"
        justifyContent="center"
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
        }}
      >
        <Text fontWeight="bold" fontSize="smaller">
          {damage}
        </Text>
      </Flex>
      <Flex
        position="absolute"
        right={1}
        bottom={1}
        bgGradient="linear(180deg, #F00 0%, #000 100%)"
        alignItems="center"
        justifyContent="center"
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
        }}
      >
        <Text fontWeight="bold" fontSize="smaller">
          {health}
        </Text>
      </Flex>
    </VStack>
  );
}

function ResultModal({ isOpen, onClose, user, opponent }) {
  function MediumText({ children, ...rest }) {
    return (
      <Text fontWeight="medium" {...rest}>
        {children}
      </Text>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent
        style={{
          minWidth: 800,
          padding: 20,
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
      >
        <ModalHeader alignSelf="center">Game Summary</ModalHeader>
        <ModalBody>
          <Heading color="twitter" textAlign="center" flex={1}>
            VICTORY!
          </Heading>
          <HStack gap={5} alignItems="center" justifyContent="space-around">
            <VStack>
              <MediumText fontSize="2xl">YOU</MediumText>
              <MediumText>Player: 0xWilliamHong</MediumText>
              <ProfileImage src={user.nftsData?.image} size={160} />
              <MediumText fontSize="lg" fontWeight="bold">
                {user.nftsData?.name} {user.nftsData?.description}
              </MediumText>
              <MediumText>
                Token Wins: {user.nftsData?.properties?.wins} + 1
              </MediumText>
              <MediumText>
                Token Losses: {user.nftsData?.properties?.losses}
              </MediumText>
              <MediumText>
                Damage Dealt: {user.nftsData?.properties?.damageDealt} + 105
              </MediumText>
            </VStack>
            <VStack>
              <MediumText fontSize="2xl">OPPONENT</MediumText>
              <MediumText>Player: {opponent.ens}</MediumText>
              <ProfileImage src={opponent.profileImage} size={160} />
              <MediumText fontSize="lg" fontWeight="bold">
                {opponent.nft.name} #{opponent.nft.id}
              </MediumText>
              <MediumText>Token Wins: 1102</MediumText>
              <MediumText>Token Losses: 118 + 1</MediumText>
              <MediumText>Damage Dealt: 53220</MediumText>
            </VStack>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default Game;

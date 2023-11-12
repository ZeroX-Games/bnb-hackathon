import { ethers } from "ethers";
import { useLocation, useNavigate } from "react-router-dom";

import { assets } from "@/assets";
import Button from "@/components/Button";
import ImageStack from "@/components/ImageStack";
import ProfileImage from "@/components/ProfileImage";
// import ellipsisLongId from '@/utils/ellipsisLongId';
import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  CloseButton,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import apiClient from "@/utils/apiClient";

function FriendsCollection() {
  const navigate = useNavigate();
  const location = useLocation();
  const friend = location?.state?.friend;
  const nfts = [friend.nftDataOne, friend.nftDataTwo, friend.nftDataThree];

  console.log(friend, nfts);

  async function lootCollection() {
    alert(
      `You just sent a loot message through Polyhedra. Ask them to check the message on Polyhedra! \n` +
        `---------- \n` +
        `Message Receiver Address: 0x7531F8b0B578610bA654f100241cC227A6E68829 \n` +
        `---------- \n` +
        `Message Content: \n` +
        `Hello, your friend williamhong.eth / @0xWilliamHong looted your token BAKC #711 to play a game! Check with them to get a link to the game!`
    );

    console.log("Looting notification:");
  }

  return (
    <Flex
      flex={4}
      height="100%"
      borderRadius={10}
      backgroundColor="rgba(0, 0, 0, 0.8)"
      padding={5}
      flexDirection="column"
      justifyContent="flex-start"
      gap={10}
    >
      <Flex flexDirection="row">
        <IconButton
          colorScheme="whiteAlpha"
          aria-label="Back"
          icon={<ChevronLeftIcon boxSize={8} />}
          onClick={() => navigate("/friends")}
          variant="unstyled"
        />
        <Flex flex={1} alignItems="center" justifyContent="center">
          <Heading>Friend's Collections</Heading>
        </Flex>
        <CloseButton
          alignSelf="flex-end"
          size="lg"
          onClick={() => navigate("/")}
        />
      </Flex>
      <HStack key={friend.publicKey} gap={5}>
        <ProfileImage src={friend.nftOwner?.image} size={160} />
        <VStack alignItems="flex-start">
          <Text>{friend.name}</Text>
          <HStack>
            <Image
              src={assets.bnbdomain}
              width={30}
              height={30}
              borderRadius={5}
            />
            <Text fontWeight="medium" color="whiteAlpha.800">
              {friend.bnbdomain}
            </Text>
          </HStack>
          <HStack>
            <Image src={assets.ens} width={30} height={30} borderRadius={5} />
            <Text fontWeight="medium" color="whiteAlpha.800">
              {friend.ens}
            </Text>
          </HStack>
          <HStack>
            <Image src={assets.eth} width={30} height={30} borderRadius={5} />
            <Text fontWeight="medium" color="whiteAlpha.800">
              {friend.publicKey}
            </Text>
          </HStack>
          <HStack>
            <Image
              src={assets.twitter}
              width={30}
              height={30}
              borderRadius={5}
            />
            <Text fontWeight="medium" color="whiteAlpha.800">
              {friend.twitter}
            </Text>
          </HStack>
        </VStack>
      </HStack>
      <HStack gap={20} padding={5}>
        <VStack gap={5}>
          <Text fontWeight="bold">Card Collections</Text>
          <HStack gap={10}>
            {nfts?.slice(0, 2).map((nft) => (
              <VStack gap={5}>
                <ImageStack images={[nft.image]} />
                <Button
                  colorScheme="twitter"
                  height={50}
                  onClick={lootCollection}
                >
                  Loot
                </Button>
              </VStack>
            ))}
          </HStack>
        </VStack>
        <VStack gap={5}>
          <Text fontWeight="bold">Player Collections</Text>
          <ImageStack images={[nfts[2].image]} />
          <Button colorScheme="pink" height={50}>
            Loot
          </Button>
        </VStack>
      </HStack>
    </Flex>
  );
}

export default FriendsCollection;

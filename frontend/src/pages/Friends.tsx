import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CloseButton,
  Flex,
  Heading,
  HStack,
  Image,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { assets } from "@/assets";
import Button from "@/components/Button";
import ProfileImage from "@/components/ProfileImage";
import apiClient from "@/utils/apiClient";
import ellipsisLongId from "@/utils/ellipsisLongId";

function Friends() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<any>();

  async function inviteToGame() {
    alert(
      `You just sent an invitation on Push Chat. Ask them to log into Push Chat to receive the message! https://app.push.org/chat \n` +
        `---------- \n` +
        `Message Sender Address: "placeholder"\n` +
        `---------- \n` +
        `Message Receiver Address: "placeholder"\n` +
        `---------- \n` +
        `Message Content: \n` +
        `Hello, your friend 0022533.eth / @0xmartinzerox is inviting you to play a game! Check with them to get a link to the game!`
    );

    console.log("Invite to game message:");
  }
  useEffect(() => {
    const fetchData = async () => {
      const res = await apiClient.get<any>(
        "/twitter-followers-profile-and-nfts-info/0xc6c4aaa9c6fa57fb938d864999a713bc7c72e1d1"
      );

      console.log(Object.values(res[0]));

      setFriends(Object.values(res[0]));
    };

    fetchData();
  }, []);

  return (
    <Flex
      flex={4}
      height="100%"
      borderRadius={10}
      backgroundColor="rgba(0, 0, 0, 0.8)"
      padding={5}
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Flex flexDirection="row">
        <Flex flex={1} alignItems="center" justifyContent="center">
          <Heading>Friends</Heading>
        </Flex>
        <CloseButton
          alignSelf="flex-end"
          size="lg"
          onClick={() => navigate("/")}
        />
      </Flex>
      <VStack gap={10}>
        {friends ? (
          friends.map((friend) => (
            <HStack key={friend.id} justifyContent="space-around" width="100%">
              <ProfileImage src={friend.nftOwner?.image} size={160} />
              <VStack>
                <Text as="b">{friend.name}</Text>
                <Text>{friend.ens}</Text>
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
                <HStack>
                  <Image
                    src={assets.eth}
                    width={30}
                    height={30}
                    borderRadius={5}
                  />
                  <Text fontWeight="medium" color="whiteAlpha.800">
                    {ellipsisLongId(friend.publicKey)}
                  </Text>
                </HStack>
                <HStack>
                  <Image
                    src={assets.bnbdomain}
                    width={30}
                    height={30}
                    borderRadius={5}
                  />
                  <Text fontWeight="medium" color="whiteAlpha.800">
                    {ellipsisLongId(friend.nextId)}
                  </Text>
                </HStack>
              </VStack>
              <HStack gap={3}>
                <Button
                  colorScheme="twitter"
                  height={50}
                  onClick={() =>
                    navigate(`/friends/${friend.publicKey}`, {
                      state: { friend },
                    })
                  }
                >
                  View Collections
                </Button>
                <Button colorScheme="pink" height={50} onClick={inviteToGame}>
                  Invite to Game
                </Button>
              </HStack>
            </HStack>
          ))
        ) : (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        )}
      </VStack>
    </Flex>
  );
}

export default Friends;

import { Outlet, useLocation } from "react-router-dom";

import {
  Box,
  Flex,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
  Spinner,
} from "@chakra-ui/react";

import { assets } from "../assets";

import ImageStack from "./ImageStack";
import ProfileImage from "./ProfileImage";
import { useEffect, useState } from "react";
import apiClient from "@/utils/apiClient";
import ellipsisLongId from "@/utils/ellipsisLongId";

import LoginComponent from "./LoginComponent";

function MainLayout() {
  const location = useLocation();
  const loginData = location.state?.loginData;
  const [userData, setUserData] = useState<any>();

  const [loggedIn, setLoggedIn] = useState(false);

  console.log(loginData);

  useEffect(() => {
    const fetchData = async () => {
      const res = await apiClient.get(
        "/twitter-profile-and-nfts-info/0xc6c4aaa9c6fa57fb938d864999a713bc7c72e1d1"
      );

      console.log(res);
      setUserData(res);
    };

    fetchData();
  }, []);

  return (
    <Flex
      backgroundImage={assets.mainBg}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      height="100vh"
      color="white"
      padding={8}
    >
      <HStack flex={1} gap={8}>
        <Flex
          flex={7}
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Outlet context={{ userData }} />
        </Flex>
        <Flex
          flex={3}
          height="100%"
          borderRadius={10}
          backgroundColor="rgba(0, 0, 0, 0.8)"
          padding={5}
          flexDirection="column"
          alignItems="center"
          justifyContent={loggedIn ? "" : "center"}
        >
          <Heading marginBottom={2}>
            <HStack gap={5}>
              {loggedIn && <div>Profile</div>}
              <LoginComponent loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            </HStack>
          </Heading>

          {loggedIn && userData ? (
            <VStack gap={1}>
              <ProfileImage src={userData?.nftsData?.image} />
              <Text fontSize="2xl" fontWeight="bold">
                {userData?.twitterData?.identity?.displayName}
              </Text>
              <HStack>
                <Image
                  src={assets.ens}
                  width={30}
                  height={30}
                  borderRadius={5}
                />
                <Text fontWeight="medium" color="whiteAlpha.800">
                  {userData?.ensData?.[0].identity.displayName}
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
                  {userData?.twitterData?.identity?.displayName}
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
                  {ellipsisLongId(
                    userData?.nextIdData?.[0].identity?.displayName
                  )}
                </Text>
              </HStack>
              <HStack gap={10}>
                <VStack gap={5}>
                  <Text fontWeight="bold">Card Collections</Text>
                  <ImageStack images={[assets.mayc8102, assets.mayc14276]} />
                </VStack>
                <VStack gap={5}>
                  <Text fontWeight="bold">Avatar Collections</Text>
                  <ImageStack images={[assets.bayc8954, assets.bayc1463]} />
                </VStack>
              </HStack>
            </VStack>
          ) : (
            // <Spinner
            //   thickness="4px"
            //   speed="0.65s"
            //   emptyColor="gray.200"
            //   color="blue.500"
            //   size="xl"
            // />
            <></>
          )}
        </Flex>
      </HStack>
    </Flex>
  );
}

export default MainLayout;

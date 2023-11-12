import express from "express";
const app = express();
const PORT = 3000;
import ethers from "ethers";
import axios from "axios";
import cors from "cors";
import { exec as originalExec } from "child_process";
import { promisify } from "util";
const exec = promisify(originalExec);
import dotenv from "dotenv";
dotenv.config();
import utf8 from "utf8";

app.use(cors());

// Basic GET call
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// GET call for fetching twitter user profile & their NFTs under given publicKey
app.get("/twitter-profile-and-nfts-info/:publicKey", (req, res) => {
  let { publicKey } = req.params;
  publicKey = String(publicKey);

  const ENDPOINT_URL = "	https://relation-service.next.id";

  const query = `
        # Write your query or mutation here
        query findOneIdentityWithSourceETH {
            identity(platform: "ethereum", identity: "${publicKey}") {
                uuid
                platform
                identity
                displayName
                createdAt
                addedAt
                updatedAt
                # Here we perform a 3-depth deep search for this identity's "neighbor".
                neighbor(depth: 5) {
                    sources # Which upstreams provide these connection infos.
                    identity {
                        uuid
                        platform
                        identity
                        displayName
                    }
                }
            }
        }
    `;

  const nftData = {
    name: "Otherside Koda",
    description: "#7781",
    tokenId: "",
    image:
      "https://gateway.lighthouse.storage/ipfs/QmRYKYZXcLVnD11a7axkrT3nGsj7fVTTxnik6jtRRR4eJz",
    properties: { wins: 20, losses: 8, damageDealt: 1253 },
  };
  const nftsCardUsedInGame = [
    {
      nftDataCardOne: {
        name: "MAYC",
        description: "#5361",
        tokenId: "",
        image:
          "https://gateway.lighthouse.storage/ipfs/QmXTXz4fS71RZ5Vjjm6Tmr7nZMvJtu8mNFoVoWYFNGYoYc",
        properties: { wins: 0, losses: 0, damageDealt: 0 },
      },
    },
    {
      nftDataCardTwo: {
        name: "BAKC",
        description: "#711",
        tokenId: "",
        image:
          "https://gateway.lighthouse.storage/ipfs/QmSJPyL2stzftDoPZooty4DJq17zDro6X19BwXJYReQTYX",
        properties: { wins: 0, losses: 0, damageDealt: 0 },
      },
    },
    {
      nftDataCardThree: {
        name: "MAYC",
        description: "#8102",
        tokenId: "",
        image:
          "https://gateway.lighthouse.storage/ipfs/QmSmiBcE3fZVmMsKwHr5uWyQqcitE9NM13yQ4yzyXv4nF3",
        properties: { wins: 0, losses: 0, damageDealt: 0 },
      },
    },
    {
      nftDataCardFour: {
        name: "y00t",
        description: "#5650",
        tokenId: "",
        image:
          "https://gateway.lighthouse.storage/ipfs/QmbAenSLCVwvgXFMUjJHs4g1a6niUYcc6bPzmTSRG2FMKK",
        properties: { wins: 0, losses: 0, damageDealt: 0 },
      },
    },
  ];
  // https://gateway.lighthouse.storage/ipfs/QmbW2EqLwu93ddwbYq6CxL2f37ZNzzcDJt5uz9AbdZLGhb
  // https://gateway.lighthouse.storage/ipfs/QmRrjp147g3g3hDfFTBKMrcmk6B1fea5UJmPzqrgZK5ovE
  // https://gateway.lighthouse.storage/ipfs/QmRWdHD3xNjULBEUFspRp6vVpWpkpvqTLpufBad1PddnUr
  // https://gateway.lighthouse.storage/ipfs/QmVu5uggQFWJBJ6Aiu37Q7V6CpCFT4HMRuY2WASttYTHCU
  // https://gateway.lighthouse.storage/ipfs/QmUmU8PGJtCwEBXwLAREQ4xFHE1gR5CxYk61hBrVvv4SSW

  axios({
    url: ENDPOINT_URL,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add any other headers here. For example, authentication tokens.
    },
    data: JSON.stringify({
      query: query,
    }),
  })
    .then((result) => {
      console.log(JSON.stringify(result.data));
      console.log(JSON.stringify(result.data.data.identity.neighbor));

      const data = result.data.data.identity.neighbor;

      function findByDisplayName(name) {
        return data.find((item) => item.identity.displayName === name);
      }
      const outputTwitter = findByDisplayName("0xmartinzerox");
      console.log(outputTwitter);

      function findByPlatform(platformValue) {
        return data.filter((item) => item.identity.platform === platformValue);
      }
      const outputNextId = findByPlatform("nextid");
      console.log(outputNextId);

      function findByPlatformWithNonEmptyDisplayName(platformValue) {
        return data.filter(
          (item) =>
            item.identity.displayName !== "" &&
            item.identity.platform === platformValue
        );
      }
      const outputEns = findByPlatformWithNonEmptyDisplayName("ethereum");
      console.log(outputEns);

      const outputJson = {
        publicKey: publicKey,
        twitterData: outputTwitter,
        nextIdData: outputNextId,
        ensData: outputEns,
        nftsData: nftData,
        nftsCardUsedInGame: nftsCardUsedInGame,
      };

      console.log(outputJson);

      // res.send(`Hello, ${publicKey}, with twitter data: ${JSON.stringify(output)}, with NFTs data: ${JSON.stringify(nftData)}`);
      res.send(outputJson);
    })
    .catch((error) => {
      console.error("Error fetching data:", error); // Handle error
      res.send(error);
    });
});

// GET call for fetching twitter user's following users infos & their three NFTs under given publicKey
app.get("/twitter-followers-profile-and-nfts-info/:publicKey", (req, res) => {
  let { publicKey } = req.params;
  publicKey = String(publicKey);

  // Use the Relation Service & GraphQL to fetch the followers's info and their NFTs:
  // By using this query, we expect to fetch info such as their name, ens, publicKey, nextId, and twitter account info
  const ENDPOINT_URL = "	https://relation-service.next.id";

  const query = `
        # Write your query or mutation here
        query findOneIdentityWithSourceETH {
            identity(platform: "ethereum", identity: "${publicKey}") {
                uuid
                platform
                identity
                displayName
                createdAt
                addedAt
                updatedAt
                # Here we perform a 3-depth deep search for this identity's "neighbor".
                neighbor(depth: 5) {
                    sources # Which upstreams provide these connection infos.
                    identity {
                        uuid
                        platform
                        identity
                        displayName
                    }
                }
            }
        }
    `;

  // In this example we will just manually create a psedo response from the Relation Service
  const friendsInfo = [
    {
      friendOne: {
        name: "Delon Musk",
        ens: "delonmusk",
        twitter: "delonmusk",
        publicKey: "0x7531F8b0B578610bA654f100241cC227A6E68829",
        nextId:
          "0x0751ec21256825ce604950580978a8961c5af03e50028f936e528de34fc9517978",
        nftOwner: {
          name: "NFT Owner for Friend One",
          description: "#1463",
          tokenId: "",
          image:
            "https://gateway.lighthouse.storage/ipfs/Qmb4wPZd6c5urTyrmttmaeSwGmUQNzi1WD5GFrM9f8HfBM",
          properties: { wins: 1, losses: 1, damageDealt: 1 },
        },
        // https://gateway.lighthouse.storage/ipfs/QmXmjc3qhGRz8qzhEx1gJ1tLbEVdt3wzyKFt8Zi83JWzbQ
        nftDataOne: {
          name: "NFT One for Friend One",
          description: "#6529",
          tokenId: "",
          image:
            "https://gateway.lighthouse.storage/ipfs/Qmaqt2vyYvcyTZcAvLg1K3Sm92iAVskz9nugy7pbL4RDDR",
          properties: { wins: 0, losses: 0, damageDealt: 0 },
        },
        // https://gateway.lighthouse.storage/ipfs/QmW56U5hG3DRtG3yUtAtPcNLvraojZYgnzrRVkjnTJ8jBN
        nftDataTwo: {
          name: "NFT Two for Friend One",
          description: "#711",
          tokenId: "",
          image:
            "https://gateway.lighthouse.storage/ipfs/QmcFgCZjmw4hyzXbmiXpYeVPpJaUc2gjFGpZJsw9zo869f",
          properties: { wins: 0, losses: 0, damageDealt: 0 },
        },
        // https://gateway.lighthouse.storage/ipfs/QmcABrZ8EtVvnPmhVrUCNEfuMzTRTXTpX5QGoXGj9duA37
        nftDataThree: {
          name: "NFT Three for Friend One",
          description: "#8102",
          tokenId: "",
          image:
            "https://gateway.lighthouse.storage/ipfs/Qmca6nZpEWS3o6dTvfJrA6o9MqfRXdnew4vnxHw9wqR9Q2",
          properties: { wins: 0, losses: 0, damageDealt: 0 },
        },
        // https://gateway.lighthouse.storage/ipfs/QmNycBL5dUcLgqKmLKcyY4aEzxNA7TKdb8r6jqSyZp8wA6
      },
      friendTwo: {
        name: "Maruno Bars",
        ens: "marunobars.eth",
        twitter: "marunobars",
        publicKey: "0xD787251f236940723492Ab32d18C6948b9aFAcB6",
        nextId:
          "0x0978a8961c5af03e50028f936e528de34fc95179780751ec21256825ce60495058",
        nftOwner: {
          name: "NFT Owner for Friend Two",
          description: "#6139",
          tokenId: "",
          image:
            "https://gateway.lighthouse.storage/ipfs/QmQ1A6Qi99GP9Dp7k4QHoFMMuNmvDuTQALUDXrfGYLGVrz",
          properties: { wins: 2, losses: 2, damageDealt: 2 },
        },
        // https://gateway.lighthouse.storage/ipfs/QmNcMKuXGq8QurHYRLjzcb1UCMQeHNLsVVCKBiVYW9Jeut
        nftDataOne: {
          name: "NFT One for Friend One",
          description: "#6529",
          tokenId: "",
          image:
            "https://gateway.lighthouse.storage/ipfs/Qmaqt2vyYvcyTZcAvLg1K3Sm92iAVskz9nugy7pbL4RDDR",
          properties: { wins: 0, losses: 0, damageDealt: 0 },
        },
        // https://gateway.lighthouse.storage/ipfs/QmW56U5hG3DRtG3yUtAtPcNLvraojZYgnzrRVkjnTJ8jBN
        nftDataTwo: {
          name: "NFT Two for Friend One",
          description: "#711",
          tokenId: "",
          image:
            "https://gateway.lighthouse.storage/ipfs/QmcFgCZjmw4hyzXbmiXpYeVPpJaUc2gjFGpZJsw9zo869f",
          properties: { wins: 0, losses: 0, damageDealt: 0 },
        },
        // https://gateway.lighthouse.storage/ipfs/QmcABrZ8EtVvnPmhVrUCNEfuMzTRTXTpX5QGoXGj9duA37
        nftDataThree: {
          name: "NFT Three for Friend One",
          description: "#8102",
          tokenId: "",
          image:
            "https://gateway.lighthouse.storage/ipfs/Qmca6nZpEWS3o6dTvfJrA6o9MqfRXdnew4vnxHw9wqR9Q2",
          properties: { wins: 0, losses: 0, damageDealt: 0 },
        },
        // https://gateway.lighthouse.storage/ipfs/QmNycBL5dUcLgqKmLKcyY4aEzxNA7TKdb8r6jqSyZp8wA6
      },
      friendThree: {
        name: "Two Ok Rock",
        ens: "20969.eth",
        twitter: "twookrock",
        publicKey: "0xEdCC429d2e8770034e692EA4bf51A94f04B27010",
        nextId:
          "0x028f936e528de34fc95179780751ec21256825ce604950580978a8961c5af03e50",
        nftOwner: {
          name: "NFT Owner for Friend Three",
          description: "#8954",
          tokenId: "",
          image:
            "https://gateway.lighthouse.storage/ipfs/QmenkxjF7WEN1u3gwmpbXCpK63py2EHyDA6e375XiBPx9x",
          properties: { wins: 3, losses: 3, damageDealt: 3 },
        },
        // https://gateway.lighthouse.storage/ipfs/QmabBK1DBcDixJET8UsRrmgfKmiXLo1VKGQMRJzAURr8J8
        nftDataOne: {
          name: "NFT One for Friend One",
          description: "#6529",
          tokenId: "",
          image:
            "https://gateway.lighthouse.storage/ipfs/Qmaqt2vyYvcyTZcAvLg1K3Sm92iAVskz9nugy7pbL4RDDR",
          properties: { wins: 0, losses: 0, damageDealt: 0 },
        },
        // https://gateway.lighthouse.storage/ipfs/QmW56U5hG3DRtG3yUtAtPcNLvraojZYgnzrRVkjnTJ8jBN
        nftDataTwo: {
          name: "NFT Two for Friend One",
          description: "#711",
          tokenId: "",
          image:
            "https://gateway.lighthouse.storage/ipfs/QmcFgCZjmw4hyzXbmiXpYeVPpJaUc2gjFGpZJsw9zo869f",
          properties: { wins: 0, losses: 0, damageDealt: 0 },
        },
        // https://gateway.lighthouse.storage/ipfs/QmcABrZ8EtVvnPmhVrUCNEfuMzTRTXTpX5QGoXGj9duA37
        nftDataThree: {
          name: "NFT Three for Friend One",
          description: "#8102",
          tokenId: "",
          image:
            "https://gateway.lighthouse.storage/ipfs/Qmca6nZpEWS3o6dTvfJrA6o9MqfRXdnew4vnxHw9wqR9Q2",
          properties: { wins: 0, losses: 0, damageDealt: 0 },
        },
        // https://gateway.lighthouse.storage/ipfs/QmNycBL5dUcLgqKmLKcyY4aEzxNA7TKdb8r6jqSyZp8wA6
      },
    },
  ];

  axios({
    url: ENDPOINT_URL,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Add any other headers here. For example, authentication tokens.
    },
    data: JSON.stringify({
      query: query,
    }),
  })
    .then((result) => {
      console.log(result.data);
      const outputJson = friendsInfo;
      console.log(outputJson);
      res.send(outputJson);
    })
    .catch((error) => {
      console.error("Error fetching data:", error); // Handle error
      res.send(error);
    });
});

// GET send the updated information to blockchain
app.get("/updated-info/:tokenWins/:tokenLosses/:damageDealt", (req, res) => {
  let { tokenWins, tokenLosses, damageDealt } = req.params;
  console.log(tokenWins, tokenLosses, damageDealt);

  try {
    const nftMetadata = {
      name: "",

      description: "",
      tokenId: "",

      image: "",

      properties: {
        wins: tokenWins,
        losses: tokenLosses,
        damageDealt: damageDealt,
      },
    };
    console.log(JSON.stringify(nftMetadata));

    // Function to convert a string to its hexadecimal representation
    function stringToHex(str) {
      let hex = "0x";
      for (let i = 0; i < str.length; i++) {
        hex += str.charCodeAt(i).toString(16);
      }
      return hex;
    }
    // Convert the string to its hexadecimal representation
    const messageInUtf8Test = stringToHex(JSON.stringify(nftMetadata));
    console.log(messageInUtf8Test);

    // Below are cross-chain logic, using Hyperlane
    // (Polygon zkEVM Testnet -> Scroll Sepolia Testnet):
    // https://testnet-zkevm.polygonscan.com/address/0xf35A1e1AD5Bb09B84D99c7A368Adf45A2FC4c6A9
    // https://testnet-zkevm.polygonscan.com/address/0x598face78a4302f11e3de0bee1894da0b2cb71f8
    // https://sepolia-blockscout.scroll.io/address/0xa3AB7E6cE24E6293bD5320A53329Ef2f4DE73fCA/logs#address-tabs
    const originChainMailboxContractAddress =
      "0x598facE78a4302f11E3de0bee1894Da0b2Cb71F8";
    const targetChainId = "534351";
    const recipientAddress =
      "0x000000000000000000000000a3AB7E6cE24E6293bD5320A53329Ef2f4DE73fCA";
    const messageInUtf8 = messageInUtf8Test;
    const rpcProviderUrl =
      "https://polygonzkevm-testnet.g.alchemy.com/v2/i4jigzkSJRE9rGw9PfTrcH9FKSlCqBDs";
    const privateKey =
      "f4d61c6f7b352c1a58caca0055c0b5ce343d5b4d0d68dd46f7d892808f0df751";

    const quotePrice = async () => {
      const quoteScript = `
            #!/bin/bash
            
            cast call ${originChainMailboxContractAddress} "quoteDispatch(uint32,bytes32,bytes)" ${targetChainId} ${recipientAddress} ${messageInUtf8} --rpc-url ${rpcProviderUrl}
            `;

      try {
        const { stdout } = await exec(
          `bash -c "${quoteScript.replace(/"/g, '\\"')}"`
        );
        console.log(`stdout: ${stdout}`);
        return stdout.trim();
      } catch (error) {
        console.error(`exec error: ${error}`);
      }
    };

    const sendTx = async (quote) => {
      console.log(quote);

      const sendScript = `
            #!/bin/bash
            
            cast send ${originChainMailboxContractAddress} "dispatch(uint32,bytes32,bytes)" ${targetChainId} ${recipientAddress} ${messageInUtf8} --value ${quote} --rpc-url ${rpcProviderUrl} --private-key ${privateKey}
            `;

      try {
        const { stdout } = await exec(
          `bash -c "${sendScript.replace(/"/g, '\\"')}"`
        );
        console.log(`stdout: ${stdout}`);
      } catch (error) {
        console.error(`exec error: ${error}`);
      }
    };

    (async () => {
      let quote = await quotePrice();
      quote = quote * 5;
      await sendTx(quote);
    })();

    console.log("successful");
    res.status(200).json({ message: "Success!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred:", error: error.message });
  }
});

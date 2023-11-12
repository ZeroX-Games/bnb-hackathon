import express from "express";
const app = express();
const PORT = 3000;
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

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
  const nftData = {
    name: "BAYC",
    description: "#1463",
    tokenId: "",
    image:
      "https://gnfd-testnet-sp2.bnbchain.org/view/zerox-nft-image/bayc-1463.jpg",
    properties: { wins: 20, losses: 8, damageDealt: 1253 },
  };
  const nftsCardUsedInGame = [
    {
      nftDataCardOne: {
        name: "Pancake",
        description: "#1025",
        tokenId: "",
        image:
          "https://i.seadn.io/gae/w1lr7HDTUxQKMj-8_Y6aaoQIo7HKoHkLMcsmFNcuX_Tqd9CjuPfWw8fUM75WNCRjc-UFcAKMMHMr7w1ECyhLPaOJfiLd0PqrOYHWww?auto=format&dpr=1&w=1000",
        properties: { wins: 0, losses: 0, damageDealt: 0 },
      },
    },
    {
      nftDataCardTwo: {
        name: "BAKC",
        description: "#711",
        tokenId: "",
        image:
          "https://gnfd-testnet-sp2.bnbchain.org/view/zerox-nft-image/bakc-711.jpg",
        properties: { wins: 0, losses: 0, damageDealt: 0 },
      },
    },
    {
      nftDataCardThree: {
        name: "DOODLES",
        description: "#2319",
        tokenId: "",
        image:
          "https://gnfd-testnet-sp2.bnbchain.org/view/zerox-nft-image/doodles-2319.jpg",
        properties: { wins: 0, losses: 0, damageDealt: 0 },
      },
    },
    {
      nftDataCardFour: {
        name: "y00ts",
        description: "#5650",
        tokenId: "",
        image:
          "https://gnfd-testnet-sp2.bnbchain.org/view/zerox-nft-image/yoots-5650.jpg",
        properties: { wins: 0, losses: 0, damageDealt: 0 },
      },
    },
  ];

  const outputJson = {
    nftsData: nftData,
    nftsCardUsedInGame: nftsCardUsedInGame,
  };

  console.log(outputJson);

  // res.send(`Hello, ${publicKey}, with twitter data: ${JSON.stringify(output)}, with NFTs data: ${JSON.stringify(nftData)}`);
  res.send(outputJson);
});

// GET call for fetching twitter user's following users infos & their three NFTs under given publicKey
app.get("/twitter-followers-profile-and-nfts-info/:publicKey", (req, res) => {
  const friendsInfo = [
    {
      friendOne: {
        name: "Delon Musk",
        ens: "delonmusk.eth",
        twitter: "delonmusk",
        publicKey: "0x7531F8b0B578610bA654f100241cC227A6E68829",
        bnbdomain: "delonmusk.bnb",
        nftOwner: {
          name: "NFT Owner for Friend One",
          description: "#1463",
          tokenId: "",
          image:
            "https://ipfs.io/ipfs/QmWyx6K3rzrS54dpvSwrPMGJi4nypdS8vwBuexH2A46scV",
          properties: { wins: 1, losses: 1, damageDealt: 1 },
        },
        nftDataOne: {
          name: "NFT One for Friend One",
          description: "#6529",
          tokenId: "",
          image:
            "https://gnfd-testnet-sp2.bnbchain.org/view/zerox-nft-image/yoots-10142.jpg",
          properties: { wins: 0, losses: 0, damageDealt: 0 },
        },
        nftDataTwo: {
          name: "NFT Two for Friend One",
          description: "#711",
          tokenId: "",
          image:
            "https://gnfd-testnet-sp2.bnbchain.org/view/zerox-nft-image/bakc-711.jpg",
          properties: { wins: 0, losses: 0, damageDealt: 0 },
        },
        nftDataThree: {
          name: "NFT Three for Friend One",
          description: "#8102",
          tokenId: "",
          image:
            "https://ipfs.io/ipfs/QmWyx6K3rzrS54dpvSwrPMGJi4nypdS8vwBuexH2A46scV",
          properties: { wins: 0, losses: 0, damageDealt: 0 },
        },
      },
      friendTwo: {
        name: "Maruno Bars",
        ens: "marunobars.eth",
        twitter: "marunobars",
        publicKey: "0xD787251f236940723492Ab32d18C6948b9aFAcB6",
        bnbdomain: "marunobars.bnb",
        nftOwner: {
          name: "NFT Owner for Friend Two",
          description: "#6139",
          tokenId: "",
          image:
            "https://gnfd-testnet-sp2.bnbchain.org/view/zerox-nft-image/bayc-6139.jpg",
          properties: { wins: 2, losses: 2, damageDealt: 2 },
        },
        nftDataOne: {
          name: "NFT One for Friend One",
          description: "#6529",
          tokenId: "",
          image:
            "https://gnfd-testnet-sp2.bnbchain.org/view/zerox-nft-image/yoots-10142.jpg",
          properties: { wins: 0, losses: 0, damageDealt: 0 },
        },
        nftDataTwo: {
          name: "NFT Two for Friend One",
          description: "#711",
          tokenId: "",
          image:
            "https://gnfd-testnet-sp2.bnbchain.org/view/zerox-nft-image/bakc-711.jpg",
          properties: { wins: 0, losses: 0, damageDealt: 0 },
        },
        nftDataThree: {
          name: "NFT Three for Friend One",
          description: "#8102",
          tokenId: "",
          image:
            "https://gnfd-testnet-sp2.bnbchain.org/view/zerox-nft-image/bayc-6139.jpg",
          properties: { wins: 0, losses: 0, damageDealt: 0 },
        },
      },
      friendThree: {
        name: "Two Ok Rock",
        ens: "20969.eth",
        twitter: "twookrock",
        publicKey: "0xEdCC429d2e8770034e692EA4bf51A94f04B27010",
        bnbdomain: "20969.bnb",
        nftOwner: {
          name: "NFT Owner for Friend Three",
          description: "#8954",
          tokenId: "",
          image:
            "https://gateway.lighthouse.storage/ipfs/QmenkxjF7WEN1u3gwmpbXCpK63py2EHyDA6e375XiBPx9x",
          properties: { wins: 3, losses: 3, damageDealt: 3 },
        },
        nftDataOne: {
          name: "NFT One for Friend One",
          description: "#6529",
          tokenId: "",
          image:
            "https://gnfd-testnet-sp2.bnbchain.org/view/zerox-nft-image/yoots-10142.jpg",
          properties: { wins: 0, losses: 0, damageDealt: 0 },
        },
        nftDataTwo: {
          name: "NFT Two for Friend One",
          description: "#711",
          tokenId: "",
          image:
            "https://gnfd-testnet-sp2.bnbchain.org/view/zerox-nft-image/bakc-711.jpg",
          properties: { wins: 0, losses: 0, damageDealt: 0 },
        },
        nftDataThree: {
          name: "NFT Three for Friend One",
          description: "#8102",
          tokenId: "",
          image:
            "https://gateway.lighthouse.storage/ipfs/QmenkxjF7WEN1u3gwmpbXCpK63py2EHyDA6e375XiBPx9x",
          properties: { wins: 0, losses: 0, damageDealt: 0 },
        },
      },
    },
  ];

  const outputJson = friendsInfo;
  console.log(outputJson);
  res.send(outputJson);
});

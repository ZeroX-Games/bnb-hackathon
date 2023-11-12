# BNB Istanbul Hackathon

![image](https://github.com/ZeroX-Games/bnb-hackathon/assets/131199919/04aeeaa2-37ac-4653-af9f-4ecb61103810)

Although people recognize NFT buzzwords like BAYC, the majority of NFTs remain underutilized, serving mainly as profile pictures and speculative assets. So, how can we breathe new life into them? In our hackathon, we’ve developed “LooT ur key,” a unique card-based game that demonstrates our innovative solution. This game revive NFT IPs by integrating inventive gaming mechanisms with Web3 Social features within the Binance Ecosystem.

## Game Design

![image](https://github.com/ZeroX-Games/bnb-hackathon/assets/131199919/f285d997-4085-49d9-b765-574295f81f5f)

“LooT ur key” allows players to engage with popular NFT IPs (like BAYC) across various blockchain networks, including Ethereum, Polygon, and BNB Chain, without the necessity of owning the NFTs. Players connect via social media, such as Twitter, fostering an interactive community. Through these social connections, players can “LOOT” (under certain conditions) their friends’ NFTs for gameplay. This interaction activates our smart contract on the OPBNB, facilitating cross-chain NFT interactions and enabling on-chain announcements via the Polyhedra Network’s zkBridge. Additionally, when an NFT is looted, the friend is notified through the Polyhedra Network’s zkMessenger. This adds an exciting, interactive layer to NFT engagement with Web3 gaming.

![image](https://github.com/ZeroX-Games/bnb-hackathon/assets/131199919/e8fbb28f-7763-4a73-a3cf-85eff9a386e1)

![image](https://github.com/ZeroX-Games/bnb-hackathon/assets/131199919/2fdf298f-5aa4-441a-b09a-c0c2c1c7184c)

## Project Architecture

![image](https://github.com/ZeroX-Games/bnb-hackathon/assets/131199919/df570301-f17e-491f-ab51-76fc1cf68b24)

## Folder Structure

- [/frontend](/frontend) contains the front-end React.js app for game demonstration.
- [/backend](/backend) contains the back-end server services.
- [/contracts](/contracts) contains all smart contracts used for the project.
- [/greenfield](/greenfield) contains our usage of BNB Greenfield to host NFT data and tree structures.

## Run the Project

1. Run the Backend Server:

```
cd backend
npm install
node server.js
```

1. Run Game Frontend in a separate terminal tab:

```
cd frontend
npm install
npm run dev
```

Go to [http://localhost:5173](http://localhost:5173/) to play the game!

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts@v4.9.3/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@v4.9.3/utils/Counters.sol";

import "./ERC6551Registry.sol";

// interface IZKBridgeReceiver {
//     // @notice zkBridge endpoint will invoke this function to deliver the message on the destination
//     // @param srcChainId - the source endpoint identifier
//     // @param srcAddress - the source sending contract address from the source chain
//     // @param nonce - the ordered message nonce
//     // @param payload - a custom bytes payload from send chain
//     function zkReceive(uint16 srcChainId, address srcAddress, uint64 nonce, bytes calldata payload) external;
// }

/**
 * @title L00t Your Key
 */
contract l00TUrKey is ERC721URIStorage {
    using Counters for Counters.Counter;

    // Universal Registry and Implementation address
    address constant UNIVERSAL_REGISTRY = 0x865EDe8A5256ee04BD3Ab6d86212344551F8A00B;
    address constant UNIVERSAL_IMPLEMENT = 0x0c64b44b0a9d9c3cCE11FDFf04662e8D6826CE96;
    bytes32 constant UNIVERSAL_SALT = 0x0000000000000000000000000000000000000000000000000000000000000000;
    uint constant MAX_NUM_PLAYER_NFT = 1000000;

    // We have two types of NFTs in this game
    Counters.Counter private _playerIds;
    Counters.Counter private _cardIds;

    // indicates which NFT collections are supported for Player NFT
    mapping(uint => mapping(address => bool)) public supportedPlayerNFT;
    // indicates which NFT collections are supported for Card NFT
    mapping(uint => mapping(address => bool)) public supportedCardNFT;
    // map the original NFT to its local Occupier token ID
    mapping (address => uint) public nftOccupier;

    // mapping between local token ID to its local TBA address
    mapping(uint => address) public tokenIdToTBA;
    mapping(address => uint) public TBAToTokenId;

    // Looting related fields
    mapping(address => string) public nftToURI;
    mapping(address => mapping(address => bool)) public nftLootableBy;

    constructor() ERC721("l00TUrKey", "LYK") {}

    // Register to get a Player NFT, which is in fact l00ting as well!!
    function register(uint chainId, address tokenAddress, uint tokenId)
        public
        returns (uint newItemId, address newTBA)
    {
        require(supportedPlayerNFT[chainId][tokenAddress], "This NFT collection is not supported for a Player NFT.");

        // checks the status of a specific NFT
        address nftId = getNFTId(chainId, tokenAddress, tokenId);
        require(nftOccupier[nftId] == 0, "This NFT has been occupied already.");

        string memory tokenURI = nftToURI[nftId]; 

        // create a local Player NFT for msg.sender
        _playerIds.increment();
        newItemId = _playerIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        // Now create a TBA for this Player NFT
        newTBA = IERC6551Registry(UNIVERSAL_REGISTRY).createAccount(
            UNIVERSAL_IMPLEMENT,
            UNIVERSAL_SALT,
            block.chainid,
            address(this),
            newItemId
        );
        tokenIdToTBA[newItemId] = newTBA;
        TBAToTokenId[newTBA] = newItemId;
        
        // Set the NFT Occupier
        nftOccupier[nftId] = newItemId;
    }

    // L00ting a Card NFT
    function loot(uint chainId, address tokenAddress, uint tokenId)
        public
        returns (uint newItemId)
    {
        require(supportedCardNFT[chainId][tokenAddress], "This NFT collection is not supported for a Card NFT.");

        // checks the status of a specific NFT
        address nftId = getNFTId(chainId, tokenAddress, tokenId);
        require(nftOccupier[nftId] == 0, "This NFT has been looted already.");
        
        // check social media condition
        // require(nftLootableBy[nftId][msg.sender], "NFT not lootable because of social media relationship");
        string memory tokenURI = nftToURI[nftId];

        // create a local Card NFT for the TBA of the corresponding player NFT
        _cardIds.increment();
        newItemId = _cardIds.current()+MAX_NUM_PLAYER_NFT;
        _mint(holdingPlayerNFT(msg.sender), newItemId);
        _setTokenURI(newItemId, tokenURI);

        // Set the NFT Occupier
        nftOccupier[nftId] = newItemId;
    }

    function holdingPlayerNFT(address player) public view returns (address TBA)
    {
        for (uint i=1; i<=_playerIds.current(); i++) 
        {
            if (ownerOf(i) == player) {
                TBA = tokenIdToTBA[i];
                break;
            }
        }
    }

    function addPlayerCollection(uint chainId, address tokenAddress) public
    {
        // For simplicity, we do not implement access control
        supportedPlayerNFT[chainId][tokenAddress] = true;
    }

    function addCardCollection(uint chainId, address tokenAddress) public
    {
        // For simplicity, we do not implement access control
        supportedCardNFT[chainId][tokenAddress] = true;
    }

    function setNFTToURI(uint chainId, address tokenAddress, uint tokenId, string calldata tokenURI) public 
    {
        address nftId = getNFTId(chainId, tokenAddress, tokenId);
        nftToURI[nftId] = tokenURI;
    }

    function setNFTLootableBy(uint chainId, address tokenAddress, uint tokenId, address player) public 
    {
        address nftId = getNFTId(chainId, tokenAddress, tokenId);
        nftLootableBy[nftId][player] = true;
    }

    function getNFTId(
        uint chainId, 
        address tokenAddress, 
        uint tokenId
    ) public view returns (address nftId)
    {
        nftId = IERC6551Registry(UNIVERSAL_REGISTRY).account(
            UNIVERSAL_IMPLEMENT,
            UNIVERSAL_SALT,
            chainId,
            tokenAddress,
            tokenId
        );
    }

    // function zkReceive(
    //     uint16 srcChainId, 
    //     address srcAddress, 
    //     uint64 nonce, 
    //     bytes calldata payload
    // ) external pure override {
    //     (
    //         address tokenAddress,
    //         uint16 tokenChain,
    //         uint256 amount,
    //         address to,
    //         uint16 toChain
    //     ) = abi.decode(payload, (address, uint16, uint256, address, uint16));
    // }
    
}

// Deployed to opBNB testnet at address: 0x74F30dCCBB1D828BF131B7c13D5adA162bf28aA8
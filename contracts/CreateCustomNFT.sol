// SPDX-License-Identifier: MIT OR Apache-2.0

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//this is a storage nft and this is expecting me to provide the ipfs data.. 

contract CreateCustomNFT is ERC721URIStorage, Ownable {
    // this is how we create the token id. 
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    //this is the value of the marketplace smart contract. we have to call that in the function so we can sell those created nfts to the market place.
    address contractAddress;
    uint256 public cost = 0.0075 ether;

// I want to bind to the market place smart contract, so in this order we need to deploy first the market place smart contract and then this customnft create contract.
// here is the name of the token: CryptoUndies and the token Symbol 
    constructor(address marketContract) ERC721("CryptoUndies", "CU") {
        contractAddress = marketContract;
    }

//This expects the token URI that I am going to be generating in the nextjs application
//this function is only invoked when the user wants to mint and also sell the nft in our marketplace. 
    function createNFT(string memory tokenURI) public returns (uint) {
        // the token will start with 1 and every time that another nft is minted the tokenID will increment in 1
        _tokenIds.increment();
        // Item id is the same of the tokenID at least at its value. 
        uint256 newItemId = _tokenIds.current();
        // here we mint, and pass as arguments, the addres of the person who wants to mint and the new ItemID. 
        _mint(msg.sender, newItemId);
        //once mited, I need to Append the newItem Id to the tokenURI 
        _setTokenURI(newItemId, tokenURI);
        // this is a function that aproves that the marketplace can sell the item inmediatelly.
        setApprovalForAll(contractAddress, true);
        //returns the newly minted nft.
        return newItemId;
    }


// this function only mints the NFT but does not allow the resell in our marketplace. But it charges a minting fee. this function takes as an argument the price of the minting that is defined at the beggining of the smart contract. 
    function mintNFT(string memory tokenURI) public payable returns (uint) {
        //this is a check that the user is giving the exact amout of minting price. 
        require(msg.value == cost, "Need to send 0.075 ether!");
        //this incremets the token ids.. because we are still creating nfts. 
        _tokenIds.increment();
        //this appends the tokenid to the ItemID this for the nft to have a path for the picture!! :) this is going to be provided by the frontEnd. 
        uint256 newItemId = _tokenIds.current();
        // this will mint the nft
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }

    function withdraw() public payable onlyOwner() {
        require(payable(msg.sender).send(address(this).balance));
    }
}
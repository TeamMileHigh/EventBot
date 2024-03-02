import createClient from './Client.js';
import { config } from './Config.js';
import { ClientType } from './Utils.js';
import { ethers } from 'ethers';
import { abi } from './ABI/ERC721ABI.js';
import { StoryClient } from '@story-protocol/core-sdk';

export async function createRootIpa() {
  /** TODO
   * 1. get ipfs hash
   * 2. get totalSupply of minted nfts
   * 3. mint nft with ipfs hash with totalSupply + 1 as tokenId
   * 4. register to Root IPA */
}

export async function safeMintNft(
  address: string,
  tokenId: number,
  uri: string
) {
  const provider = new ethers.AnkrProvider(process.env.RPC_PROVIDER_URL);
  const contractAddress = config.nftContract;
  const privateKey = process.env.OWNER_PRIVATE_KEY || '';
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  const tx = await contract.safeMint(address, tokenId, uri);
  await tx.wait();

  console.log('Minted successfully');
}

export async function registerOnStory(
  _tokenId: number,
  _uri: string,
  _filename: string
) {
  const client = createClient(ClientType.Story);
  const response = await client.ipAsset.registerRootIp({
    tokenContractAddress: config.nftContract, // NFT contract address (Sepolia ETH)
    tokenId: String(_tokenId),
    ipName: _filename,
    uri: _uri,
    txOptions: { waitForTransaction: true },
  });

  console.log(
    `Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`
  );
}

export async function getTotalSupply() {
  const provider = new ethers.AnkrProvider(process.env.RPC_PROVIDER_URL);
  const contractAddress = config.nftContract;
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const mintCount = await contract.mintCounter();

  return mintCount;
}

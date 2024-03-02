import createClient from './Client';
import { config } from './Config';
import { ClientType } from './Utils';
import { ethers } from 'ethers';
import { abi } from './ABI/ERC721ABI.js';
import { StoryClient } from '@story-protocol/core-sdk';

export async function uploadToIpfs() {}

export async function safeMintNft() {}

export async function registerOnStory() {
  const client = createClient(ClientType.Story);
  const response = await client.ipAsset.registerRootIp({
    tokenContractAddress: config.nftContract, // NFT contract address (Sepolia ETH)
    tokenId: '12',
    txOptions: { waitForTransaction: true },
  });

  console.log(
    `Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`
  );
}

async function getTotalSupply() {
  const provider = new ethers.AnkrProvider(process.env.RPC_PROVIDER_URL);
  const contractAddress = config.nftContract;
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const mintCount = await contract.mintCounter();

  return mintCount;
}

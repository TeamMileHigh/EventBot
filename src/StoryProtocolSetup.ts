import createClient from './Client.js';
import { config } from './Config.js';
import { ClientType } from './Utils.js';
import { ethers } from 'ethers';
// import { abi } from './ABI/ERC721ABI.js';
import { StoryClient } from '@story-protocol/core-sdk';
import { viemClient, account } from './Client.js';

export async function safeMintNft(
  address: string,
  tokenId: number,
  uri: string
) {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
  const contractAddress = config.nftContract;
  const privateKey = process.env.OWNER_PRIVATE_KEY || '';
  const wallet = new ethers.Wallet(privateKey, provider);
  const abi = [
    'function safeMint(address to, uint256 tokenId, string uri) external',
  ];
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
    ipName: _filename.slice(0, _filename.indexOf('.')),
    uri: _uri,
    txOptions: { waitForTransaction: true },
  });

  console.log(
    `Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`
  );

  return response.ipId;
}

export async function getTotalSupply() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER_URL);
  const contractAddress = config.nftContract;
  const contractABI = ['function mintCounter() view returns (uint256)'];

  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  const mintCounter = await contract.mintCounter();

  return mintCounter;
}

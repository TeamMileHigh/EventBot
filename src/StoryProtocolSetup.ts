import createClient from './Client';
import { ClientType } from './Utils';
import { StoryClient } from '@story-protocol/core-sdk';

export async function registerNft() {
  const client = createClient(ClientType.Story);
  const response = await client.ipAsset.registerRootIp({
    tokenContractAddress: '0xd516482bef63Ff19Ed40E4C6C2e626ccE04e19ED', // your NFT contract address
    tokenId: '12', // your NFT token ID
    txOptions: { waitForTransaction: true },
  });

  console.log(
    `Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`
  );
}

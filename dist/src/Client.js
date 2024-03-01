import "./Environment.js";
import { Client } from "@xmtp/xmtp-js";
import dotenv from "dotenv";
import { Wallet } from "ethers";
dotenv.config();
export default async function createClient() {
    const key = Wallet.createRandom().privateKey;
    const wallet = new Wallet(key);
    const client = await Client.create(wallet, {
        env: "dev",
    });
    await client.publishUserContact();
    return client;
}
//# sourceMappingURL=Client.js.map
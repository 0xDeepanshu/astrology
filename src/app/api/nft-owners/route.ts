import { NextResponse } from "next/server";
import Moralis from "moralis";

export const moralisApiKey = process.env.MORALIS_API_KEY;

let isMoralisStarted = false;

export async function GET() {
  try {
    if (!isMoralisStarted) {
      await Moralis.start({
        apiKey: moralisApiKey,
      });
      isMoralisStarted = true;
    }

    const response = await Moralis.EvmApi.nft.getNFTOwners({
      address: "0x44d1001f14b4A49f09a04A79E1c1793fC1892A1e", // your NFT contract
      chain: "0x61",
  
      limit: 100,
    });

    const owners = response.raw.result.map((item: any) => ({
      wallet: item.owner_of,
      balance: item.amount,
      tokenId: item.token_id,
    }));

    return NextResponse.json({ owners });
  } catch (error: any) {
    console.error("Moralis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

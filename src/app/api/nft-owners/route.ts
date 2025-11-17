import { NextResponse } from "next/server";
import Moralis from "moralis";

let isMoralisStarted = false;

export async function GET() {
  try {
    if (!isMoralisStarted) {
      await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY,
      });
      isMoralisStarted = true;
    }

    const response = await Moralis.EvmApi.nft.getNFTOwners({
      address: "0x32b7d39515c940b7FaA05C2e7503200709Abed40", // your NFT contract
      chain: "0x38",
  
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

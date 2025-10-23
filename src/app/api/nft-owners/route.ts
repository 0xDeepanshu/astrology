import { NextResponse } from "next/server";
import Moralis from "moralis";

let isMoralisStarted = false;

export async function GET() {
  try {
    if (!isMoralisStarted) {
      await Moralis.start({
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjNjZDU5ZTM3LWQ5YTctNDZhMS05ZDYzLTk1MjIyNTE1ZTNkOSIsIm9yZ0lkIjoiNDc3NDA3IiwidXNlcklkIjoiNDkxMTY5IiwidHlwZUlkIjoiNTRiMDY4Y2UtYTE4Yy00N2YwLWFkNDgtM2VlMTA5ZTlhYTlmIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NjEyMzA0NjUsImV4cCI6NDkxNjk5MDQ2NX0.opCTGO8hLc1u4cqTrc3xYwxZdoqkoSs_kqFlBFwE5h4',
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

"use client";

import { useEffect, useState } from "react";

interface Owner {
  wallet: string;
  balance: string;
  tokenId: string;
}

export default function NFTOwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOwners() {
      const res = await fetch("/api/nft-owners");
      const data = await res.json();
      if (data.owners) setOwners(data.owners);
      setLoading(false);
    }
    fetchOwners();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading NFT owners...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">NFT Owners</h1>
      <table className="min-w-full border border-gray-700 rounded-lg">
        <thead>
          <tr className="bg-gray-800 text-gray-200">
            <th className="py-2 px-4 border-b">Wallet Address</th>
            <th className="py-2 px-4 border-b">Balance</th>
            <th className="py-2 px-4 border-b">Token ID</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((owner) => (
            <tr key={owner.wallet} className="text-center border-b border-gray-700">
              <td className="py-2 px-4 font-mono text-sm">{owner.wallet}</td>
              <td className="py-2 px-4">{owner.balance}</td>
              <td className="py-2 px-4">{owner.tokenId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

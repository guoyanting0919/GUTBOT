import {
  useAccount,
  useConnect,
  useBalance,
  useContractEvent,
  useContractReads,
  useContractRead,
  useProvider,
  useContract,
  useBlockNumber,
} from "wagmi";
import { multicall } from "@wagmi/core";
import { InjectedConnector } from "wagmi/connectors/injected";
import { bsc, bscTestnet } from "wagmi/chains";
import ABI from "./GameCard.json";
import ABI_LIMIT from "./LimitedCard.json";
import ABI_SELL from "./Marketplace.json";
import { useState, useEffect } from "react";

export const MarketBot = () => {
  const { address, isConnected } = useAccount();
  const provider = useProvider();

  const gameCardContract = useContract({
    address: "0x821561bc999ee68671ec4baf32613c974897a0df", // TODO:mainnet
    // address: "0x93f7ee734be7a726a9322644c166f7033a8becf5", // TODO:testnet
    abi: ABI,
    signerOrProvider: provider,
  });

  const { connect } = useConnect({
    connector: new InjectedConnector(),
    chainId: bsc.id, // TODO:mainnet
    // chainId: bscTestnet.id, // TODO:testnet
    onSuccess(data) {
      console.log('data: ', data);
    },
  });

  useContractEvent({
    address: "0x0f973c4e806a5930f7a851d9f5471f9d9c1d8ba4", // TODO:mainnet
    // address: "0xde8dec1afdd1568817213a1821d7d89ea1c41621", // TODO:testnet
    abi: ABI_SELL,
    eventName: "OrderCreated",
    listener: async (orderId,nftAddress,tokeId,seller,currency,price) => {
      const _price = price.toString() / 1e18
      const cardInfo = await getCardInfo(tokeId.toString())
      const msg = `${cardInfo[0]}星遊戲卡已上架，售價為${_price}`
      lineNotify(msg)
    },
  });

  const getCardInfo = async (tokeId) => {
    const res = await gameCardContract.cards(tokeId);
    return res
  }

  const lineNotify = (message = '您要發送的訊息') => {
    const token = "cSLsCDpoMDeIn8ywmrgzPbaIDTH0ug6nHy11ZE52SSU";
    fetch(`/api/notify`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
    },
    body: new URLSearchParams({
        message: message,
    }),
    }).then(response => console.log(response)); 

  }

  
  return (
    <>
      {isConnected && <div>Connected to {address}</div>};
      <button onClick={() => connect()}>Connect Wallet</button>;<br></br>
    </>
  );
};

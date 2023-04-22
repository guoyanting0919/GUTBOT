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
import { bsc } from "wagmi/chains";
import ABI from "./GameCard.json";
import ABI_LIMIT from "./LimitedCard.json";
import ABI_SELL from "./Marketplace.json";
import { useState, useEffect } from "react";

export const Profile = () => {
  const [cardsData, setCardsData] = useState([]);
  const [num, setNum] = useState(1);
  const [sellsData, setSellsData] = useState([]);
  const [cardsDataLimit, setCardsDataLimit] = useState([]);
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const { data: bn } = useBlockNumber({
    enabled: true,
  });

  const contractSell = useContract({
    address: "0x0f973c4e806a5930f7a851d9f5471f9d9c1d8ba4",
    abi: ABI_SELL,
    signerOrProvider: provider,
  });

  const contractGame = useContract({
    address: "0x821561bc999ee68671ec4baf32613c974897a0df",
    abi: ABI,
    signerOrProvider: provider,
  });

  const filterEvent = async () => {
    // const data = await multicall({
    //     contracts: [
    //       {
    //         address: '0x0f973c4e806a5930f7a851d9f5471f9d9c1d8ba4',
    //         abi: ABI_SELL,
    //         functionName: 'queryFilter',
    //       },
    //       {
    //         address: '0x0f973c4e806a5930f7a851d9f5471f9d9c1d8ba4',
    //         abi: ABI_SELL,
    //         functionName: 'queryFilter',
    //       },
    //     ],
    //   })

    const f = contractSell.filters.OrderSuccessful();
    let currentBlock = bn;
    let arr = [];
    if (!currentBlock) return;
    for (let index = 0; index < num; index++) {
      let e = await contractSell.queryFilter(
        f,
        currentBlock - 1200,
        currentBlock
      );
      currentBlock = currentBlock - 1200;
      arr = [...arr, ...e];
    }
    setSellsData(arr);

    // const f = contractSell.filters.OrderSuccessful();
    // let currentBlock = bn;
    // let arr = [];
    // let contracts = [];
    // if (!currentBlock) return;
    // for (let index = 0; index < num; index++) {
    //   contracts.push({
    //     address: "0x0f973c4e806a5930f7a851d9f5471f9d9c1d8ba4",
    //     abi: ABI_SELL,
    //     functionName: "queryFilter",
    //     args: [f, currentBlock - 1200, currentBlock],
    //   });
    //   currentBlock = currentBlock - 1200;
    // }
    // const data = await multicall({
    //   contracts,
    // });
    // console.log(
    //   "%cdata=>",
    //   "color:white;background-color: #26bfa5;font-weight:700;font-size:16px",
    //   data
    // );

    // setSellsData(arr);
  };

  //   const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new InjectedConnector(),
    chainId: bsc.id,
    onSuccess(data) {
      console.log(
        "%cdata=>",
        "color:white;background-color: #26bfa5;font-weight:700;font-size:16px",
        data
      );
    },
  });

  const { data: totalSupply } = useContractRead({
    address: "0x821561bc999ee68671ec4baf32613c974897a0df",
    abi: ABI,
    functionName: "totalSupply",
  });

  const { data: totalSupplyLimit } = useContractRead({
    address: "0x5431Bd744bed2de603039549771C598888e5b78B",
    abi: ABI_LIMIT,
    functionName: "totalSupply",
  });

  useContractEvent({
    address: "0x821561bc999ee68671ec4baf32613c974897a0df",
    abi: ABI,
    eventName: "Mint",
    listener: (
      _tokenId,
      _to,
      _star,
      _alignment,
      _name,
      _attack,
      _defense,
      _constitution,
      _agile
    ) => {
      //   setArr([...arr, _star]);
      setCardsData([...cardsData, [_star]]);
      //   console.log('%c_tokenId=>',"color:white;background-color: #26bfa5;font-weight:700;font-size:16px", _tokenId);
      //   console.log(
      //     "%c_to=>",
      //     "color:white;background-color: #26bfa5;font-weight:700;font-size:16px",
      //     _to
      //   );
      console.log(
        "%c_有人抽卡了=>",
        "color:white;background-color: #26bfa5;font-weight:700;font-size:16px",
        _tokenId
      );
    },
    chainId: bsc.id,
  });

  const { data, isError, isLoading } = useBalance({
    address: "0xE03B28582ecd2820D4D4a269DCfc8338f0009672",
    token: "0x36E714D63B676236B72a0a4405F726337b06b6e5",

    // testnet
    // address: "0xE03B28582ecd2820D4D4a269DCfc8338f0009672",
    // token: "0xe86e87b8bcc4aebd10cc07174b257277fef6f1a3",
    chainId: bsc.id,
  });

  const handleGetInfo = async (id) => {
    const a = await contractGame.cards(id);
    console.log(
      "%ca=>",
      "color:white;background-color: #26bfa5;font-weight:700;font-size:16px",
      a
    );
    alert(JSON.stringify(a));
  };

  useEffect(() => {
    const fn = async () => {
      const count = totalSupply?.toNumber();
      const contracts = [];
      for (let index = 0; index < count + 1; index++) {
        const c = {
          address: "0x821561bc999ee68671ec4baf32613c974897a0df",
          abi: ABI,
          functionName: "cards",
          args: [index],
          chainId: bsc.id,
        };
        contracts.push(c);
      }
      const data = await multicall({
        contracts,
      });
      console.log(
        "%cdata=>",
        "color:white;background-color: #26bfa5;font-weight:700;font-size:16px",
        data
      );
      setCardsData(data);
    };
    fn();
  }, [totalSupply]);

  useEffect(() => {
    const fn = async () => {
      const count = totalSupplyLimit?.toNumber();
      const contracts = [];
      for (let index = 0; index < count + 1; index++) {
        const c = {
          address: "0x5431Bd744bed2de603039549771C598888e5b78B",
          abi: ABI_LIMIT,
          functionName: "cards",
          args: [index],
          chainId: bsc.id,
        };
        contracts.push(c);
      }
      const data = await multicall({
        contracts,
      });
      console.log(
        "%cdata=>",
        "color:white;background-color: #26bfa5;font-weight:700;font-size:16px",
        data
      );
      setCardsDataLimit(data);
    };
    fn();
  }, [totalSupplyLimit]);
  return (
    <>
      {isConnected && <div>Connected to {address}</div>};
      <button onClick={() => connect()}>Connect Wallet</button>;<br></br>
      <div> totalSupply : {totalSupply?.toNumber()}</div>
      <div> totalSupplyLimit : {totalSupplyLimit?.toNumber()}</div>
      <input value={num} type="text" onChange={(e) => setNum(e.target.value)} />
      <button onClick={() => filterEvent()}>Search(1=1hr)</button>
      <br></br>
      {sellsData &&
        sellsData.map(({ args: i }) => {
          return (
            <div
              key={i.id}
              style={{ margin: "16px", background: "#fff4d1", padding: "16px" }}
            >
              <div>buyer:{i.buyer}</div>
              <div>
                currency:
                {i.currency === "0x36E714D63B676236B72a0a4405F726337b06b6e5"
                  ? "GUT"
                  : "USDT"}
              </div>
              <div onClick={() => handleGetInfo(i.tokenId?.toString())}>
                tokenId:{i.tokenId?.toString()}
              </div>
              <div>price:{i.price?.toString() / 1e18}</div>
            </div>
          );
        })}
      <br></br>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {cardsData &&
          cardsData.map((card, idx) => {
            return (
              <div
                style={{
                  background: card[0] === 5 ? "#ff8b87" : "#e8e8e8",
                  margin: "8px",
                  padding: "6px",
                }}
                key={idx}
              >
                <div onClick={() => handleGetInfo(idx)}># {idx}</div>
                <div>star: {card[0]}</div>
              </div>
            );
          })}
      </div>
      <br></br>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {cardsDataLimit &&
          cardsDataLimit.map((card, idx) => {
            return (
              <div
                style={{
                  background:
                    card[0] === 5
                      ? "#879dff"
                      : card[0] === 4
                      ? "#e9ffb5"
                      : "#e8e8e8",
                  margin: "8px",
                  padding: "6px",
                }}
                key={idx}
              >
                <div># {idx}</div>
                <div>star: {card[0]}</div>
              </div>
            );
          })}
      </div>
      <br></br>
    </>
  );
};

import "./App.css";
import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import { avalanche, bsc, bscTestnet } from "wagmi/chains";

import { Profile } from "./profile";
import { MarketBot } from "./marketBot";

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, avalanche, bsc, bscTestnet],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});
function App() {
  return (
    <WagmiConfig client={client}>
      <Profile></Profile>
      {/* <MarketBot></MarketBot> */}
    </WagmiConfig>
  );
}

export default App;

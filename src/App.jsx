import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { stakingABI, stakingContractAddress, tokenAddress } from "./abi";

function App() {
  const [wallet, setWallet] = useState(null);
  const [signer, setSigner] = useState(null);
  const [stakingContract, setStakingContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [balance, setBalance] = useState("0");
  const [staked, setStaked] = useState("0");
  const [amount, setAmount] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    const token = new ethers.Contract(
      tokenAddress,
      ["function balanceOf(address) view returns (uint256)"],
      signer
    );

    const staking = new ethers.Contract(
      stakingContractAddress,
      stakingABI,
      signer
    );

    setWallet(address);
    setSigner(signer);
    setTokenContract(token);
    setStakingContract(staking);

    await loadBalances(address, token, staking);
  };

  const loadBalances = async (address, token, staking) => {
    const tokenBal = await token.balanceOf(address);
    const stakedBal = await staking.getStakedBalance(address);
    setBalance(ethers.formatUnits(tokenBal, 18));
    setStaked(ethers.formatUnits(stakedBal, 18));
  };

  const handleStake = async () => {
    try {
      if (!wallet || !stakingContract || !amount)
        return alert("Connect wallet and enter amount");

      const amt = ethers.parseUnits(amount, 18);
      const tx = await stakingContract.stake(amt);
      await tx.wait();
      console.log("Staked");

      await loadBalances(wallet, tokenContract, stakingContract);
      alert("Staked successfully!");
    } catch (err) {
      console.error(" Stake failed:", err);
      alert(" Stake failed: " + err.reason || err.message);
    }
  };

  const handleUnstake = async () => {
    try {
      if (!wallet || !stakingContract || !amount)
        return alert("Connect wallet and enter amount");

      const amt = ethers.parseUnits(amount, 18);
      const tx = await stakingContract.unstake(amt);
      await tx.wait();
      console.log(" Unstaked");

      await loadBalances(wallet, tokenContract, stakingContract);
      alert(" Unstaked successfully!");
    } catch (err) {
      console.error(" Unstake failed:", err);
      alert(" Unstake failed: " + err.reason || err.message);
    }
  };

  return (
    <div style={styles.app}>
      <h1 style={styles.header}>Asva Staking dApp</h1>

      {!wallet ? (
        <button onClick={connectWallet} style={styles.button}>Connect Wallet</button>
      ) : (
        <>
          <p style={styles.text}> {wallet.slice(0, 6)}...{wallet.slice(-4)}</p>
          <p style={styles.text}> Balance: {balance}</p>
          <p style={styles.text}> Staked: {staked}</p>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
          />
          <br />
          <button onClick={handleStake} style={styles.button}>Stake</button>
          <button onClick={handleUnstake} style={styles.button}>Unstake</button>
        </>
      )}
    </div>
  );
}

const styles = {
  app: {
    backgroundColor: "#1e1e1e",
    color: "#ffc0cb",
    minHeight: "100vh",
    padding: "2rem",
    fontFamily: "monospace",
  },
  header: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  text: {
    margin: "0.5rem 0",
  },
  input: {
    padding: "0.5rem",
    margin: "1rem 0",
    width: "200px",
    border: "1px solid #ffc0cb",
    backgroundColor: "#2a2a2a",
    color: "#ffc0cb"
  },
  button: {
    marginRight: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#ffc0cb",
    color: "#1e1e1e",
    border: "none",
    cursor: "pointer"
  }
};

export default App;

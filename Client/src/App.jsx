import { useState, useEffect } from "react";
import Web3 from "web3";
import SimpleCounter from "../../Smart_Contracts/build/contracts/SimpleCounter.json";

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          const networkId = await web3Instance.eth.net.getId();
          const deployedNetwork = SimpleCounter.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            SimpleCounter.abi,
            deployedNetwork && deployedNetwork.address
          );
          setContract(contractInstance);
        } catch (error) {
          console.error("Could not connect to contract or network:", error);
        }
      } else {
        console.error("Web3 not found. Please install Metamask.");
      }
    };

    initWeb3();
  }, []);

  const handleIncrement = async () => {
    if (contract) {
      try {
        await contract.methods
          .increment()
          .send({ from: (await web3.eth.getAccounts())[0] });
        updateCount();
      } catch (error) {
        console.error("Error incrementing:", error);
      }
    }
  };

  const handleDecrement = async () => {
    if (contract) {
      try {
        await contract.methods
          .decrement()
          .send({ from: (await web3.eth.getAccounts())[0] });
        updateCount();
      } catch (error) {
        console.error("Error decrementing:", error);
      }
    }
  };

  const updateCount = async () => {
    if (contract) {
      const newCount = await contract.methods.count().call();
      setCount(parseInt(newCount));
    }
  };

  return (
    <div className="App">
      <div className="Data">
        <div className="Count">Count:{count}</div>
        <div className="Buttons">
          <button onClick={handleIncrement}>Increment</button>
          <button onClick={handleDecrement}>Decrement</button>
        </div>
      </div>
    </div>
  );
}

export default App;

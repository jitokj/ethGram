import React, { useEffect, useLayoutEffect, useState } from "react";
import Web3 from "web3";
import Identicon from "identicon.js";
import "./App.css";
import Ethgram from "../abis/Ethgram.json";
import Navbar from "./Navbar";
import Main from "./Main";

const App = () => {
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(false);

 useEffect(()=>{
    const  loadWeb3 = async ()=>{
      const ethereum = window.ethereum;
      if(ethereum){
        ethereum.on('accountsChanged',function (accounts){
          console.log(accounts[0]);
          setAccount(accounts[0]);
        })
      }
      else {
        window.alert('Non-ethereum browser detected. You should try considering metamask');
      }
    }

  loadWeb3();
  },[account]);

  useLayoutEffect(()=>{
    const loadBlockchainData = async()=>{
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      const networkId = await web3.eth.net.getId();
      const networkData = Ethgram.networks[networkId];
      if(networkData){
        const ethgram = new web3.eth.Contract(Ethgram.abi,networkData.address);
      }
      else {
          window.alert('Ethgram contract not deployed to detected network');
      }
      
    }

    loadBlockchainData();
  },[])

  return (
    <div>
      <Navbar account={account} />
      {loading ? (
        <div id="loader" className="text-center mt-5">
          <p>Loading...</p>
        </div>
      ) : (
        <Main
        // Code...
        />
      )}
    </div>
  );
};

export default App;

import React, { useEffect, useLayoutEffect, useState } from "react";
import Web3 from "web3";
import Identicon from "identicon.js";
import "./App.css";
import Ethgram from "../abis/Ethgram.json";
import Navbar from "./Navbar";
import Main from "./Main";

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

const App = () => {
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [ethContract,setEthContract] = useState(null);
  const [img,setImg] = useState([]);
  const [imgCount,setImgCount] = useState(0);
  const [buff,setBuff] = useState(null);

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
      const ethereum = window.ethereum;
      if(ethereum){
      const web3 = new Web3(window.ethereum);
    
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      const networkId = await web3.eth.net.getId();
      const networkData = Ethgram.networks[networkId];
      if(networkData){
        const ethgram = new web3.eth.Contract(Ethgram.abi,networkData.address);
        setEthContract(ethgram);
        const imagesCount = await ethgram.methods.imageCount().call();
        setImgCount(imagesCount);
        for(let i=1;i<=imagesCount;i++){
          const image = await ethgram.methods.images(i).call();
         
          setImg(prevState=>{
            return [...prevState,image]
          })
        }
        setLoading(false);
      }
      else {
          window.alert('Ethgram contract not deployed to detected network');
      }
    }
      
    }

    loadBlockchainData();
  },[])


  const captureFile = (event)=>{
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = ()=>{
      setBuff( Buffer(reader.result));
    }
  }

  const uploadImage = (description)=>{
    console.log("submitting file to the ipfs");
    ipfs.add(buff,(error,result)=>{
      console.log("ipfs result",result);
      if(error){
        console.error(error);
        return;
      }
      setLoading(true);
      ethContract.methods.uploadImage(result[0].hash,description).send({from:account}).on('transactionHash',(hash)=>{
        setLoading(false);
      })
    })
  }

  return (
    <div>
      <Navbar account={account} />
      {loading ? (
        <div id="loader" className="text-center mt-5">
          <p>Loading...</p>
        </div>
      ) : (
        <Main captureFile={captureFile} uploadImage={uploadImage} images={img}
        // Code...
        />
      )}
    </div>
  );
};

export default App;

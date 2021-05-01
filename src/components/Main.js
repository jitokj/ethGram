import React, { useEffect, useRef, useState } from "react";
import Identicon from "identicon.js";
import Web3 from "web3";

const Main = (props) => {
  const [web3,setWeb3] = useState(null);
 
  useEffect(()=>{
    const ethereum = window.ethereum;
      if(ethereum){
        console.log("props.image--> ",props.images[0].tipAmount);
       setWeb3(new Web3(window.ethereum));
       
      }
      else {
        alert("install metamask to continue");
      }
  },[]);

  

  const inputEl = useRef(null);
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 ml-auto mr-auto"
          style={{ maxWidth: "500px" }}
        >
          <div className="content mr-auto ml-auto">
            <p>&nbsp;</p>
          
            <h2>Share Image</h2>
              <form onSubmit={(event) => {
                event.preventDefault()
                const description = inputEl.current.value;
                props.uploadImage(description)
              }} >
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={props.captureFile} />
                  <div className="form-group mr-sm-2">
                    <br></br>
                      <input
                        id="imageDescription"
                        type="text"
                        ref={inputEl}
                       
                        className="form-control"
                        placeholder="Image description..."
                        required />
                  </div>
                <button type="submit" className="btn btn-primary btn-block btn-lg">Upload!</button>
              </form>


            <p>&nbsp;</p>

            {props.images.map((image, key) => {
                return(
                  <div className="card mb-4" key={key} >
                    <div className="card-header">
                      <img
                      alt="identicon"
                        className='mr-2'
                        width='30'
                        height='30'
                        src={`data:image/png;base64,${new Identicon(image.author, 30).toString()}`}
                      />
                      <small className="text-muted">{image.author}</small>
                    </div>
                    <ul id="imageList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p className="text-center"><img alt="hashedImage" src={`https://ipfs.infura.io/ipfs/${image.hashes}`} style={{ maxWidth: '420px'}}/></p>
                        <p>{image.description}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">
                        TIPS: {image.tipAmount.toString()/Math.pow(10,18)} ETH
                       
                        </small>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={image.id}
                          onClick={(event) => {
                            let tipAmount = web3.utils.toWei('0.1', 'Ether')
                            console.log(event.target.name, tipAmount)
                            props.tipImageOwner(event.target.name, tipAmount)
                          }}
                        >
                          TIP 0.1 ETH
                        </button>
                      </li>
                    </ul>
                  </div>
                )
              })}

            {/* Code ... */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Main;

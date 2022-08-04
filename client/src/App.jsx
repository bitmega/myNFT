import { EthProvider } from "./contexts/EthContext";
import "./App.css";
import Web3 from "web3";
import { useEffect } from "react";
import Color from './contracts/Color.json';
import { useState } from "react";


function App() {
  const [colors, setColors] = useState([])
  const [account, setAccount] = useState()
  const [contract, setContract] = useState()
  const [color, setColor] = useState("#000000")

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      alert("Non-ethereum browser detected")
    }
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.requestAccounts();
    setAccount(accounts[0])
    const networkId = await web3.eth.net.getId();
    const networkData = await Color.networks[networkId]

    if (networkData) {
      const abi = Color.abi;
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      setContract(contract)

      const totalSupply = await contract.methods.totalSupply().call()
      const _colors = []
      for (var i=0; i < totalSupply; i++) {
        const color = await contract.methods.colors(i).call()
        _colors.push(color)
      }

      setColors(_colors)
    } else {
      alert("Smart contract not deployed to detected Network")
    }
  }

  useEffect(() => {
    loadWeb3()
    loadBlockchainData()
  }, [])

  const mint = (color) => {
    contract.methods.mint(color).send({
      from: account
    }).once('receipt', (receipt) => {
      setColors([
        ...colors,
        color
      ])
    }).on('error', (error) => {
      console.log(error)
    })
  }

  const onSubmit = (event) => {
    event.preventDefault()

    mint(color)
  }

  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
          <h2>Color Token</h2>
          Account: {account}

          <form onSubmit={onSubmit}>
            <input type="color" name="color" value={color} onChange={(e) => setColor(e.target.value)} />
            <br />
            <button>Mint</button>
          </form>
          <hr />
          <h3>Colors</h3>
          <ul>
            {colors.map(color => (
              <li key={color}>
                <div style={{backgroundColor: color, width: '50px', height: '20px'}}></div>
                <div>{color}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </EthProvider>
  );
}

export default App;

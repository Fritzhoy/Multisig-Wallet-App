import React, { useEffect, useState } from 'react';
import { getWeb3, getWallet } from './utils.js';
import Header from './Header.js';
import './App.css';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, SetAccounts] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);
  const [approvers, setApprovers] = useState([]);
  const [quorum, setQuorum] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const web3 = getWeb3();
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      const wallet = await getWallet(web3);
      const approvers = await wallet.methods.getApprovers().call(); 
      const quorum  = await wallet.methods.quorum().call();
      setWeb3(web3);
      SetAccounts(accounts);
      setWallet(wallet);
      setApprovers(approvers);
      setQuorum(quorum);
    };
    init();
  }, []);

  if(
    typeof web3 === 'undefined' 
    || typeof accounts === 'undefined'
    || typeof wallet === 'undefined'
    || approvers.length === '0'
    || typeof quorum === 'undefined'
  ){
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
          Multisig Dapp
          <Header approvers={approvers} quorum={quorum}></Header>
    </div>
  );
}

export default App;


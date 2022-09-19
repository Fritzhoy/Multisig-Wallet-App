import Web3 from 'web3';
import Wallet from './contracts/Wallet.json';


//Web3 object that give us connection to the ethereum blockchain (node that we use to deploy our contract)
const getWeb3 = () => {
  return new Web3('HTTP://localhost:9545');
}

// contract instance it's a object that is product from web3 that allow to interact with smart contracts
const getWallet = async web3 => {
  //networkId from the contract abstraction
  const networkId = await web3.eth.net.getId();
  //store data of our smart contract deployment
  const deployContract = Wallet.networks[networkId];
  //return a contract instance
  return new web3.eth.Contract(
    Wallet.abi,
    deployContract && deployContract.address
  );
};

export { getWeb3, getWallet };
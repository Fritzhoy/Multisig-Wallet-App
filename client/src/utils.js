import Web3 from 'web3';
import Wallet from './contracts/Wallet.json';
import detectEthereumProvider from '@metamask/detect-provider';


//Web3 object that give us connection to the ethereum blockchain (node that we use to deploy our contract)

const getWeb3 = () =>

new Promise( async (resolve, reject) => {

let provider = await detectEthereumProvider();

if(provider) {

await provider.request({ method: 'eth_requestAccounts' });

try {

const web3 = new Web3(window.ethereum);

resolve(web3);

} catch(error) {

reject(error);

}

} reject('Install Metamask');

});


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
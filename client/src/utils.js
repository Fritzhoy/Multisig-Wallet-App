import Web3 from 'web3';
import Wallet from './contracts/Wallet.json';


//Web3 object that give us connection to the ethereum blockchain (node that we use to deploy our contract)

const getWeb3 = () => {
  //const web3 = new Web3('http://localhost:8545');
  //return promise to test if metamask is injected in our code 
  return new Promise((resolve, reject) => {

    window.addEventListener('load', async () => {
    if(window.ethereum){
      //when you instance the Web3 inside we 'call a provider object', window.
      const web3 = new Web3(window.ethereum);
      //inside a try object, in case the user reject to grant access to his metamask
      try {
        await window.ethereum.enable();
        resolve(web3);
      } catch(error) {
        reject(error)
      }
    // if user uses a old version of metamask    
    } else if(window.web3){
      resolve(window.web3);
    } else {
      reject('Must install Metamask');
    }

    });
  });
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
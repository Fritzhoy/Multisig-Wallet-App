// SPDX-License-Identifier: Apache-2.0

pragma solidity 0.8.5;
//use for allow to return a struct from a function
pragma experimental ABIEncoderV2;  

//declare the name of the smart contract
//declare variable array of approvers the ETH address that will approve the transaction
//declare variable quorum - define the amount of necessary approver for complete a transaction   
//use constructor to declare the initial arguments 
 
 contract Wallet {
     address [] public approvers; 
     uint public quorum;
     struct Transfer {
         uint id;
         uint amount;
         address payable to;
         uint approvals;
         bool sent; 
        }
//Create a Array of Transfer 

    Transfer[] public transfers;
//Define a mapping to record who has approve what; 
//neasting mapping with the Id tranfer => bool value)
    mapping(address => mapping(uint => bool)) public approvals; 

    constructor(address [] memory _approvers, uint _quorum) {
        approvers = _approvers;
        quorum = _quorum;   
    }

//Function to get the list of the approvers declare as external than it's possible to access approvel outside of the contract
//it's a view function only
//array of the approvels will be in memory
//returns the address of the approvers
    function getApprovers() external view returns (address[] memory){
        return approvers;
    }
//Function to get the list of the transfers
//As this function return a struct we need to use "ABIEncoderV2"
     function getTransfers() external view returns (Transfer[] memory) {
        return transfers;
    }

//Function to create the transfer 
//Creat the struct Transfer to declare the variable
//The address need to be 'payable' in order to receive ethers
//variable bool to indicate if the transaction already happened
//for the first transaction bool should receive false 

    function createTransfer(uint amount, address payable to) external onlyApprover {
        transfers.push(Transfer(
            transfers.length,
            amount,
            to,
            0,
            false
        ));

    }
//Before iniciate the transcation check if the bool value is equal to false
//Check if the sender of the transaction has already approve the transaction, avoid to approve transaction twice
    function approveTransfer(uint id) external onlyApprover {
        require(transfers[id].sent == false, 'transfer has already been sent');
        require(approvals[msg.sender][id] == false, 'cannot approve transfer twice');

//Set the approval of this address to true;
//increment the transfer approval 

        approvals[msg.sender][id] = true;
        transfers[id].approvals++;

//logical test to check the number of approvels is enough to send the transfer to
//when the logical test is matched than declare the address payable equal to the transfer Id
//declare the amount 
//declare 'transfer'method given by solidity, it's attached to any address that is payable 
        if(transfers[id].approvals >= quorum) {
            transfers[id].sent = true;
            address payable to = transfers[id].to;
            uint amount = transfers[id].amount;
            to.transfer(amount);
        }
    }

//Receive Ether in our wallet
//this function is trigger when ether is send tto the address of the smart contract

    receive() external payable {}

//Access control 
//restrict access to only the array address
// Use modifier and attached a logical test for it, modifier can be add in any function 
//Inicial define the bool as false
//the logical function will cover all the length of the address array
//compere the approvers with the msg.sender (the address that is requesting the transfer)
//when the if return as false require the msg 'only approver allowed' and it will be not possible to call the function 

    modifier onlyApprover() {
        bool allowed = false;
        for(uint i = 0; i < approvers.length; i++){
         if( approvers[i] == msg.sender){
             allowed = true;
            }   
        }
        require (allowed == true, 'only approver allowed'); 
        _;
    }

 }

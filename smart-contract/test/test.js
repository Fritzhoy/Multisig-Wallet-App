const { expectRevert } = require("@openzeppelin/test-helpers");
const Wallet = artifacts.require("Wallet");

//define a contract block, all test will be inside
contract("Wallet", (accounts) => {
  //variable that will be point to our smartcontract
  let wallet;
  //before each test it will perform this
  beforeEach(async () => {
    //deploy a new smartcontract in test blockchain truffle
    wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2);
    await web3.eth.sendTransaction({
      from: accounts[0],
      to: wallet.address,
      value: 1000,
    });
  });

  //test 1: after the deploy check the value of the 2 variable created in the constructor

  it("should have correct approvers and quorum", async () => {
    const approvers = await wallet.getApprovers();
    const quorum = await wallet.quorum();
    assert(approvers.length === 3);
    assert(approvers[0] === accounts[0]);
    assert(approvers[1] === accounts[1]);
    assert(approvers[2] === accounts[2]);
    //convert big number (BN.js Lib) in to a number understand by JavaScript, toNumber is used in case of small number
    assert(quorum.toNumber() === 2);
  });

  /*Happy PATH */
  it("should create a transfer", async () => {
    //we dont receive const from this function, return from a ////transation is different, it is a transaction recepit
    await wallet.createTransfer(100, accounts[5], { from: accounts[0] });
    const transfer = await wallet.getTransfers();
    assert(transfer.length === 1);
    assert(transfer[0].id === "0");
    assert(transfer[0].amount === "100");
    assert(transfer[0].to === accounts[5]);
    assert(transfer[0].approvals === "0");
    assert(transfer[0].sent === false);
  });

  /*Unhappy Path */
  it("should NOT create a transfer if sender is not approved", async () => {
    await expectRevert(
      wallet.createTransfer(100, accounts[5], { from: accounts[4] }),
      "only approver allowed"
    );
  });
  /*Happy Path*/
  //test 2: we are not reach the quorum
  it("should increment approver", async () => {
    await wallet.createTransfer(100, accounts[5], { from: accounts[0] });
    await wallet.approveTransfer(0, { from: accounts[0] });
    const transfers = await wallet.getTransfers();
    const balance = await web3.eth.getBalance(wallet.address);
    assert(transfers[0].approvals === "1");
    assert(transfers[0].sent === false);
    assert(balance === "1000");
  });

  it("should send transfer if quorum reached", async () => {
    const balanceBefore = web3.utils.toBN(
      await web3.eth.getBalance(accounts[6])
    );
    await wallet.createTransfer(100, accounts[6], { from: accounts[0] });
    await wallet.approveTransfer(0, { from: accounts[0] });
    await wallet.approveTransfer(0, { from: accounts[1] });
    const balanceAfter = web3.utils.toBN(
      await web3.eth.getBalance(accounts[6])
    );
    assert(balanceAfter.sub(balanceBefore).toNumber() === 100);
  });

  /*UnHappy Path */

  it("should not approve transfer if sender is not approved", async () => {
    await wallet.createTransfer(100, accounts[5], { from: accounts[0] });
    await expectRevert(
      wallet.approveTransfer(0, { from: accounts[4] }),
      "only approver allowed"
    );
  });

  it("should NOT approve transfer if transfer is already sent", async () => {
    await wallet.createTransfer(100, accounts[6], { from: accounts[0] });
    await wallet.approveTransfer(0, { from: accounts[0] });
    await wallet.approveTransfer(0, { from: accounts[1] });
    await expectRevert(
      wallet.approveTransfer(0, { from: accounts[2] }),
      "transfer has already been sent"
    );
  });

  it("should NOT approve transfers twice", async () => {
    await wallet.createTransfer(100, accounts[6], { from: accounts[0] });
    await wallet.approveTransfer(0, { from: accounts[0] });
    await expectRevert(
      wallet.approveTransfer(0, { from: accounts[0] }),
      "cannot approve transfer twice"
    );
  });
});

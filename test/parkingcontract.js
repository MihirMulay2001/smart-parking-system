
const ParkingContract = artifacts.require("./ParkingContract.sol")

contract("ParkingContract", accounts => {
    const ETHER = 10**18
  const constructPaymentMessage = (receipAdd, amount, nonce, contractAddr) => {
      const hash =web3.utils.soliditySha3({type:'address',value: receipAdd },{type:'uint256',value: amount},
      {type:'uint256',value: nonce},{type:'address',value: contractAddr})
      return hash
    }

    async function signMessage(message, callback) {
        const sig = await web3.eth.sign(message,accounts[0], callback);
        console.log("message after",message);
        return sig
      }

    async function signPayment(contractAddress, amount, callback) {
        var message = constructPaymentMessage(accounts[1],amount,'387348723983234723',contractAddress);
        const sig = await signMessage(message, callback);
        return sig;
    }
  // it("should park car", async() => {


  //   web3.eth.handleRevert = true;

  //   const parkingInstance = await ParkingContract.deployed();
  //   const _time = Math.floor(new Date().getTime() / 1000).toString();
  //   const contractAddress = await parkingInstance.getAddress();
  //   await parkingInstance.enterParking({from: accounts[0] , value: JSON.stringify(0.3*ETHER)});
  //   let newtime = await parkingInstance.parkerDetails(accounts[0]);
  //   newtime = newtime.toString();
  //   assert.equal(_time,newtime,"math is wrong")
  //   //'0x047D2713E92EBCD3108070C6307B33eB0a4F4b7E'
  //   // const addAmountSign = setInterval(() => {
  //   //   signature = signPayment(contractAddress, JSON.stringify(amount*ETHER), () => {console.log(amount,"signed")})
  //   //   amount += 0.01;
  //   // },5000)

  //   // setTimeout(async()=>{
  //   //   clearInterval(addAmountSign)
  //   //   await parkingInstance.claimFunds(amount,signature);
  //   //   assert(parkingInstance.getMoney(contractAddress),0, "contract address not 0 at end");
  //   // },10000)


  //   // signPayment(contractAddress,2,function () { console.log("Signed"); })

  // })

  // it("should match signatures", async() => {
  //   const parkingInstance = await ParkingContract.deployed();
  //   const contractAddress = await parkingInstance.getAddress();
  //   await parkingInstance.enterParking({from: accounts[0], value: JSON.stringify(0.3*ETHER)});
    
  //   var amount = 0.01;
  //   let signature = await signPayment(contractAddress, JSON.stringify(amount*ETHER), () => {console.log(amount,"signed")})
  //   const acc = await parkingInstance.isMatchingSignature(JSON.stringify(amount*ETHER),signature,'387348723983234723', accounts[0], {from:accounts[1]});
  //   assert.equal(acc,true, "signatures don't match")
  // })

  it("payment should be successful", async(done) => {
    const parkingInstance = await ParkingContract.deployed();
    const contractAddress = await parkingInstance.getAddress();
    await parkingInstance.enterParking({from: accounts[0], value: JSON.stringify(0.5*ETHER)});
    
    var amount = 0.1;
    console.log(typeof(amount));
    console.log(accounts[0]);
    console.log(accounts[1]);
    let signature;
    const addAmountSign = setInterval(async () => {
      signature = await signPayment(contractAddress, JSON.stringify(amount*ETHER), () => {console.log(amount,"signed")})
      amount = Number(Number(amount + 0.1).toFixed(2));
      console.log(typeof(amount));
    },5000)
    setTimeout(async()=>{
      clearInterval(addAmountSign)
        const totamt = JSON.stringify(0.3*ETHER);
      const pp = await parkingInstance.claimFunds(totamt,signature, '387348723983234723', accounts[0],{from: accounts[1]});
      assert.equal(pp,contractAddress, "contract address not 0 at end");
      done();
    },17000)
    // await parkingInstance.isMatchingSignature(JSON.stringify(amount*ETHER),signature,'387348723983234723', accounts[0], {from:accounts[1]});
  })
})
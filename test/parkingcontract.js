
const ParkingContract = artifacts.require("./ParkerFunctions.sol")

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
        var message = constructPaymentMessage(accounts[3],amount,'387348723983234723',contractAddress);
        const sig = await signMessage(message, callback);
        return sig;
    }


  it("payment should be successful", async() => {
    const parkingInstance = await ParkingContract.deployed();
    const contractAddress = await parkingInstance.getAddress();
    if(await parkingInstance.numberOfFreeParkings(accounts[3]) <= 0) {
      console.log("no parking free");
    }
    await parkingInstance.registerParking(10,web3.utils.toWei("0.1","ether"),100,{from: accounts[3], value: web3.utils.toWei("0.01", "ether")});
    
    if(await parkingInstance.numberOfFreeParkings(accounts[3]) <= 0) {
      console.log("no parking free");
      done(-1);
    }
    await parkingInstance.enterParking(accounts[3],{from: accounts[0], value : web3.utils.toWei("0.05", "ether")})
    var amount = 0.01;
    console.log(accounts[0]);
    console.log(accounts[1]);
    let signature;
    const addAmountSign = setInterval(async () => {
      signature = await signPayment(contractAddress, JSON.stringify(amount*ETHER), () => {console.log(amount,"signed")})
      amount = Number(Number(amount + 0.01).toFixed(2));
      console.log(typeof(amount));
    },5000)
    setTimeout(async()=>{
      clearInterval(addAmountSign)
        const totamt = JSON.stringify(0.03*ETHER);
      const pp = await parkingInstance.claimFunds(totamt,signature, '387348723983234723', accounts[0],{from: accounts[3]});
    },17000)
  })
})
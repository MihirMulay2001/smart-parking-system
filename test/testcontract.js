// // const SimpleStorage = artifacts.require("./SimpleStorage.sol");
// // contract("SimpleStorage", accounts => {
// //   it("...should store the value 89.", async () => {
// //     const simpleStorageInstance = await SimpleStorage.deployed();



// //     // Set value of 89
// //     await simpleStorageInstance.set(89, { from: accounts[0] });

// //     // Get stored value
// //     const storedData = await simpleStorageInstance.get.call();

// //     assert.equal(storedData, 89, "The value 89 was not stored.");
// //   });
// // });

// const ParkingContract = artifacts.require("./ParkingContract.sol")

// contract("ParkingContract", accounts => {
//   it("should park car", async() => {

//     const constructPaymentMessage = (receipAdd, amount, nonce, contractAddr) => {
//       const hash =web3.utils.soliditySha3({type:'address',value: receipAdd },{type:'uint256',value: amount},
//       {type:'uint256',value: nonce},{type:'address',value: contractAddr})
//       // console.log(web3.utils.isHex(hash));
//       return hash
//     }

//     async function signMessage(message, callback) {
//         // web3.eth.personal.sign(
//         //     "0x" + message.toString("hex"),
//         //     web3.eth.defaultAccount,
//         //     callback
//         // );
//         const sig = await web3.eth.sign(message,'0x047D2713E92EBCD3108070C6307B33eB0a4F4b7E', callback);
//         console.log("message after",message);

//       return sig
//       }

//     async function signPayment(contractAddress, amount, callback) {
//         var message = constructPaymentMessage('0x96177Ecebd78Be944b69d5A0Fa05bb20ebFE2486',amount,'387348723983234723',contractAddress);
//         const sig = await signMessage(message, callback);
//       //   const message =web3.utils.soliditySha3({type:'address',value: '0x96177Ecebd78Be944b69d5A0Fa05bb20ebFE2486' },{type:'uint256',value: amount},
//       // {type:'uint256',value: 123456},{type:'address',value: contractAddress})
//       //   console.log("message before",message);
//       //    const sig = await web3.eth.sign(message,'0x047D2713E92EBCD3108070C6307B33eB0a4F4b7E', callback);
//       //     console.log("message after",message);
//       //   console.log("signature",sig);
//         return sig;
//     }

//     // function prefixed(hash) {
//     //   return ethereumjs.ABI.soliditySHA3(
//     //       ["string", "bytes32"],
//     //       ["\x19Ethereum Signed Message:\n32", hash]
//     //   );
//     // }

//     // function recoverSigner(message, signature) {
//     //     var split = ethereumjs.Util.fromRpcSig(signature);
//     //     var publicKey = ethereumjs.Util.ecrecover(message, split.v, split.r, split.s);
//     //     var signer = ethereumjs.Util.pubToAddress(publicKey).toString("hex");
//     //     return signer;
//     // }

//     // function isValidSignature(contractAddress, amount, signature, expectedSigner) {
//     //     var message = prefixed(constructPaymentMessage('0x96177Ecebd78Be944b69d5A0Fa05bb20ebFE2486',amount,'387348723983234723',contractAddress));
//     //     var signer = recoverSigner(message, signature);
//     //     return signer.toLowerCase() ==
//     //         ethereumjs.Util.stripHexPrefix(expectedSigner).toLowerCase();
//     // }


//     web3.eth.handleRevert = true;
//     const ETHER = 10**18

//     const parkingInstance = await ParkingContract.deployed();
//     const contractAddress = await parkingInstance.getAddress();
//     await parkingInstance.enterParking({from: '0x047D2713E92EBCD3108070C6307B33eB0a4F4b7E', value: JSON.stringify(0.3*ETHER)});
    
//     var amount = 0.01;
//     let signature = await signPayment(contractAddress, JSON.stringify(amount*ETHER), () => {console.log(amount,"signed")})
//     console.log(web3.utils.isHex(signature));
//     assert(web3.utils.isHex(signature),true, "signature not a hex");


//     // const signer = await web3.eth.accounts.recover(constructPaymentMessage('0x96177Ecebd78Be944b69d5A0Fa05bb20ebFE2486',amount,'387348723983234723', contractAddress), signature);
//     // assert(signer, '0x047D2713E92EBCD3108070C6307B33eB0a4F4b7E', "not a valid signature")
//     await parkingInstance.claimFunds(JSON.stringify(amount*ETHER),signature, '0x047D2713E92EBCD3108070C6307B33eB0a4F4b7E', {from:'0x96177Ecebd78Be944b69d5A0Fa05bb20ebFE2486'});
//     assert(parkingInstance.getMoney(contractAddress),0, "contract address not 0 at end");
//     // const addAmountSign = setInterval(() => {
//     //   signature = signPayment(contractAddress, JSON.stringify(amount*ETHER), () => {console.log(amount,"signed")})
//     //   amount += 0.01;
//     // },5000)

//     // setTimeout(async()=>{
//     //   clearInterval(addAmountSign)
//     //   await parkingInstance.claimFunds(amount,signature);
//     //   assert(parkingInstance.getMoney(contractAddress),0, "contract address not 0 at end");
//     // },10000)


//     // signPayment(contractAddress,2,function () { console.log("Signed"); })
    

    

//   })
// })
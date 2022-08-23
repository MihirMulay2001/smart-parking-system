import * as React from "react";
import ParkingContract from "../contracts/ParkerFunctions.json";
import getWeb3 from "../getWeb3";
import { signPayment } from "../utils/signatureFunctions";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import users from "../data/users.json";

const client = new W3CWebSocket("ws://192.168.30.206:8888");

const ETHER = (_v) => `${_v * 10 ** 18}`;
let myAmt = 0;
let timeout = null;

export default function useContract() {
  const [web3, setWeb3] = React.useState();
  const [account, setAccount] = React.useState("");
  const [contract, setContract] = React.useState({});

  const [signature, setSignature] = React.useState();
  const [contractAddress, setContractAddress] = React.useState();
  const [amount, setAmount] = React.useState(0.0);
  const [nonce, setNonce] = React.useState("");
  const [owner, setOwner] = React.useState();
  const [parker, setParker] = React.useState({});
  const [showButton, setShowButton] = React.useState(true);
  const [inTime, setInTime] = React.useState("");
  const [outTime, setOutTime] = React.useState(false);
  const [ifRegistered, setIfRegistered] = React.useState(false);
  const [userData, setUserData] = React.useState({});
  const charge = 0.1;

  //247111118375
  window.ethereum.on("accountsChanged", function (accounts) {
    setAccount(accounts[0]);
    console.log(accounts[0]);
  });

  React.useEffect(() => {
    client.onopen = () => {
      console.log("websocket opened");
    };
    client.onmessage = (message) => {
      console.log(JSON.parse(message.data));
      setUserData(users.find((_d) => _d.cardId === message.data));
    };
    const func = async () => {
      try {
        const web3 = await getWeb3();
        setWeb3(web3);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ParkingContract.networks[networkId];
        const instance = new web3.eth.Contract(
          ParkingContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(instance);

        const cntaddr = await instance.methods.getAddress().call();
        console.log(cntaddr);
        setContractAddress(cntaddr);
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };
    func();
  }, []);

  React.useEffect(() => {
    return () => clearInterval(timeout);
  }, []);

  const enterParking = async (e) => {
    const _owner = e;
    // const _nonce = web3.utils.soliditySha3({type:'address',value: account },
    // {type:'uint256',value: Math.floor((new Date()).valueOf()/1000)})
    const _nonce = Math.floor(new Date().valueOf() / 1000);
    setOwner(_owner);
    setNonce(_nonce);
    await contract.methods
      .enterParking(_owner, _nonce)
      .send({ from: account, value: ETHER(0.5) });
    setInTime(Math.floor(new Date().valueOf() / 1000));
    addAmountSign(_owner, _nonce);
    setShowButton(false);
  };
  myAmt = amount;
  const signInterval = async (_owner, _nonce) => {
    console.log(_owner, _nonce);
    const a = Number(Number(myAmt + 0.1).toFixed(2));
    try {
      const signa = await signPayment(
        contractAddress,
        web3,
        ETHER(a),
        account,
        _owner,
        _nonce,
        () => {
          console.log(a, "signed by account", account);
        }
      );
      setSignature(signa);
      setAmount(a);
    } catch (e) {
      console.log("error: ", e);
    }
  };

  const addAmountSign = (_owner, _nonce) => {
    timeout = setInterval(() => {
      const _o = _owner;
      const _n = _nonce;
      signInterval(_o, _n);
    }, 15000);
  };

  const exitParking = async (e) => {
    e.preventDefault();
    clearInterval(timeout);
    setOutTime(new Date().toString());
    const currTime = Math.floor(new Date().valueOf() / 1000);
    console.log(inTime, currTime);
    const amt = (Math.floor((currTime - inTime) / 15) * charge).toFixed(2);
    console.log(amt);
    setParker({
      address: account,
      nonce: nonce,
      amount: ETHER(amt),
      signature: signature,
      owner: owner,
    });
  };

  const claimExit = async (e) => {
    e.preventDefault();

    const {
      address,
      nonce,
      amount: amt,
      signature: sig,
      owner: _owner,
    } = parker;
    console.log(address.toString(), nonce, amt, sig);
    // const currTime = Math.floor((new Date()).valueOf()/1000)
    const getFunds = await contract.methods
      .claimFunds(amt, sig, nonce, address)
      .send({ from: account, gasLimit: 1000000 });
    console.log(getFunds);
  };

  const ifRegisteredFunc = async () => {
    const w = await contract.methods.checkIfOwnerExists(account).call();
    setIfRegistered(w);
  };

  const registerParking = async (_noOfParking, _billAmt, _timeout) => {
    await contract.methods
      .registerParking(_noOfParking, ETHER(_billAmt), _timeout)
      .send({ from: account, value: ETHER(0.001 * _noOfParking) });
  };

  return {
    web3,
    account,
    contract,
    outTime,
    ifRegistered,
    registerParking,
    ifRegisteredFunc,
    enterParking,
    exitParking,
    claimExit,
    showButton,
    amount,
    userData,
    inTime,
    parker,
  };
}

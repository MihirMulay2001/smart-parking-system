import * as React from 'react'
import ParkingContract from '../contracts/ParkingContract.json'
import getWeb3 from "../getWeb3";
import { signPayment } from '../utils/signatureFunctions';

const ETHER = (_v) => `${_v*10**18}`
let myAmt = 0;
let timeout = null;

export default function useContract() {
    const [web3,setWeb3] = React.useState();
    const [account,setAccount] = React.useState('');
    const [contract,setContract] = React.useState({});

    const [signature, setSignature] = React.useState();
    const [contractAddress, setContractAddress] = React.useState()
    const [amount, setAmount] = React.useState(0.0);
    const [nonce, setNonce] = React.useState()
    const [owner, setOwner] = React.useState()
    const [parker, setParker] = React.useState({})
    const [showButton, setShowButton] = React.useState(true)
    const [inTime, setInTime] = React.useState('')
    const [outTime, setOutTime] = React.useState(false)
    const charge = 0.1;


    //247111118375
    window.ethereum.on('accountsChanged', function (accounts) {
        setAccount(accounts[0]);
        console.log(accounts[0]);
    })

    React.useEffect(()=>{
        const func = async () => {
            try {
                const web3 = await getWeb3()
                setWeb3(web3)
                const accounts = await web3.eth.getAccounts()
                setAccount(accounts[0])
                console.log("account: ", account)
                const networkId = await web3.eth.net.getId()
                const deployedNetwork = ParkingContract.networks[networkId]
                const instance = new web3.eth.Contract(
                    ParkingContract.abi,
                    deployedNetwork && deployedNetwork.address,
                );
                setContract(instance)

                const cntaddr = await instance.methods.getAddress().call()
                setContractAddress(cntaddr)
                
            } catch (error) {
                alert(
                    `Failed to load web3, accounts, or contract. Check console for details.`,
                );
                console.error(error);
            }
        }
        func()
    },[])

    React.useEffect(()=> {
        return ()=> clearInterval(timeout);
    }, []);

    const enterParking = async (e) => {
        e.preventDefault()
        setNonce(web3.utils.soliditySha3({type:'address',value: account },
        {type:'uint256',value: Math.floor((new Date()).valueOf()/1000)}))
        console.log(nonce);
        // await contract.methods.enterParking(owner).send({from: account,value: ETHER(0.5) });
        setInTime(new Date().toString())
        addAmountSign() 
        
    }
    myAmt = amount;
    const signInterval = async () => {
            const a = Number(Number(myAmt + 0.10).toFixed(2))
            console.log("amount: ", myAmt);
            try{
                const signa = await signPayment(contractAddress, web3, ETHER(myAmt), account, owner, () => {
                    console.log(a,"signed by account", account)})
                console.log(signa);
                setSignature(signa)
                setAmount(a)
            }catch(e){
                console.log(e);
            }
    }
    const addAmountSign = () => {
        timeout = setInterval(signInterval,3000)
    }


    const exitParking = async (e) => {
        e.preventDefault();
        clearInterval(timeout);
        setOutTime(new Date().toString())
        const inTime = await contract.methods.getInTime(account).call()
        const currTime = Math.floor((new Date()).valueOf()/1000)
        const amt = (Math.floor((currTime - inTime)  / 20) * charge).toFixed(2) 
        console.log(amt);
        setParker(({
                address: account,
                nonce: nonce,
                amount: (amt*ETHER).toString(),
                signature: signature
            })
        )
    }

    const claimExit = async (e) => {
        e.preventDefault()
        
        const {address, nonce, amount: amt, signature : sig} = parker;
        console.log(address, nonce, amt, sig);
        // const currTime = Math.floor((new Date()).valueOf()/1000)
        const getFunds = await contract.methods.claimFunds(amt,sig,nonce, address).send({from: owner})
        console.log(getFunds);
    }
    console.log("new amt: ",amount);

    const ifRegistered = async () => {
        return await contract.methods.checkIfOwnerExists(account);
    }

  return {web3,account,contract, outTime, ifRegistered, 
    enterParking, exitParking, claimExit, showButton, amount, inTime}
}

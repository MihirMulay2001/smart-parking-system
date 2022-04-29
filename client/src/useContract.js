import * as React from 'react'
import ParkingContract from './contracts/ParkingContract.json'
import getWeb3 from "./getWeb3";

const ETHER = 10**18;
const PARKING_OWNER = '0x4720C905840383E93ed84A7ECCe181B76c9a62E1'
export default function useContract() {
    const [web3,setWeb3] = React.useState();
    const [accounts,setAccounts] = React.useState([]);
    const [contract,setContract] = React.useState({});
    const [signature, setSignature] = React.useState();
    const [contractAddress, setContractAddress] = React.useState()
    const [amount, setAmount] = React.useState(0.0);
    const [nonce, setNonce] = React.useState()
    const [timer, setTimer] = React.useState()
    const [parker, setParker] = React.useState({})
    const [showButton, setShowButton] = React.useState(false)
    const [inTime, setInTime] = React.useState('')
    const [outTime, setOutTime] = React.useState(false)
    const charge = 0.1;
    //247111118375
    window.ethereum.on('accountsChanged', function (accounts) {
        setAccounts(accounts);
        console.log(accounts[0]);
    })
    React.useEffect(()=>{
        const func = async () => {
            try {
                const web3 = await getWeb3()
                setWeb3(web3)
                const accounts = await web3.eth.getAccounts()
                console.log(accounts);
                setAccounts(accounts)
                const networkId = await web3.eth.net.getId()
                const deployedNetwork = ParkingContract.networks[networkId]
                const instance = new web3.eth.Contract(
                    ParkingContract.abi,
                    deployedNetwork && deployedNetwork.address,
                );
                setContract(instance)
                const cntaddr = await instance.methods.getAddress().call()
                setContractAddress(cntaddr)
                const n =  JSON.stringify(Math.floor(Math.random() * 100000))
                setNonce(n)
                const int = setInterval(()=>{
                        try{
                            fetch('http://192.168.19.206:5000/')
                            .then(res => res.json())
                            .then(data => {
                                if((data.toString()).length > 2){
                                    setShowButton(true);
                                    clearInterval(int)
                                }
                            })
                        }catch(e){
                            console.log(e);
                        }
                    
                }, 3000)
                
            } catch (error) {
                alert(
                    `Failed to load web3, accounts, or contract. Check console for details.`,
                );
                console.error(error);
            }
        }
        func()
    },[])

    const constructPaymentMessage = (receipAdd, amount, contractAddr) => {
        console.log(receipAdd, amount, nonce, contractAddr);
        // console.log("nonce",nonce);
      const hash =web3.utils.soliditySha3({type:'address',value: receipAdd },{type:'uint256',value: amount},
      {type:'uint256',value: nonce},{type:'address',value: contractAddr})
      return hash
    }

    async function signMessage(message, callback) {
        const sig = await web3.eth.personal.sign(message,accounts[0], callback);
        return sig
      }

    async function signPayment(contractAddress, amount, callback) {        
        const message = constructPaymentMessage(PARKING_OWNER,amount,contractAddress);
        const sig = await signMessage(message, callback);
        return sig
    }

    const getContractAddress = () => {
        return contract.getAddress().call()
    }

    const getBalance = () => {
        // return web3.eth.getBalance(accounts[0])
        return web3.fromWei(web3.eth.getBalance(accounts[0]));
    }
 
    const enterParking = async (e) => {
        e.preventDefault()
        await contract.methods.enterParking().send({from: accounts[0],value: JSON.stringify(0.5*ETHER) });
        setInTime(new Date().toString())
        setTimer(addAmountSign())
        
    }

    const signInterval = () => {
            setAmount(amot => {
                const foo = async () => {
                    const a = Number(Number(amot + 0.10).toFixed(2))
                    const signa = await signPayment(contractAddress, JSON.stringify(a*ETHER), () => {console.log(a,"signed by account", accounts[0])})
                    console.log(signa);
                    setSignature(signa)
                }
                foo();
                return Number(Number(amot + 0.10).toFixed(2))
            });
    }

    const addAmountSign = () => {
        let int = setInterval(signInterval,20000)
        return int
    }


    const exitParking = async (e) => {
        e.preventDefault();
        clearInterval(timer);
        setOutTime(new Date().toString())
        const inTime = await contract.methods.getInTime(accounts[0]).call()
        const currTime = Math.floor((new Date()).valueOf()/1000)
        const amt = (Math.floor((currTime - inTime)  / 20) * charge).toFixed(2) 
        console.log(amt);
        setParker(({
                address: accounts[0],
                nonce: nonce,
                amount: (amt*ETHER).toString(),
                signature: signature
            })
        )
    }

    const claimExit = async (e) => {
        e.preventDefault()
        
        const {address, nonce, amount:amt, signature : sig} = parker;
        console.log(address, nonce, amt, sig);
        // const currTime = Math.floor((new Date()).valueOf()/1000)
        const getFunds = await contract.methods.claimFunds(amt,sig,nonce, address).send({from: PARKING_OWNER})
        console.log(getFunds);
    }

  return {web3,accounts,contract, outTime, 
    enterParking, exitParking, claimExit, getBalance, showButton, amount, inTime}
}

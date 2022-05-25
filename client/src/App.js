import * as React from 'react';
import useContract from './hooks/useContract';
import Client from './sections/Client';
import Owner from './sections/Owner';
import './App.css'

const App = () => {
    const {web3,enterParking, contract,inTime, outTime, registerParking,
      exitParking, claimExit, getBalance, showButton, amount, parker, ifRegistered} = useContract();

    const [user, setUser] = React.useState('owner')
    if(!web3 || contract == {}) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <div className="App">
        <div className="menu">
          <div className={user === "parker" ? "active" : ""}
          onClick={() => setUser("parker")}>
            Parker
          </div>
          <div className={user === "owner" ? "active" : ""}
          onClick={() => setUser("owner")}>
            Owner
          </div>
        </div>
        <div className="websection">
          {
            user === 'parker'
            ?<div className='parker'>
              <Client showButton = {showButton} enterParking={enterParking} inTime={inTime}
              exitParking={exitParking} getBalance={getBalance} amount={amount} outTime={outTime}
              />
            </div>
            :''
          }
          {
            user === 'owner'
            ?<div className='owner'>
              <Owner claimExit={claimExit} registerParking={registerParking} parker={parker} ifRegistered={ifRegistered}/>
            </div>
            :''
          }
        </div>         
          
      </div>
    )
}
export default App;


























// import React, { Component } from "react";
// // import SimpleStorageContract from "./contracts/SimpleStorage.json";
// import ParkingContract from './contracts/ParkingContract.json'
// import getWeb3 from "./getWeb3";

// import "./App.css";

// class App extends Component {
//   state = {web3: null, accounts: null, contract: null };

//   componentDidMount = async () => {
//     try {
//       // Get network provider and web3 instance.
//       const web3 = await getWeb3();

//       // Use web3 to get the user's accounts.
//       const accounts = await web3.eth.getAccounts();

//       // Get the contract instance.
//       const networkId = await web3.eth.net.getId();
//       const deployedNetwork = ParkingContract.networks[networkId];
//       const instance = new web3.eth.Contract(
//         ParkingContract.abi,
//         deployedNetwork && deployedNetwork.address,
//       );

//       // Set web3, accounts, and contract to the state, and then proceed with an
//       // example of interacting with the contract's methods.
//       this.setState({ web3, accounts, contract: instance });
//     } catch (error) {
//       // Catch any errors for any of the above operations.
//       alert(
//         `Failed to load web3, accounts, or contract. Check console for details.`,
//       );
//       console.error(error);
//     }
//   };

//   // runExample = async () => {
//   //   const { accounts, contract } = this.state;

//   //   // Stores a given value, 5 by default.
//   //   await contract.methods.set(5).send({ from: accounts[0] });

//   //   // Get the value from the contract to prove it worked.
//   //   const response = await contract.methods.get().call();

//   //   // Update state with the result.
//   //   this.setState({ storageValue: response });
//   // };


//   render() {
//     if (!this.state.web3) {
//       return <div>Loading Web3, accounts, and contract...</div>;
//     }
//     return (
//       <div className="App">
//           <div>
//             <div>
//               Car 1
//               <button onClick={enterParking}>
//                 Enter parking
//               </button>
//               <button onClick={leaveParking}>
//                 Leave parking
//               </button>
//               <div>
//                 Entry time: {}
//               </div>
//               <div>
//                 Total money: {}
//               </div>
//             </div>
//             {/* <div>
//               Car 2
//               <button>
//                 Enter parking
//               </button>
//               <button>
//                 Leave parking
//               </button>
//               <div>
//                 Entry time: {}
//               </div>
//               <div>
//                 Total money: {}
//               </div>
//             </div>
//             <div>
//               Car 3
//               <button>
//                 Enter parking
//               </button>
//               <button>
//                 Leave parking
//               </button>
//               <div>
//                 Entry time: {}
//               </div>
//               <div>
//                 Total money: {}
//               </div>
//             </div> */}
//           </div>
//       </div>
//     );
//   }
// }

// export default App;

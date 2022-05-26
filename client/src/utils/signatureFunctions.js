
    
    const constructPaymentMessage = (_receipAdd, _amount, _contractAddr, _nonce, web3) => {
        const hash =web3.utils.soliditySha3({type:'address',value: _receipAdd },
        {type:'uint256',value: _amount},{type:'uint256',value: _nonce},
        {type:'address',value: _contractAddr})
        return hash
    }

    async function signMessage(_message, web3, account, _callback) {
        const _sig = await web3.eth.personal.sign(_message,account, _callback);
        return _sig
      }

    export async function signPayment(_contractAddress,web3, _amount, account, owner, nonce, _callback) {        
        const message = constructPaymentMessage(owner,_amount,_contractAddress,nonce, web3);
        const _sig = await signMessage(message,web3,account, _callback);
        return _sig
    }
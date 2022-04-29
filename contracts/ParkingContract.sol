// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

contract ParkingContract {
    struct Parker {
        uint256 inTime;
        uint256 maxValue;
    }
    mapping(address => Parker) parkers;
    mapping(uint256 => bool) usedNonces;
    address payable receiver =
        payable(0x4720C905840383E93ed84A7ECCe181B76c9a62E1);
    address payable contractAddress;
    uint256 timeout = 50;
    uint256 billAmt = 0.1 ether;

    constructor() payable {
        contractAddress = payable(address(this));
    }

    event Print(bytes32);

    function enterParking() public payable {
        require(msg.value >= 0.5 ether, "Not enough funds to enter parking");
        (bool sent, ) = payable(address(this)).call{value: msg.value}("");
        require(sent, "amount not sent to contract");
        parkers[msg.sender] = Parker({
            inTime: block.timestamp,
            maxValue: msg.value
        });
    }

    function getFinalamt() public view returns (uint256) {
        // uint256 totamt = ((block.timestamp - parkers[msg.sender].inTime) / 15) *
        //     billAmt;
        return block.timestamp;
    }

    function claimFunds(
        uint256 amount,
        bytes memory signature,
        uint256 nonce,
        address payable sender
    ) external payable returns (bool) {
        require(!usedNonces[nonce], "Nonce already used before");
        usedNonces[nonce] = true;
        require(msg.sender == receiver, "owner not equal to receiver");
        require(
            parkers[sender].maxValue != 0 && parkers[sender].maxValue >= amount,
            "parker not in parking"
        );
        // uint256 totamt = ((block.timestamp - parkers[sender].inTime) / 15) *
        //     billAmt;
        // require(totamt == amount, "wrong amount withdrawn");
        require(
            isValidSignature(amount, signature, nonce, sender),
            "not a valid signature"
        );
        (bool sent1, ) = receiver.call{value: amount}("");
        require(sent1, "funds not received by parking system");
        (bool sent2, ) = sender.call{
            value: (parkers[sender].maxValue - amount)
        }("");
        require(sent2, "remaining funds not returned to parker");
        parkers[sender] = Parker({inTime: 0, maxValue: 0});
        return true;
    }

    function claimTimeout() external payable {
        require(block.timestamp > parkers[msg.sender].inTime + timeout);
        require(
            parkers[msg.sender].maxValue > 0.1 ether,
            "no amount in contract"
        );
        (bool sent, ) = payable(msg.sender).call{
            value: parkers[msg.sender].maxValue
        }("");
        require(sent, "funds not removed by parking system");
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getAddress() public view returns (address) {
        return address(this);
    }

    function getInTime(address addr) public view returns (uint256) {
        return parkers[addr].inTime;
    }

    function isMatchingSignature(
        uint256 amount,
        bytes memory signature,
        uint256 nonce,
        address sender
    ) public returns (bool) {
        return isValidSignature(amount, signature, nonce, sender);
    }

    function isValidSignature(
        uint256 amount,
        bytes memory signature,
        uint256 nonce,
        address sender
    ) internal returns (bool) {
        emit Print(0);
        bytes32 message = prefixed(
            keccak256(
                abi.encodePacked(msg.sender, amount, nonce, contractAddress)
            )
        );
        emit Print(message);
        return recoverSigner(message, signature) == sender;
    }

    function recoverSigner(bytes32 message, bytes memory signature)
        internal
        pure
        returns (address)
    {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);
        // if (v != 27 || v != 28) {
        //     return (receiver);
        // }
        return ecrecover(message, v, r, s);
    }

    function splitSignature(bytes memory signature)
        internal
        pure
        returns (
            uint8 v,
            bytes32 r,
            bytes32 s
        )
    {
        require(signature.length == 65, "Signature is invalid length");
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }
        if (v < 27) {
            v += 27;
        }
        return (v, r, s);
    }

    event ParkerDetails(uint256, uint256);

    function parkerDetails(address _sender) public view returns (uint256) {
        return parkers[_sender].inTime;
    }

    function prefixed(bytes32 hashv) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", hashv)
            );
    }

    event Received(address, uint256);

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {}
}

//SPDX-License-Identifier: MIT

pragma solidity >0.6.0;
import "./ParkingSystem.sol";

contract ParkerFunctions is ParkingSystem {
    function numberOfFreeParkings(address _owner) public view returns (uint16) {
        return ownersList[_owner].numOfParkings;
    }

    function enterParking(address payable _owner) external payable {
        require(
            ownersList[_owner].numOfParkings > 0,
            "No free parking space left"
        );
        require(msg.value >= 0.05 ether, "Not enough funds to enter parking");
        (bool sent, ) = payable(contractAddress).call{value: msg.value}("");
        require(sent, "amount not sent to contract");
        parkersList[msg.sender] = ParkerInfo({
            inTime: block.timestamp,
            maxValue: msg.value,
            owner: _owner
        });
        ParkingInfo storage parkOwner = ownersList[_owner];
        parkOwner.numOfParkings--;
    }

    function claimFunds(
        uint256 _amount,
        bytes memory _signature,
        uint256 _nonce,
        address payable _sender
    ) external payable {
        require(!usedNonces[_nonce], "Nonce already used before");
        usedNonces[_nonce] = true;
        require(
            parkersList[_sender].maxValue != 0 &&
                parkersList[_sender].maxValue >= _amount &&
                parkersList[_sender].inTime != 0,
            "parker not in parking"
        );
        require(
            isValidSignature(
                _amount,
                _signature,
                _nonce,
                _sender,
                contractAddress,
                msg.sender
            ),
            "not a valid signature"
        );
        (bool sent1, ) = payable(msg.sender).call{value: _amount}("");
        require(sent1, "funds not received by parking system");
        (bool sent2, ) = _sender.call{
            value: parkersList[_sender].maxValue - _amount
        }("");
        require(sent2, "remaining funds not returned to parker");
        parkersList[_sender] = ParkerInfo({
            inTime: 0,
            maxValue: 0,
            owner: payable(address(0))
        });
        ParkingInfo storage parkOwner = ownersList[msg.sender];
        parkOwner.numOfParkings++;
    }

    function getAddress() public view returns (address) {
        return contractAddress;
    }
}

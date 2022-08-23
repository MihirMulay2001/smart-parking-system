// SPDX-License-Identifier: MIT

pragma solidity >=0.5.1;
import "./SigCheck.sol";

contract ParkingSystem is SigCheck {
    struct ParkerInfo {
        uint256 inTime;
        uint256 maxValue;
        address payable owner;
    }
    struct ParkingInfo {
        uint16 numOfParkings;
        uint256 billAmt;
        uint256 timeout;
    }
    mapping(address => ParkingInfo) ownersList;
    mapping(address => ParkerInfo) parkersList;
    mapping(uint256 => bool) usedNonces;
    address internal contractAddress;

    event RegisterParking(
        address indexed owner,
        uint16 numOfParking,
        uint256 billamt,
        uint256 timeout
    );

    function registerParking(
        uint16 _numOfParking,
        uint256 _billAmt,
        uint256 _timeout
    ) external payable {
        require(msg.value == _numOfParking * 0.001 ether, "not enough money ");
        payable(contractAddress).transfer(msg.value);
        ownersList[msg.sender] = ParkingInfo(_numOfParking, _billAmt, _timeout);
    }

    function checkIfOwnerExists(address _owner) public view returns (bool) {
        if (ownersList[_owner].billAmt > 0) {
            return true;
        }
        return false;
    }
}

var ParkingContract = artifacts.require("./ParkingContract.sol");

module.exports = function(deployer) {
  deployer.deploy(ParkingContract);
};

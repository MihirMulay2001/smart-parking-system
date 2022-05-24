var ParkingContract = artifacts.require("./ParkerFunctions.sol");

module.exports = function(deployer) {
  deployer.deploy(ParkingContract);
};

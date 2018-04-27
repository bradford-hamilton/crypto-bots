/* eslint-disable */
const Ownable = artifacts.require("./Ownable.sol");
const BotBase = artifacts.require("./BotBase.sol");
const BotOwnership = artifacts.require("./BotOwnership.sol");
const BotCore = artifacts.require("./BotCore.sol");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.deploy(BotBase);
  deployer.deploy(BotOwnership);
  deployer.deploy(BotCore);
}

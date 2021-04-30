const Ethgram = artifacts.require("Ethgram");

module.exports = function (deployer) {
  deployer.deploy(Ethgram);
};

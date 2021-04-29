const Ethtragram = artifacts.require("Ethgram");

module.exports = function (deployer) {
  deployer.deploy(Ethtragram);
};

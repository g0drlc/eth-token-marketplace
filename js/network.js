import Web3 from 'web3';
import { LOCALHOST_PROVIDER } from 'constants'

const Network = {
  web3() {
    return new Web3(this.provider())
  },

  eth() {
    return this.web3().eth;
  },

  provider() {
    if (typeof web3 !== 'undefined') return web3.currentProvider
    return new Web3.providers.HttpProvider(LOCALHOST_PROVIDER)
  },

  async validateCode(address, code) {
    const foundCode = await Network.getCode(address)
    const cleanFoundCode = foundCode ? foundCode.replace("0x", "").replace(/0/g, "") : ''
    return cleanFoundCode === code;
  },

  getCode(address) {
    return new Promise(function (resolve, reject) {
      Network.eth().getCode(address, Network._web3Callback(resolve, reject))
    });
  },

  getAccounts() {
    return new Promise(function (resolve, reject) {
      Network.eth().getAccounts(Network._web3Callback(resolve, reject))
    });
  },

  getBalance(address) {
    return new Promise(function (resolve, reject) {
      Network.eth().getBalance(address, Network._web3Callback(resolve, reject))
    });
  },

  getTransaction(txHash) {
    return new Promise(function (resolve, reject) {
      Network.eth().getTransaction(txHash, Network._web3Callback(resolve, reject))
    });
  },

  promisified(group, method, ...args) {
    return new Promise(function (resolve, reject) {
      let parameters = args;
      parameters[args.length] = callback(resolve, reject);
      parameters.length++;
      Network.web3()[group][method].apply(web3[group], parameters);
    })
  },

  _web3Callback(resolve, reject) {
    return function (error, value) {
      if (error) reject(error);
      else resolve(value);
    }
  }
}

export default Network
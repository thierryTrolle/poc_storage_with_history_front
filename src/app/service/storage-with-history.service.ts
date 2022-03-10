import { Injectable } from '@angular/core';
import Web3 from "web3";
const contract = require('@truffle/contract');
const storageArtifact = require('../../../build/contracts/StorageWithHistory.json');

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class StorageWithHistoryService {

  private web3: any;

  private storageInstanceCache: any=null;

  private mapContractAddressByChainId = new Map();

  constructor() {
    this.web3 = new Web3(window.ethereum);
    //Address contract on dev with ganach
    this.mapContractAddressByChainId.set('1337','0x7B4f3981333958cbD491F3000002B670673550BC');
    //Address contract on matic testnet mumbai
    this.mapContractAddressByChainId.set('80001','0x628DC52Ef525BB50E90c3205E387B13476B6eCb1');
  }

  /**
   * Generate an instance of storageService and cache it.
   * @returns instance of storage service.
   */
  private async getStorageInstance() {
    if(this.storageInstanceCache!=null) return this.storageInstanceCache;
    console.log("load getStorageInstance()");
    const contractAbstraction = contract(storageArtifact);
    contractAbstraction.setProvider(this.web3.currentProvider);
    let chainId:string=await this.web3.eth.getChainId();
    console.log("Current chainId="+chainId);
    this.storageInstanceCache=contractAbstraction.at(this.mapContractAddressByChainId.get(chainId.toString()));
    // this.storageInstanceCache=await contractAbstraction.deployed(); //truffle migrating instance 
    return this.storageInstanceCache;
  }

  /**
   * Get value stored 
   * @returns BN, Value stored
   */
  public async getValue(){
    let instance= await this.getStorageInstance();
    return await instance.getValue();
  }

  /**
   * 
   * @returns BN, length of history stored
   */
  public async getHistoryLength(){
    let instance= await this.getStorageInstance();
    return await instance.getHistoryLenght();
  }

  /**
   * To set new stored value.
   * 
   * @param value : new value to store
   * @param senderAddress : sender address
   * @returns Object, result.logs[0].event == "EventSetValue"
   */
  public async setValue(value:number,senderAddress:string){
    let instance= await this.getStorageInstance();
    return await instance.setValue(value,{ from: senderAddress });
  }

  // public openMetamask = async () => {
  //   window.web3 = new Web3(window.ethereum);
  //   let addresses = await this.getAccounts();
  //   console.log("service", addresses)
  //   if (!addresses.length) {
  //     try {
  //       addresses = await window.ethereum.enable();
  //     } catch (e) {
  //       return false;
  //     }
  //   }
  //   return addresses.length ? addresses[0] : null;
  // };
}

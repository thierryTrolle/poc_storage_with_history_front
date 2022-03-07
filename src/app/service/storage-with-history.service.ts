import { Injectable } from '@angular/core';
import { from,Observable } from 'rxjs';
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

  constructor() {
    this.web3 = new Web3(window.ethereum);
  }

  //fixme mettre en cache
  private async getStorageInstance() {
    if(this.storageInstanceCache!=null) return this.storageInstanceCache;
    const contractAbstraction = contract(storageArtifact);
    contractAbstraction.setProvider(this.web3.currentProvider);
    this.storageInstanceCache=await contractAbstraction.deployed();
    return this.storageInstanceCache;
  }

  public async getValue(){
    let instance= await this.getStorageInstance();
    return await instance.getValue();
  }

  public async getHistoryLength(){
    let instance= await this.getStorageInstance();
    return await instance.getHistoryLenght();
  }

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

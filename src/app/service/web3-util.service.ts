import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Web3 from "web3";

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3UtilService {

  private web3: any;

  constructor() { 
    this.web3 = new Web3(window.ethereum);
  }

  /**
   * Get ChainId of EVM network
   * 
   * @returns int idChain
   */
  public async getChainId():Promise<any>{
    return await this.web3.eth.getChainId();
  }

  /**
   * Use environnement.supportedChainId to know.
   * 
   * @param chainId chainId of wallet network 
   * @returns 
   */
  public isSupportedChainId(chainId:string):boolean{
    return environment.supportedChainId.includes(chainId);
  }
}

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
  public async getChainId(): Promise<any> {
    return await this.web3.eth.getChainId();
  }

  /**
   * Use environnement.supportedChainId to know.
   * 
   * @param chainId chainId of wallet network 
   * @returns 
   */
  public isSupportedChainId(chainId: string): boolean {
    return environment.supportedChainId.includes(chainId);
  }

  /**
   * Truncates an ethereum address to the format 0x0000…0000
   * @param address Full address to truncate
   * @returns Truncated address
   */
  public truncateAddress(address: any) {
    const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

    let match = address.match(truncateRegex);
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
  };
}

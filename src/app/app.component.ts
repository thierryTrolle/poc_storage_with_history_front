import { Component } from '@angular/core';
import { Address } from 'cluster';
// import { EHOSTUNREACH } from 'constants';
import Web3 from 'web3';

declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pocStorageWithHistoryFront';
  // private web3: Web3;
  private currentAccount: string = '';

  constructor() {
  }

  connect(){
    window.ethereum.request({ method: 'eth_requestAccounts' }).then(() => {
      console.log("Use Mist/MetaMask's provider");
      // web3: Web3 = new Web3(window.ethereum);

      window.ethereum.on("accountsChanged", (accounts: string | any[]) => {
        if (accounts.length > 0) {
          this.currentAccount = accounts[0];
          console.log(`Account connected: ${accounts[0]}`);
        } else {
          console.log("Account disconnected");
          window.location.reload();
        }
      });

      window.ethereum.on('connect', (x:string) => {
        console.log("event connect"+x)
      });

      window.ethereum.on('accountsChanged', (x:any) => {
        console.log("event accountsChanged:"+x)
      });

      window.ethereum.on('message', (x:any) => {
        console.log("event message"+x)
      });

      //catch chainChanged
      window.ethereum.on('chainChanged', (chainId: string) => {
        console.log("chainChanged:" + chainId);
      });
      window.ethereum.on('connect', () => console.log("event connect"));

      window.ethereum.on('message', () => console.log("event message"));

      window.ethereum.on('disconnect', () => console.log("event disconnect"));

      // window.ethereum.on('accountsChanged', () => console.log("event accountsChanged"));
    }).catch((err: any) => {
      if (err.code === 4001) { // EIP 1193 userRejectedRequest error
        console.log('Please connect to MetaMask.');
      } else if(err.code === -32002){
        console.log('Metamask not open');
      }else {
        console.error(err);
        //{"code": -32002, "message": "Already processing eth_requestAccounts. Please wait.}
      }
    });
  }
}
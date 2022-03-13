import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogSimpleComponent } from '../dialog-simple/dialog-simple.component';
import { JavascriptUtilService } from '../service/javascript-util.service';
import { StorageWithHistoryService } from '../service/storage-with-history.service';
import { Web3UtilService } from '../service/web3-util.service';

const contract = require('@truffle/contract');
const storageArtifact = require('../../../build/contracts/StorageWithHistory.json');


declare let window: any;

@Component({
  selector: 'app-web3app',
  templateUrl: './web3app.component.html',
  styleUrls: ['./web3app.component.css']
})
export class Web3appComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  public isProcessing: boolean = false;

  public currentAccount: any = '0x';

  public valueStored: any = 0;

  public newValue: any = 0;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private javascriptUtils: JavascriptUtilService,
    private storageWithHistory: StorageWithHistoryService,
    private web3UtilService:Web3UtilService
  ) {
    this.connect();
  }

  handleAccountsChanged(accounts: any) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      this.router.navigate(['home']);
    } else if (accounts[0] !== this.currentAccount) {
      this.currentAccount = accounts[0];
      // this.openSnackBar('User connected', this.currentAccount);
      // Do any other work!
    }
  }
  reload(){
    window.location.reload();
  }

  connect() {
    var that = this;
    window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: any) => {

      //test chain id is supported
      this.web3UtilService.getChainId().then(
        chainId=>{
          if(!this.web3UtilService.isSupportedChainId(chainId.toString())){
            this.dialog.open(DialogSimpleComponent, {
              data: {
                tittle: 'Browser wallet Error.',
                content: 'no supported network !'
              },
            });
          }
        }
      );

      this.handleAccountsChanged(accounts);

      window.ethereum.on('accountsChanged', (x: any) => {
        console.log("event accountsChanged:" + x);
        window.location.reload();
      });

      //Do with connect error because reload !
      window.ethereum.on('disconnect', () => {
        console.log("event disconnect");
        that.router.navigate(['home']);
      });


      window.ethereum.on('chainChanged', (chainId: any) => {
        window.location.reload();
      });

    }).catch((err: any) => {
      // doesn't work ! because disconect reload page ?
      this.router.navigate(['home']);
    });

    //Load get value
    this.loadValue();
  }

  loadValue() {
    this.storageWithHistory.getValue().then(
      (value: any) => {
        console.log(`promise result: ${value}`);
        this.valueStored = value;
      }
    );
  }

  setValue() {
    if (!this.javascriptUtils.isInt(this.newValue)) {
      this.dialog.open(DialogSimpleComponent, {
        data: {
          tittle: 'User error',
          content: 'New value to store must be an integer, value tried:'+this.newValue
        },
      });
    } else {
      this.isProcessing = true;
      this.storageWithHistory.setValue(this.newValue, this.currentAccount).then(
        result => {
          if (result.receipt.status && result.logs[0].event == "EventSetValue") {
            console.log(result);
            this.loadValue();
            this.newValue = 0;
            this.isProcessing = false;
            this.dialog.open(DialogSimpleComponent, {
              data: {
                tittle: 'User info',
                content: 'Congrats, new value is stored'
              },
            });
          }
        },
        error => {
          this.isProcessing = false;
          console.error(error);
          if (error.code && error.message) {
            this.dialog.open(DialogSimpleComponent, {
              data: {
                tittle: 'Error code ' + error.code,
                content: error.message
              },
            });
          }
        }
      )
    }
  }

  ngOnInit(): void {
    console.log("ngOnInit()");
  }

  ngOnChanges(): void {
    console.log("ngOnChanges()");
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy()");
  }

  //Open information popup
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });;
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

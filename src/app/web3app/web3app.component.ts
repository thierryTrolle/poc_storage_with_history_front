import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
// import { StorageWithHistoryService } from '../service/storage-with-history.service';
import Web3 from "web3";
import { DialogSimpleComponent } from '../dialog-simple/dialog-simple.component';
import { JavascriptUtilService } from '../service/javascript-util.service';
import { StorageWithHistoryService } from '../service/storage-with-history.service';

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
    private storageWithHistory: StorageWithHistoryService
  ) {
    this.connect();
  }

  handleChainChanged(_chainId: any) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
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

  connect() {
    var that = this;
    window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: any) => {

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

}

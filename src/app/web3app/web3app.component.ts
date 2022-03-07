import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';

declare let window: any;

@Component({
  selector: 'app-web3app',
  templateUrl: './web3app.component.html',
  styleUrls: ['./web3app.component.css']
})
export class Web3appComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  // public currentAddress: string = 'not connected';

  currentAccount: any = '0x';

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
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
    var that=this;
    window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: any) => {

      this.handleAccountsChanged(accounts);

      window.ethereum.on('accountsChanged', (x:any) => {
        console.log("event accountsChanged:"+x);
        window.location.reload();
      });

      //Do with connect error because reload !
      window.ethereum.on('disconnect', () => {
        console.log("event disconnect");
        that.router.navigate(['home']);
      });

    }).catch((err: any) => {
      // doesn't work ! because disconect reload page ?
      this.router.navigate(['home']);
    });
  }

  ngOnInit(): void {
    console.log("ngOnInit()");
  }

  ngOnChanges():void{
    console.log("ngOnChanges()");
  }

  ngOnDestroy():void{
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

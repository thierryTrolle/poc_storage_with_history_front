import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogSimpleComponent } from '../dialog-simple/dialog-simple.component';

declare let window: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    public dialog: MatDialog,
    ) { 
    //Test if browser wallet installed 
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      // Use Mist/MetaMask's provider
    }else{
      console.log('MetaMask is not installed!');
      this.router.navigate(['download-page']);
    }
  }

  ngOnInit(): void {
  }

  connect(){
    window.ethereum.request({ method: 'eth_requestAccounts' }).then(() => {
      console.log("Use Mist/MetaMask's provider");
      this.router.navigate(['web3app']);
    }).catch((err: any) => {
      if (err.code === 4001) { // EIP 1193 userRejectedRequest error
        console.log('Please connect to MetaMask.');
        this.dialog.open(DialogSimpleComponent, {
          data: {
            tittle: 'Browser wallet Error.',
            content: 'Please open your browser wallet :)'
          },
        });
      } else if(err.code === -32002){
        this.dialog.open(DialogSimpleComponent, {
          data: {
            tittle: 'Browser wallet is close.',
            content: 'Please open your browser wallet :)'
          },
        });
        console.log('Metamask not open');
      }else {
        console.error(err);
      }
    });
  }

}

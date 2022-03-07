import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DownloadPageComponent } from './download-page/download-page.component';
import { HomeComponent } from './home/home.component';
import { Web3appComponent } from './web3app/web3app.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },//redirection par defaut
  { path: 'home', component: HomeComponent },
  { path: 'web3app', component: Web3appComponent },
  { path: 'download-page', component: DownloadPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

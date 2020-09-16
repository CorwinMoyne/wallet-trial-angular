import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WalletModule } from '@funfair-tech/wallet-angular';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, WalletModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

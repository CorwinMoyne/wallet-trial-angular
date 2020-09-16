import { Component } from '@angular/core';
import {
  AuthenticationCompletedResponse,
  MessageListeners,
  RestoreAuthenticationCompletedResponse,
  WalletDeviceDeletedLoggedOutResponse,
  WalletInactivityLoggedOutResponse,
} from '@funfair-tech/wallet-sdk';
// for this to not give compile time errors please add "./node_modules/@funfair-tech/wallet-sdk/window.ts"
// to your files object in tsconfig.app.json
import window from '@funfair-tech/wallet-sdk/window';
// For ease of the example we have just used subjects here.
// A bigger more complex app should probably use a store framework like redux.
// If your hooking this into a big app you probably have your own state management anyway.
// If not and this is your first state storing feel free to use `BehaviorSubject` like the below.
import { Observable } from 'rxjs';
import { StoreService } from './store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public restoreAuthenticationTaskCompleted$: Observable<
    boolean
  > = StoreService.restoreAuthenticationTaskCompleted.pipe();

  public isAuthenticationCompleted$: Observable<
    boolean
  > = StoreService.isAuthenticationCompleted.pipe();

  constructor() {}

  public walletLoaded() {
    // https://funfair-tech.github.io/fun-wallet-docs/guide/web-sdk/sdk-event-listeners.html#authenticationcompleted
    window.funwallet.sdk.on<AuthenticationCompletedResponse>(
      MessageListeners.authenticationCompleted,
      (result: AuthenticationCompletedResponse) => {
        if (result.origin === 'https://wallet.funfair.io') {
          StoreService.isAuthenticated$.next(true);
        }
      }
    );

    // https://funfair-tech.github.io/fun-wallet-docs/guide/web-sdk/sdk-event-listeners.html#restoreauthenticationcompleted
    window.funwallet.sdk.on<RestoreAuthenticationCompletedResponse>(
      MessageListeners.restoreAuthenticationCompleted,
      (result: RestoreAuthenticationCompletedResponse) => {
        if (result.origin === 'https://wallet.funfair.io') {
          StoreService.restoreAuthenticationTaskCompleted.next(true);
        }
      }
    );

    // MUST HAVE TO KEEP YOUR APPS AUTHENTICATION STATE IN SYNC
    // https://funfair-tech.github.io/fun-wallet-docs/guide/web-sdk/sdk-event-listeners.html#walletinactivityloggedout
    window.funwallet.sdk.on<WalletInactivityLoggedOutResponse>(
      MessageListeners.walletInactivityLoggedOut,
      (result: WalletInactivityLoggedOutResponse) => {
        if (result.origin === 'https://wallet.funfair.io') {
          StoreService.isAuthenticated$.next(false);
        }
      }
    );

    // MUST HAVE TO KEEP YOUR APPS AUTHENTICATION STATE IN SYNC
    // https://funfair-tech.github.io/fun-wallet-docs/guide/web-sdk/sdk-event-listeners.html#walletdevicedeletedloggedout
    window.funwallet.sdk.on<WalletDeviceDeletedLoggedOutResponse>(
      MessageListeners.walletDeviceDeletedLoggedOut,
      (result: WalletDeviceDeletedLoggedOutResponse) => {
        if (result.origin === 'https://wallet.funfair.io') {
          StoreService.isAuthenticated$.next(false);
        }
      }
    );

    // https://funfair-tech.github.io/fun-wallet-docs/guide/web-sdk/sdk-event-listeners.html#list-of-all-available-listeners
    // register all the other events your interested in here...
  }

  /**
   * Login
   */
  public login(): void {
    window.funwallet.sdk.openWalletAuthenticationPopUp();
  }

  /**
   * Logout from the wallet
   */
  public async logout(): Promise<void> {
    await window.funwallet.sdk.logout();
    StoreService.isAuthenticationCompleted.next(false);
  }
}

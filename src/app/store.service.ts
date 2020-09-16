import { BehaviorSubject } from 'rxjs';

export class StoreService {
  constructor() {}

  public static isAuthenticated$ = new BehaviorSubject(false);
  public static restoreAuthenticationTaskCompleted = new BehaviorSubject<
    boolean
  >(false);
  public static isAuthenticationCompleted = new BehaviorSubject<boolean>(false);
}

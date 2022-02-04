import { Injectable } from '@angular/core';
import 'rxjs-compat/add/operator/timeout';
import 'rxjs-compat/add/operator/map';
import { BehaviorSubject } from "rxjs";
import { Storage } from "@ionic/storage-angular";
import { StoredUser } from "../models/stored-user";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  key_token = 'auth_token';
  key_user_id = 'auth_user_id';
  key_stored_user = 'auth_stored_user';

  private _storage: Storage;

  activeStoredUser: BehaviorSubject<StoredUser> = new BehaviorSubject<StoredUser>(null);

  server: string = 'https://ggs.tv/api/v1/';

  constructor(
    public http: HttpClient,
    public storage: Storage
  ) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
    this.reload();
  }

  async reload() {
    let storedUser: StoredUser = await this._storage.get(this.key_stored_user);


    if ((this.activeStoredUser.getValue() === null) || storedUser.Token !== this.activeStoredUser.getValue().Token) {
      this.activeStoredUser.next(storedUser);
    }
  }

  async updateStoredUser(token: string, userId: number, subscribed: number, mod: number, staff: number, banned: number, points: number, wallet: number, user_package: number, boosted_posts: number) {
    localStorage.setItem("Token", token);
    localStorage.setItem('me', userId.toString());

    await this.storage.set(this.key_stored_user, {
      Token: token,
      UserID: userId,
      Subscribed: subscribed,
      Mod: mod,
      Staff: staff,
      Banned: banned,
      Points: points,
      Wallet: wallet,
      User_Package: user_package,
      Boosted_Posts: boosted_posts
    });
    this.reload();
  }

  destroy() {
    this.storage.remove(this.key_stored_user);
    localStorage.removeItem("Token")
    this.reload();
  }

  doLogin(email, password) {
    return this.http.post(this.server + "/auth/login", {
      user_email: email,
      user_password: password
    })
  }


}
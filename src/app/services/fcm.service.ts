import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
@Injectable({ providedIn: 'root' })

export class FcmService {

    constructor(private firebase: Firebase,
        private platform: Platform, private http: HttpClient) { }

    async getToken(user) {
        let token;
        let ostype;

        if (this.platform.is('android')) {
            ostype = 'android'

            token = await this.firebase.getToken();
        }

        if (this.platform.is('ios')) {
            ostype = 'ios'
            token = await this.firebase.getToken();
            await this.firebase.grantPermission();
        }

        this.saveToken(token, user, ostype);
    }

    async saveToken(token, userid, ostype) {
        if (!token) return;
        let data = {
            sessiontype: 'app', token: token, userid: userid, ostype: ostype
        };
       

        this.http.post('https://ggs.tv/savetoken.php', JSON.stringify(data)).subscribe(res => {
            console.log(res);   
        });

         
       
        }
    


   async removeToken(userid) {
        let token;
        let ostype;
        token = await this.firebase.getToken();
       if (this.platform.is('ios')) {
           ostype = 'ios'
       }
       if (this.platform.is('android')) {
           ostype = 'android'
       }
       let data = {
           sessiontype: 'app', token: token, userid: userid, action: 'delete', ostype: ostype
       };


       this.http.post('https://ggs.tv/savetoken.php', JSON.stringify(data)).subscribe(res => {
           console.log(res);
       });
}
    onNotifications() {
        return this.firebase.onNotificationOpen();
    }
}
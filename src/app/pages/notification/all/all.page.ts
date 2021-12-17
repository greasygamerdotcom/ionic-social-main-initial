import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { StoredUser } from 'src/app/models/stored-user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-all',
  templateUrl: './all.page.html',
  styleUrls: ['./all.page.scss'],
})
export class AllPage implements OnInit {
  notifications: any = [];
  activeStoredUserSubscription$;
  date: string;
  time: any = [];
  myTime: Date;
  myDate: any;
  offset: number;
  constructor(private dataService: DataService, private router: Router,
    private authService: AuthenticationService,
    private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activeStoredUserSubscription$ = this.authService.activeStoredUser.subscribe((storedUser: StoredUser) => {
      if (storedUser !== null) {
        console.log("PROFILEPAGE:ACTIVE_USER_SUB:TOKEN", storedUser.Token);
        console.log("PROFILEPAGE:ACTIVE_USER_SUB:ID", storedUser.UserID);
        this.dataService.getNotis(storedUser.UserID).subscribe(res => {
          this.notifications = res.message;
          for (let i = 0; i < this.notifications.length; i++) {
            this.offset = moment().utcOffset();

            this.notifications[i]['time'] = moment.utc(this.notifications[i]['time']).fromNow();
          }
          console.log("we see this!....", this.notifications); // <-- what do we see in this
        });
      }
    });
  }



  notification(url) {

    this.router.navigateByUrl('/' + url);
  }
}
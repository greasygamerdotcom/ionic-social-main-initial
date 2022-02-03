import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import moment from 'moment';
import { DataService } from 'src/app/services/data.service';
import { ImageModalPage } from '../image-modal/image-modal.page';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StoredUser } from 'src/app/models/stored-user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GiphyPage } from '../giphy/giphy.page';
import { OverlayEventDetail } from '@ionic/core';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
})
export class PostDetailPage implements OnInit {

  commentForm: FormGroup;
  replyForm: FormGroup;
  replyReplyForm: FormGroup;
  name = 'angular-mentions';

  liked: any;


  data: any;
  post: any;
  comments: any;
  offset: number;
  replies: any;
  activeStoredUserSubscription$;
  me: number;
  gif: any;
  reacted: any;
  items: any;
  myObj: any;
  names: String[] = [];
  commentReplies: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private profileService: ProfileService, private authService: AuthenticationService, private route: ActivatedRoute, private modalController: ModalController, private dataService: DataService, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params && params.special) {
        this.data = JSON.parse(params.special);
      }
    });
  }

  ngOnInit() {
    this.activeStoredUserSubscription$ = this.authService.activeStoredUser.subscribe((storedUser: StoredUser) => {
      this.me = storedUser.UserID;

    });



    this.dataService.getPostDetails(this.data).subscribe(res => {
      this.post = res.message;
      console.log(this.post);
      for (let i = 0; i < this.post.length; i++) {
        this.offset = moment().utcOffset();

        this.post[i]['time'] = moment.utc(this.post[i]['time']).fromNow();
      }
    });
    this.dataService.getPostComments(this.data).subscribe(res => {
      this.comments = res.message;
      this.commentReplies = res.replies;
      console.log(this.comments);
      for (let i = 0; i < this.comments.length; i++) {

        this.offset = moment().utcOffset();
        this.comments[i]['time'] = moment.utc(this.comments[i]['time']).fromNow();


      }
      for (let i = 0; i < this.commentReplies.length; i++) {

        this.offset = moment().utcOffset();
        this.commentReplies[i]['time'] = moment.utc(this.commentReplies[i]['time']).fromNow();


      }
    });

    this.profileService.fetchFriends(this.me).subscribe(res => {

      this.items = res.message;
      this.myObj = Object.values(this.items)[0];
      this.names = [this.myObj["user_name"]];
      console.log(this.names);
    });
    this.commentForm = this.fb.group({
      text: [null],
      gif: [null],

    });
    this.replyReplyForm = this.fb.group({
      text: [null],
      commentID: [null],

      gif: [null],

    });
    this.replyForm = this.fb.group({
      text: [null],
      commentID: [null],
      gif: [null],

    });
  }
  showReplies() {
    var element = document.getElementById("repliesContainer");
    element.classList.toggle("replies");
  }

  showReply(toggle, id) {
    document.getElementById(toggle).classList.toggle("showReplyForm");
    this.replyForm.get('commentID').setValue(id);

  }
  showReplyReply(toggle) {
    document.getElementById(toggle).classList.toggle("showReplyForm");

  }

  reply(text) {
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    let time = new Date(Date.now());
    let data = {
      "comment_id": text.commentID,
      "user_id": this.me,
      "comment": text,
      "time": time,
      "gif": this.gif

    };
    this.http.post('https://ggs.tv/api/v1/post.php?action=reply', JSON.stringify(data), { headers: headers }).subscribe(
      () => { // If POST is success
        window.location.reload();
      },
      (_error) => { // If POST is failed
        "Error occurred";
      }
    );

  }

  submitComment(id, user, text) {
    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    let time = new Date(Date.now());
    let data = {
      "post_id": id,
      "user_id": user,
      "comment": text,
      "time": time,
      "gif": this.gif

    };

    this.http.post('https://ggs.tv/api/v1/post.php?action=comment', JSON.stringify(data), { headers: headers }).subscribe(
      () => { // If POST is success
        window.location.reload();
      },
      (_error) => { // If POST is failed
        "Error occurred";
      }
    );

  }
  async onGif(e) {
    const modal = await this.modalController.create({
      component: GiphyPage,
      backdropDismiss: false,
      cssClass: 'modal'
    });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
        this.gif = detail.data;

        var elem = document.createElement("img");
        elem.setAttribute("src", this.gif);
        elem.setAttribute("height", "200");
        elem.setAttribute("width", "100%");
        elem.setAttribute("alt", "IMG");

        document.getElementById("text").appendChild(elem);
        document.getElementById("gifid").style.border = "thick solid lime";
        document.getElementById("imageid").style.border = "none";
        document.getElementById("videoid").style.border = "none";

        this.commentForm.patchValue({
          gif: this.gif
        });
      }
    });
    await modal.present();

  };
  async replyGif(e) {
    const modal = await this.modalController.create({
      component: GiphyPage,
      backdropDismiss: false,
      cssClass: 'modal'
    });
    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
        this.gif = detail.data;

        var elem = document.createElement("img");
        elem.setAttribute("src", this.gif);
        elem.setAttribute("height", "200");
        elem.setAttribute("width", "100%");
        elem.setAttribute("alt", "IMG");

        document.getElementById("text").appendChild(elem);
        document.getElementById("gifid").style.border = "thick solid lime";
        document.getElementById("imageid").style.border = "none";
        document.getElementById("videoid").style.border = "none";

        this.replyForm.patchValue({
          gif: this.gif
        });
      }
    });
    await modal.present();

  };
  user(id) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        special: JSON.stringify(id)
      }
    };
    this.router.navigate(['/user'], navigationExtras);

  }


  async navigateToModal(source) {
    const modal = await this.modalController.create({
      component: ImageModalPage,
      backdropDismiss: false,
      cssClass: 'modal',

      componentProps: {
        'source': source
      }
    });
    modal.present();
  }
  commentlike(id, toggle) {
    let data = {
      "comment_id": id,
      "user_id": this.me,
    };
    document.getElementById(toggle).classList.remove("unliked");
    document.getElementById(toggle).classList.add("liked");

    this.liked = "1";
    this.http.post('https://ggs.tv/api/v1/post.php?action=commentlike', JSON.stringify(data)).subscribe(res => {
    });
  }
  commentunlike(id, toggle) {
    let data = {
      "comment_id": id,
      "user_id": this.me,
    };
    document.getElementById(toggle).classList.add("unliked");
    document.getElementById(toggle).classList.remove("liked");
    this.liked = "0";
    this.http.post('https://ggs.tv/api/v1/post.php?action=commentunlike', JSON.stringify(data)).subscribe(res => {
      document.getElementById(toggle).classList.toggle("liked");

    });
  }

}

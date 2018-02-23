import { ChatPage } from './../chat/chat';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  goToChatPage(){
    this.navCtrl.push(ChatPage);
  }

}

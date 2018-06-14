import { RiveProvider } from './../../providers/rive/rive';
import { ErrorHanlderProvider } from './../../providers/error-hanlder/error-hanlder';
import { Config } from './../../constants/config';
import { LaunchNavigator } from "@ionic-native/launch-navigator";
import { SmsProvider } from "./../../providers/sms/sms";
import { LocationProvider } from "./../../providers/location/location";
import { UserProvider } from "./../../providers/user/user";
import { Bot } from "./../../controller/bot/bot";
import { RasaProvider } from "./../../providers/rasa/rasa";
import { Message } from "./../../model/messages/message";
import { Component, ViewChild, NgZone } from "@angular/core";
import { IonicPage, NavController, NavParams, Content, Events, AlertController } from "ionic-angular";
import "rxjs/add/operator/finally";
import { TextMessage } from '../../model/messages/textMessage';

@IonicPage()
@Component({
  selector: "page-chat",
  templateUrl: "chat.html"
})
export class ChatPage {
  bot: Bot;
  sentMessages: Array<Message>;
  currentMessage: string;
  processing = true;
  botName= Config.botName;

  @ViewChild(Content) content: Content;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private rasaProvider: RasaProvider,
    private userProvider: UserProvider,
    private locationProvider: LocationProvider,
    private smsProvider: SmsProvider,
    private launchNavigator: LaunchNavigator,
    private events: Events,
    private ngZone: NgZone,
    private alertController: AlertController,
    private riveProvider: RiveProvider
  ) {}

  ionViewDidLoad() {
    this.userProvider.logUserIn().subscribe(res => {
      this.sentMessages = new Array<Message>();
      this.initEvents();
      this.bot = new Bot(
        this.sentMessages,
        this.rasaProvider,
        this.content,
        this.userProvider,
        this.locationProvider,
        this.smsProvider,
        this.launchNavigator,
        this.events,
        this.alertController,
        this.riveProvider
      );
      this.bot.welcomeUser();
    });
    this.currentMessage = "";

    window.addEventListener('native.keyboardshow', ()=> this.content.scrollToBottom().then(()=> console.log("toBottom")));
  }

  sendMessage() {
    let message = new TextMessage(this.currentMessage, false);
    this.processing = true;
    this.showAndClearMessage(message);
    this.bot.readUserMessage(message);
  }

  private showAndClearMessage(message: Message) {
    this.sentMessages.push(message);
    this.currentMessage = "";
  }

  textAreaHasText() {
    return this.currentMessage == undefined || this.currentMessage.length != 0;
  }

  updateCurrentMessage(text: string){
    this.ngZone.run(()=>
    this.currentMessage = text
  )
    
  }

  goToBottomMessages(){

    this.content.scrollToBottom(100);

  }

  showMessageFromText(text: string){
    this.sentMessages.push(new TextMessage(text,true));
  }

  initEvents(){
    this.events.subscribe(Config.EventSend.SEND_BOT_MESSAGE, (text: string)=> this.showMessageFromText(text));
    this.events.subscribe(Config.EventFinishProcessing.FINISH_PROCESSING, ()=> this.processing=false);
  }

  
}

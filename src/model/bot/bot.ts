import { botFlowControllerImpl } from './botFlow/botFlowControllerImpl';
import { BotFlowController } from './botFlow/botFlowController';
import { LaunchNavigator } from "@ionic-native/launch-navigator";
import { SmsProvider } from "./../../providers/sms/sms";
import { LocationProvider } from "./../../providers/location/location";
import { UserProvider } from "./../../providers/user/user";
import { BotResources } from "./botResources";
import { RasaProvider } from "./../../providers/rasa/rasa";
import { ActionFactory } from "./actionFactory";
import { ActionResponse } from "./../../model/rasaResponse/actionResponse";
import { Message } from "./../message";
import { Config } from "./../../constants/config";
import { Content, Events } from "ionic-angular";
export class Bot{
  name = Config.botName;
  flowController: BotFlowController;

  constructor(
    messageList: Array<Message>,
    rasaProvider: RasaProvider,
    content: Content,
    userProvider: UserProvider,
    locationProvider: LocationProvider,
    smsProvider: SmsProvider,
    launchNavigator: LaunchNavigator,
    private events: Events
  ) {
    this.flowController = new botFlowControllerImpl(
      new BotResources(
        messageList,
        rasaProvider,
        content,
        userProvider,
        locationProvider,
        smsProvider,
        launchNavigator,
        events
      )
    );
  }



  readUserMessage(userMessage: Message) {
    this.flowController.processUserMessage(userMessage.content);
  }

  welcomeUser() {
    this.flowController.welcome();
  }
}

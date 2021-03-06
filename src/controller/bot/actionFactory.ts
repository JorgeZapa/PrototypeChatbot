import { ChangeLocationAction } from './botActions/changeLocationAction';
import { BotFlowController } from './botFlow/botFlowController';
import { NoNameAction } from "./botActions/noNameAction";
import { NoNumberAction } from "./botActions/noNumberAction";
import { GoHomeAction } from "./botActions/goHomeAction";
import { DistanceAction } from "./botActions/distanceAction";
import { LostAction } from "./botActions/lostAction";
import { GiveLocationAction } from "./botActions/giveLocationAction";
import { BotAction } from "./botActions/botAction";
import { ListenAction } from "./botActions/listenAction";
import { GiveNumberAction } from "./botActions/giveNumberAction";
import { BotResources } from "./botResources";
import { GreetAction } from "./botActions/greetAction";
import { Config } from "./../../constants/config";
import { ActionResponse } from "./../rasaResponse/actionResponse";
import { GiveNameAction } from "./botActions/giveNameAction";
import { WrongAction } from "./botActions/wrongAction";
import { ConverseAction } from './botActions/converseAction';
import {Tracker} from "../rasaResponse/actionResponse"
export class ActionFactory {
  static createActionFromResponse(
    actionResponse: ActionResponse,
    botResources: BotResources,
    botFlowController: BotFlowController
  ): BotAction {
    console.log(actionResponse);
     return this.createActionFromName(actionResponse.next_action, botResources,botFlowController ,actionResponse.tracker);
  }

   static createActionFromName(actionName: string, botResources: BotResources, botFlowController: BotFlowController, tracker : Tracker): BotAction{
    switch (actionName) {
      case Config.rasaSupportedActions.greet:
        return new GreetAction(botResources, botFlowController);
      case Config.rasaSupportedActions.give_name:
        return new GiveNameAction(
          botResources, botFlowController,tracker.slots.PERSON);
      case Config.rasaSupportedActions.no_name:
        return new NoNameAction(botResources, botFlowController);
      case Config.rasaSupportedActions.give_number:
        return new GiveNumberAction(
          botResources, botFlowController,tracker.slots.number);
      case Config.rasaSupportedActions.no_number:
        return new NoNumberAction(botResources, botFlowController);
      case Config.rasaSupportedActions.location:
        return new GiveLocationAction(botResources, botFlowController);
      case Config.rasaSupportedActions.lost:
        return new LostAction(botResources, botFlowController);
      case Config.rasaSupportedActions.distance:
        return new DistanceAction(botResources, botFlowController);
      case Config.rasaSupportedActions.go_home:
        return new GoHomeAction(botResources, botFlowController);
      case Config.builtInActions.wrong:
          return new WrongAction(botResources, botFlowController);
      case Config.rasaSupportedActions.listen:
        return new ListenAction(botResources, botFlowController);
      case Config.rasaSupportedActions.change_location:
        return new ChangeLocationAction(botResources, botFlowController);
      case Config.builtInActions.converse:
          return new ConverseAction(botResources, botFlowController, tracker.latest_message.text);
    }
  }
}

import { BotFlowController } from './../botFlow/botFlowController';
import { RasaEvent } from "./../../rasaPetition/rasaEvent";
import { BotResources } from "./../botResources";
import { BaseBotAction } from "./baseBotAction";
import { Config } from "../../../constants/config";
export class NoNameAction extends BaseBotAction {
  constructor(botResources: BotResources, botFlowController: BotFlowController) {
    super(botResources, botFlowController);
  }

  execute(): RasaEvent {
    super.sendBotMessage("I didn't understand your name...");
    super.sendBotMessage("Can you repeat it again?");
    return null;
  }
  getRasaEncodingName(): string {
    return Config.rasaSupportedActions.no_name;
  }
}

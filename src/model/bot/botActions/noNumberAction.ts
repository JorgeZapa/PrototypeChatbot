import { BotFlowController } from './../botFlow/botFlowController';
import { BotResources } from "./../botResources";
import { BaseBotAction } from "./baseBotAction";
import { Config } from "../../../constants/config";
import { RasaEvent } from '../../rasaPetition/Events/rasaEvent';

export class NoNumberAction extends BaseBotAction {
  constructor(botResources: BotResources, botFlowController: BotFlowController) {
    super(botResources, botFlowController);
  }

  execute(): RasaEvent {
    super.sendBotMessage("I can't get your number...");
    super.sendBotMessage("Can you repeat it again?");
    super.notifyFinished();
    return null;
  }
  getRasaEncodingName(): string {
    return Config.rasaSupportedActions.no_number;
  }
}

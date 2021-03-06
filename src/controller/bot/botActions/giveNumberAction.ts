import { RasaRestartSlotsEvent } from './../../rasaPetition/Events/rasaRestartSlotsEvent';
import { BotFlowController } from './../botFlow/botFlowController';
import { BotResources } from './../botResources';
import { BaseBotAction } from "./baseBotAction";
import { Config } from '../../../constants/config';


export class GiveNumberAction extends BaseBotAction {

    private phoneNumber: number;

    constructor(botResources: BotResources, botFlowController: BotFlowController, phoneNumber: number){
        super(botResources, botFlowController);
        this.phoneNumber=phoneNumber;
    }

    getRasaEncodingName(): string {
        return Config.rasaSupportedActions.give_number;
    }
    execute() {
        super.sendTextBotMessage("Ok, i registered your SOS number!");
        this.botResources.getUserProvider().getCurrentUser().sosNumber=this.phoneNumber;
        this.botResources.getUserProvider().updateUser().finally(()=> this.notifyFinished()).subscribe(ok=>{},error=>{
            super.sendTextBotMessage("I couldn't save your data, when you come back i might not remember you...");
        });
        return new RasaRestartSlotsEvent();
    }
}
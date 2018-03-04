import { RasaEvent } from './../../rasaPetition/rasaEvent';
import { GreetAction } from './../botActions/greetAction';
import { BotResources } from './../botResources';
import { WrongAction } from './../botActions/wrongAction';
import { ListenAction } from './../botActions/listenAction';
import { ActionFactory } from './../actionFactory';
import { RasaProvider } from './../../../providers/rasa/rasa';
import { BotAction } from './../botActions/botAction';
import { BotState } from './botState';
import { ActionResponse } from '../../rasaResponse/actionResponse';
export class DefaultBotState implements BotState {

    action: BotAction;
    initialAction: BotAction;
    botResources:BotResources;

    constructor(botResources: BotResources){
        this.botResources = botResources;
    }

    welcome(){
        this.action = new GreetAction(this.botResources);
        let rEvent = this.action.execute();
        this.takeNextAction(this.action,rEvent);
    }

    processUserMessage(message: string) {
        
        this.botResources.getRasaProvider().parse(message).subscribe(res=>{
            this.action = ActionFactory.createActionFromResponse(res,this.botResources);

            if(this.action instanceof ListenAction){
                //If twice ListenAction -> we didn't understand
                new WrongAction(this.botResources).execute();
                return;
            }
            let rEvent = this.action.execute();
            
           this.takeNextAction(this.action, rEvent);

        });
    }

    takeNextAction(lastExecutedAction: BotAction, rEvent: RasaEvent){
        this.botResources.getRasaProvider().continue(lastExecutedAction.getRasaEncodingName(), rEvent).subscribe(res=>{
            this.recursiveProcessAction(res);
        })
    }

    recursiveProcessAction(actResponse: ActionResponse){
        this.action = ActionFactory.createActionFromResponse(actResponse, this.botResources);
        if(this.action instanceof ListenAction){
            return;
        }
        let rEvent = this.action.execute();
        this.botResources.getRasaProvider().continue(this.action.getRasaEncodingName(), rEvent).subscribe(res=>{
            this.recursiveProcessAction(res);
        }
        )
    }
}
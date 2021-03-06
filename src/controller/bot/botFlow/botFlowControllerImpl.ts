import { RasaRestartEvent } from './../../rasaPetition/Events/rasaRestartEvent';
import { RasaEvent } from './../../rasaPetition/Events/rasaEvent';
import { DefaultFlowConfig } from './botFlowConfig/defaultFlowConfig';
import { BotFlowConfig } from './botFlowConfig/botFlowConfig';
import { ListenAction } from './../botActions/listenAction';
import { BotAction } from './../botActions/botAction';
import { BotResources } from '../botResources';
import { Config } from '../../../constants/config';
import { ActionResponse } from '../../rasaResponse/actionResponse';
import { ActionFactory } from '../actionFactory';
import { BotFlowController } from './botFlowController';

export class botFlowControllerImpl implements BotFlowController {
  action: BotAction;
  previousAction: BotAction;
  botResources: BotResources;
  botFlowConfig: BotFlowConfig = new DefaultFlowConfig();


  setBotFlowConfig(botFlowConfig: BotFlowConfig) {
    this.botFlowConfig = botFlowConfig;
  }
  getBotFlowConfig(): BotFlowConfig {
    return this.botFlowConfig;
  }

  constructor(botResources: BotResources) {
    this.botResources = botResources;
  }

  private changeAction(action: BotAction){
    this.previousAction = this.action;
    this.action = action;
  }

  welcome() {
    this.botResources
      .getRasaProvider()
      .continue(
        Config.rasaSupportedActions.distance,
        new RasaRestartEvent()
      )
      .subscribe(res => {
        this.changeAction(ActionFactory.createActionFromName(Config.rasaSupportedActions.greet ,this.botResources, this,null))
        let rEvent = this.action.execute();
        this.takeNextAction(this.action, rEvent);
      });
  }

  processUserUtterance(utterance: string) {

    let rEventBeforeParse = this.action.doBeforeParsing(utterance, this.previousAction);

    if(rEventBeforeParse!=null){
      this.botResources.getRasaProvider().sendSetSlotsEvent(rEventBeforeParse).subscribe()
      utterance = "My name is a<afxawer>a";
    }

    this.botResources
      .getRasaProvider()
      .parse(utterance)
      .subscribe(
        res => {
          this.changeAction(ActionFactory.createActionFromResponse(
            res,
            this.botResources,
            this
          ));

          if(!this.checkActionAllowed(this.action) ||
            !this.checkIntentConfidence(res)){
            let converstationAction= ActionFactory.createActionFromName(Config.builtInActions.converse, this.botResources, this, res.tracker);
            if(this.checkActionAllowed(converstationAction)){
              converstationAction.execute();
              return;
            }
            

          if (!this.checkActionAllowed(this.action)) {
            //If the action is not allowed -> we didn't understand
            if(this.checkActionAllowed)

            ActionFactory.createActionFromName(Config.builtInActions.wrong, this.botResources, this, null).execute();
            return;
          }
          
          }

          let rEvent = this.action.execute();

          this.takeNextAction(this.action, rEvent);
        },
        error =>
          this.botResources
            .getEvents()
            .publish(Config.EventErrors.NO_CONNECTION, "BZZZ, NO CONECTION")
      );
  }

  private checkActionAllowed(action: BotAction) {
    return (this.botFlowConfig.getAllowedActions().indexOf(action.getRasaEncodingName()) !=-1 
      ||  this.botFlowConfig.getAllowedActions().indexOf("*") != -1);
  }

  private checkIntentConfidence(actionResponse: ActionResponse){
    if(Config.confidenceThreshold[actionResponse.tracker.latest_message.intent.name]){
      return Config.confidenceThreshold[actionResponse.tracker.latest_message.intent.name]<actionResponse.tracker.latest_message.intent.confidence
    }
    return false
  }

  private takeNextAction(lastExecutedAction: BotAction, rEvent: RasaEvent) {
    this.botResources
      .getRasaProvider()
      .continue(lastExecutedAction.getRasaEncodingName(), rEvent)
      .subscribe(
        res => {
          this.recursiveProcessAction(res);
        },
        error =>
          this.botResources
            .getEvents()
            .publish(Config.EventErrors.NO_CONNECTION, "BZZZ, NO CONNECTION")
      );
  }

  private recursiveProcessAction(actResponse: ActionResponse) {
    this.changeAction(ActionFactory.createActionFromResponse(
      actResponse,
      this.botResources,
      this
    ));
    if (this.action instanceof ListenAction || this.action==null) {
      return;
    }
    let rEvent = this.action.execute();
    this.botResources
      .getRasaProvider()
      .continue(this.action.getRasaEncodingName(), rEvent)
      .subscribe(
        res => {
          this.recursiveProcessAction(res);
        },
        error =>
          this.botResources
            .getEvents()
            .publish(Config.EventErrors.NO_CONNECTION, "BZZZZ, NO CONNECTION")
      );
  }
}

import { InfoModalComponent } from './../components/info-modal/info-modal';
import { NoConnectionModalComponent } from './../components/no-connection-modal/no-connection-modal';
import { TimeoutInterceptor } from './../interceptors/timeoutInterceptor';
import { SpeechButtonComponent } from './../components/speech-button/speech-button';
import { MessageWrapperComponent } from './../components/message-wrapper/message-wrapper';
import { ChatPage } from './../pages/chat/chat';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {IonicStorageModule} from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation'
import { SMS } from '@ionic-native/sms';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import { MyApp } from './app.component';
import { RasaProvider } from '../providers/rasa/rasa';
import { EndpointsProvider } from '../providers/endpoints/endpoints';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserProvider } from '../providers/user/user';
import { LocalDataProvider } from '../providers/local-data/local-data';
import { LocationProvider } from '../providers/location/location';
import { SmsProvider } from '../providers/sms/sms';
import { LongPressModule } from 'ionic-long-press';
import { ErrorHanlderProvider } from '../providers/error-hanlder/error-hanlder';
import { RiveProvider } from '../providers/rive/rive';
import { SpeechModalComponent } from '../components/speech-modal/speech-modal';
@NgModule({
  declarations: [
    MyApp,
    ChatPage, 
    MessageWrapperComponent,
    SpeechButtonComponent,
    NoConnectionModalComponent,
    SpeechModalComponent,
    InfoModalComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['websql', 'sqlite', 'indexeddb']
      }),
    HttpClientModule,
    LongPressModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ChatPage,
    NoConnectionModalComponent,
    SpeechModalComponent,
    InfoModalComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RasaProvider,
    EndpointsProvider,
    UserProvider,
    LocalDataProvider,
    LocationProvider,
    Geolocation,
    SMS,
    SmsProvider,
    LaunchNavigator,
    SpeechRecognition,
    TextToSpeech,
    UniqueDeviceID,
    ErrorHanlderProvider,{
      provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true 
    },
    RiveProvider
  ]
})
export class AppModule {}
import { AppServerInterface, AppServer } from './server/appServer';

const appServer: AppServerInterface = new AppServer();
appServer.start();

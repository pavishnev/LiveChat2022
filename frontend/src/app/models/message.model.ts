export class MessageModel {
  sessionId: string = "";
  text: string = "";
  isSentByClient: boolean = false;
  timestamp: Date = new Date();
}

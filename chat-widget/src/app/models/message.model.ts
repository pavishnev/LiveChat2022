export class MessageModel {
  sessionId: string = "";
  text: string = "";
  isSentByClient: boolean = true;
  timestamp: Date = new Date();
}

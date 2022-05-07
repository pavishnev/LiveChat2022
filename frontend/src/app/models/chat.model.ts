
import { ClientModel } from "./client.model";
import {MessageModel} from "./message.model";

export class ChatModel {
  messages: MessageModel[] = [];
  user: ClientModel = { name:"", websiteId:"", id:""};

  constructor() {
  }
}

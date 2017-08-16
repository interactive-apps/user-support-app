export interface MessageConversation {
  id: number;
  attributeValues: any[];
  created: string;
  displayName: string;
  externalAccess: boolean;
  followUp: boolean;
  lastMessage: string;
  lastSender: any;
  lastSenderFirstname: string;
  lastSenderSurname: string;
  lastUpdated: string;
  messageCount: number;
  messageType: string;
  messages:any[];
  name: string;
  priority: string;
  read: boolean;
  status: string;
  subject: string;
  translations: string;
  user: any;
  userAccesses: any[];
  userFirstname: string;
  userGroupAccesses: any[];
  userMessages: any[];
  userSurname: string;
}

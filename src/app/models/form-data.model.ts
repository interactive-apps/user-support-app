import { User } from './user.model';
import { Message } from './message.model';
import { DataSet } from './dataset-forms.model';

export class FormData {
  actionType: string = 'nill';
  user: User[] = [];
  message: Message;
  dataSet: DataSet;

  clear() {
    this.actionType = '';
    this.user = [];
  }
}

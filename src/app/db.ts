import { DBSchema } from '@ngrx/db';

/**
 * ngrx/db uses a simple schema config object to initialize stores in IndexedDB.
 */
export const schema: DBSchema = {
  version: 1,
  name: 'user_support_app',
  stores: {
    messageConversation: {
      autoIncrement: true,
      primaryKey: 'id',
    },
    messages: {
      autoIncrement: true,
      primaryKey: 'id',
    }
  },
}

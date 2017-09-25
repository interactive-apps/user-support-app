export class User {
  id: String;
  firstName: string = '';
  surname: string = '';
  email: string = '';
  organisationUnits: any = [];
  phoneNumber: string;
  userCredentials: {
    id: string;
    username: string;
    password: string;
    userRoles: any;
    userInfo: {
      id:string;
    }
  };
  userGroups: String[];

}

export class User {
  id: String;
  firstName: string = '';
  surname: string = '';
  email: string = '';
  organisationUnits: any = [];
  phoneNumber: string;
  userCredentials: {
    username: string;
    password: string;
    userRoles: any;
  };
  userGroups: String[];

}

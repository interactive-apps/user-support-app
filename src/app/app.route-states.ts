import { ActionComponent } from './pages/home/action/action.component';
import { CreateUsersComponent } from './pages/create-users/create-users.component';
import { AddFormComponent } from './pages/add-form/add-form.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

export const appStates = [
  { name: '/', url: '/', component: ActionComponent },
  { name: 'create-users', url: '/create-users', component: CreateUsersComponent},
  { name: 'reset-password', url: '/reset-password', component: ResetPasswordComponent},
  { name: 'add-form', url: '/add-form', component: AddFormComponent}
];

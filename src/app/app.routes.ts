import { ActionComponent } from './pages/home/action/action.component';
import { CreateUsersComponent } from './pages/create-users/create-users.component';
import { AddFormComponent } from './pages/add-form/add-form.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { Routes, RouterModule, PreloadAllModules} from '@angular/router';

export const ROUTES: Routes = [
  { path: '', component: ActionComponent },
  { path: 'add-form', component: AddFormComponent },
  { path: 'create-users', component: CreateUsersComponent},
  { path: 'reset-password', component: ResetPasswordComponent}
];

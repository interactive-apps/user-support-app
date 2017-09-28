import { CreateUsersComponent } from './components/create-users/create-users.component';
import { HomeComponent } from './pages/home/home.component';
import { AddFormComponent } from './components/add-form/add-form.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { Routes, RouterModule, PreloadAllModules} from '@angular/router';
import { NgModule } from '@angular/core';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'add-form', component: AddFormComponent },
  { path: 'create-users', component: CreateUsersComponent},
  { path: 'reset-password', component: ResetPasswordComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(ROUTES, {useHash: true, preloadingStrategy: PreloadAllModules })],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

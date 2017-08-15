import { HomeComponent } from './home/home.component';
import { ActionComponent } from './home/action/action.component';
import { OrgUnitsComponent } from './home/org-units/org-units.component';
import { DataSetsComponent } from './home/data-sets/data-sets.component';
import { ResultsComponent } from './home/results/results.component';
import { UserService } from './services/user.service';
import { MessagesComponent } from './home/messages/messages.component';

export const appStates = [
  { name: 'home', url: '/home', component: HomeComponent},
  { name: 'home.action', url: '/action', component: ActionComponent },
  { name: 'home.data-sets', url: '/data-sets', component: DataSetsComponent },
  { name: 'home.org-units', url: '/org-units', component: OrgUnitsComponent },
  { name: 'home.results', url: '/results', component: ResultsComponent },
];

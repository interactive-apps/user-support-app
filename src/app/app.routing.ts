import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { UIRouterModule } from "@uirouter/angular";
import { Routes, RouterModule, PreloadAllModules} from '@angular/router';


import { HomeComponent } from './home/home.component';
import { ActionComponent } from './home/action/action.component';
import { OrgUnitsComponent } from './home/org-units/org-units.component';
import { DataSetsComponent } from './home/data-sets/data-sets.component';
import { ResultsComponent } from './home/results/results.component';

import { UIRouterConfigFn }   from "./app.router";



const appStates = [
  { name: 'home', url: '', component: HomeComponent },
  { name: 'home.action', url: '/action', component: ActionComponent },
  { name: 'home.data-sets', url: '/data-sets', component: DataSetsComponent },
  { name: 'home.org-units', url: '/org-units', component: OrgUnitsComponent },
  { name: 'home.results', url: '/results', component: ResultsComponent },
];


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    UIRouterModule.forRoot({
      states: appStates,
      useHash: true,
      config: UIRouterConfigFn
    })
  ],
  declarations: [],
  providers: [Location, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  exports: [
    UIRouterModule
  ]
})
export class AppRoutingModule { }

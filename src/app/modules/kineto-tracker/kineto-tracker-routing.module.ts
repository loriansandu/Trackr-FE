import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {KinetoTrackerComponent} from "./kineto-tracker/kineto-tracker.component";

const routes: Routes = [
  {
    path: '',
    component: KinetoTrackerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KinetoTrackerRoutingModule { }

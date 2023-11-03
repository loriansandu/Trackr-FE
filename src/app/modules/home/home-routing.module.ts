import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "../auth/login/login.component";
import {ProfileComponent} from "./profile/profile.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'kineto', loadChildren: () => import('./../kineto-tracker/kineto-tracker.module').then(m => m.KinetoTrackerModule) },
      {
        path: 'account',
        component: ProfileComponent
      },
      { path: 'vehicle', loadChildren: () => import('./../vehicle/vehicle.module').then(m => m.VehicleModule) },
      { path: 'gym', loadChildren: () => import('./../gym/gym.module').then(m => m.GymModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

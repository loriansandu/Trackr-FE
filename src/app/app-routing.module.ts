import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {authGuard} from "./core/guards/auth.guard";
import {NotFoundComponent} from "./modules/home/not-found/not-found.component";
import {isSignedInGuard} from "./core/guards/signedIn.guard";

const routes: Routes = [
  {
    canActivate: [isSignedInGuard],
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule,),
  },
  {
    // canActivate: [authGuard],
    path: '',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: '**',
    component: NotFoundComponent
  },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import {SidebarModule} from "primeng/sidebar";
import {ButtonModule} from "primeng/button";
import { SidebarComponent } from './sidebar/sidebar.component';

import {RouterLink, RouterLinkActive} from "@angular/router";



@NgModule({
  declarations: [
    MenuComponent,
    SidebarComponent,
  ],
  exports: [
    MenuComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule,
    RouterLink,
    RouterLinkActive
  ]
})
export class SharedModule { }

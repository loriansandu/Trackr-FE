import {Component, ElementRef, OnInit} from '@angular/core';
import {LayoutService} from "../../../services/layout/layout.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{
  model: any[] = [];

  constructor(public layoutService: LayoutService, public el: ElementRef) { }

  ngOnInit() {
    this.model = [
      // {
      //   label: 'Home',
      //   icon: 'pi pi-home',
      //   routerLink: ['']
      // },
      {
        label: 'Kineto',
        icon: 'fa-solid fa-person-running',
        routerLink: ['/kineto']
      },
      // {
      //   label: 'Vehicle',
      //   icon: 'pi pi-car',
      //   routerLink: ['/vehicle']
      // },
      // {
      //   label: 'Gym',
      //   icon: 'fa fa-dumbbell',
      //   routerLink: ['/gym']
      // }
    ];
  }
}

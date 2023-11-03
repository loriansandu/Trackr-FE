import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {LayoutService} from "../../../services/layout/layout.service";
import {MenuItem} from "primeng/api";
import {AuthService} from "../../../services/auth/auth.service";


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  constructor(public layoutService: LayoutService,
              private authService : AuthService,
  ) { }
  sidebarVisible: boolean = false;
  items!: MenuItem[];
  @Input() title! : string ;
  @Input() activatedRoute! : string ;
  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  logout() {
    this.authService.logout();

  }

  toggleMenu() {

  }
}

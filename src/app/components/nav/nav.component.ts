import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  showMenu: boolean = false;
  loggedIn: boolean = false;
  atHome: boolean = true;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.subscribe((val) => {
      if(val instanceof NavigationStart) {
        this.atHome = val.url == '/home' 
      }
    });
   }

  ngOnInit(): void {
    this.checkRouterLink();
    this.loggedIn = this.isLoggedIn();
    this.authService.loginNotification.subscribe(()=>{
      this.loggedIn = true;
    })
    this.authService.logoutNotification.subscribe(()=>{
      this.logout();
    })
  }

  logout() {
    localStorage.clear();
    this.loggedIn = false;
    this.router.navigate(['/home']);
  }

  isLoggedIn() {
    let jwt = localStorage.getItem("jwt");
    let userId = localStorage.getItem('userId');
    if (jwt != null && userId) {
      let validJwt = false;
      this.authService.authUser({ jwt: jwt, userId: userId }).subscribe({
        next: (response) => {
          if (response.status == 200) {
            validJwt = true;
            this.authService.loginNotification.emit();
          } else {
            this.authService.logoutNotification.emit();
          }
        },
        error: () => {
          this.authService.logoutNotification.emit();
        }
      });
      return validJwt;
    } else {
      return false;
    }
  }

  checkRouterLink() {
    if (this.router.url == '/home' || this.router.url == '/create-post') {
      return true;
    }
    return false;

  }
}

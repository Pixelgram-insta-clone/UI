import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  showPopup: boolean = false;

  @Input() user!: User;
  currentUser!: string | null;

  ngOnInit(): void {
    this.currentUser = localStorage.getItem("userId");
  }

  toggleDelete($event: any){

    if($event.type == "mouseenter") {
      this.showPopup = true;
    } else {
      this.showPopup = false;
    }
  }
}

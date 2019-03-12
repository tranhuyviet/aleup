import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/auth/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private authService: AuthService,
    public alertController: AlertController,
  ) { }
  ngOnInit() {}
  onLogout() {
    this.authService.logout();
  }
  async exitConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm Exit',
      message: 'Are you sure you want to exit?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.onLogout();
          }
        }
      ]
    });

    await alert.present();
  }

}

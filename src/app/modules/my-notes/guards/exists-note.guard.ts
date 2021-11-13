import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { MyNotesService } from 'src/app/shared/services/my-notes.service';

@Injectable()

export class ExistsNoteGuard implements CanActivate {
  constructor(
    private myNotesService: MyNotesService,
    private navCtrl: NavController) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const note = this.myNotesService.get(route.params.id);
    if (!note) {
      this.navCtrl.back();
      return false;
    } else {
      return true;
    }
  }
}

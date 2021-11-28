import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { createAnimation } from '@ionic/angular';
import { ConfigService } from 'src/app/core/services/config.service';
import { StaticUtilsService } from 'src/app/core/services/static-utils.service';
import { HEADER_HEIGHT } from '../../constants/header-px';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  get isDarkMode() {
    return this.config.isDarkMode;
  }
  @Input() template: TemplateRef<any>;
  @Output() closeEv = new EventEmitter();

  id = StaticUtilsService.getRandomId();
  constructor(private config: ConfigService) { }

  ngOnInit() {
    setTimeout(() => {
      this.show();
    });
  }

  onHide(ev?: Event) {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    this.hide();
  }

  private show() {
    createAnimation()
      .addElement(document.querySelector(`.modal-${this.id}`))
      .duration(350)
      .fromTo('opacity', '0', '1')
      .beforeStyles({ opacity: '0', 'z-index': 5 })
      .play()
      .then(() => {
        createAnimation()
          .addElement(document.querySelector(`.modal-${this.id} .modal__content`))
          .duration(500)
          .fromTo('top', '-100%', '0%')
          .play();
      });
  }

  private hide() {
    createAnimation()
      .addElement(document.querySelector(`.modal-${this.id} .modal__content`))
      .duration(500)
      .fromTo('margin-top', `${HEADER_HEIGHT}px`, '0px')
      .fromTo('top', '0%', '-100%')
      .play()
      .then(() => {
        createAnimation()
          .addElement(document.querySelector(`.modal-${this.id}`))
          .duration(350)
          .fromTo('opacity', '', '0')
          .afterStyles({'z-index': -1})
          .play()
          .then(() => {
            this.closeEv.emit();
          });
      });
  }

}

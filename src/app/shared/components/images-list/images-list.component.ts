import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-images-list',
  templateUrl: './images-list.component.html',
  styleUrls: ['./images-list.component.scss'],
})
export class ImagesListComponent implements OnInit {
  @Input() images = [];
  @Output() openImageEv = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {}

  onOpenImage(image) {
    this.openImageEv.emit(image);
  }

}

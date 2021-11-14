/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { MyNote } from '../models/my-note';
import { UtilsService } from './utils.service';

const CONFIG_KEY = 'my-notes';
@Injectable({
  providedIn: 'root'
})
export class MyNotesService {
  get myNotes(): MyNote[] {
    return UtilsService.copyDeep(this._myNotes) || [];
  }
  myNotes$: Observable<MyNote[]>;
  private _myNotes: MyNote[];
  private myNotesSubject = new BehaviorSubject<MyNote[]>([]);

  constructor(private storage: Storage) {
    this.myNotes$ = this.myNotesSubject.asObservable();
  }

  getActived(color?) {
    return this.myNotes.filter(note => !note.archived && (color ? note.color === color : true));
  }

  getArchived(color?) {
    return this.myNotes.filter(note => note.archived && (color ? note.color === color : true));
  }

  get(id): MyNote {
    return this.myNotes.find(elem => elem.id === id);
  }

  save(data: MyNote | MyNote[]): Promise<MyNote[]> {
    const currentNotes = this.myNotes;
    let currentData: MyNote[] = [];
    if (Array.isArray(data)) {
      currentData = data;
    } else {
      currentData = [data];
    }
    currentData.forEach(note => {
      this.addOrModifyNote(currentNotes, note);
    });
    return this.setInStorage(currentNotes);
  }

  deleteImage(id, image) {
    const note = this.get(id);
    if (!note.images) {
      return new Promise((resolve, reject) => reject(null));
    }
    const index = note.images?.findIndex(img => img === image);
    note.images = note.images.filter((img, i) => i !== index);
    return this.save(note);
  }

  switch(data: MyNote, ascendant: boolean, color?): Promise<MyNote[]> {
    const myNotesActived = this.getActived(color);
    let idNoteSwitch;
    const currentIndexNoteSelected = myNotesActived.findIndex(elem => elem.id === data.id);
    const indexNoteToSwitch = ascendant ? currentIndexNoteSelected - 1 : currentIndexNoteSelected + 1;
    if (indexNoteToSwitch > -1 && indexNoteToSwitch < myNotesActived.length) {
      idNoteSwitch = myNotesActived[indexNoteToSwitch].id;
    }
    if (!idNoteSwitch) {
      return new Promise(resolve => resolve(null));
    }
    const index1 = this.myNotes.findIndex(elem => elem.id === data.id);
    const index2 = this.myNotes.findIndex(elem => elem.id === idNoteSwitch);
    const myNoteSwitch1 = this.myNotes[index1];
    const myNoteSwitch2 = this.myNotes[index2];
    const currentNotes = this.myNotes;
    currentNotes[index1] = myNoteSwitch2;
    currentNotes[index2] = myNoteSwitch1;
    return this.setInStorage(currentNotes);
  }

  archive(data: MyNote | MyNote[]): Promise<MyNote[]> {
    let currentIds: string[] = [];
    if (Array.isArray(data)) {
      currentIds = data.map(d => d.id);
    } else {
      currentIds = [data.id];
    }
    const currentNotes = this.myNotes.map(note => (currentIds.includes(note.id) ? {...note, archived: true} : note));
    return this.setInStorage(currentNotes);
  }

  unarchive(data: MyNote | MyNote[]): Promise<MyNote[]> {
    let currentIds: string[] = [];
    if (Array.isArray(data)) {
      currentIds = data.map(d => d.id);
    } else {
      currentIds = [data.id];
    }
    const currentNotes = this.myNotes.map(note => (currentIds.includes(note.id) ? {...note, archived: false} : note));
    return this.setInStorage(currentNotes);
  }

  delete(data: MyNote | MyNote[]): Promise<MyNote[]> {
    let deleteIds = [];
    if (Array.isArray(data)) {
      deleteIds = data.map(note => note.id);
    } else {
      deleteIds = [data.id];
    }
    const myNotesDel = this.myNotes.filter(elem => !deleteIds.includes(elem.id));
    return this.setInStorage(myNotesDel);
  }

  load(): Promise<MyNote[]> {
    return this.storage
      .get(CONFIG_KEY)
      .then(resp => {
        this._myNotes = UtilsService.copyDeep(resp) || [];
        this.myNotesSubject.next(this.myNotes);
        return this.myNotes;
      })
      .catch(_ => null);
  }

  private addOrModifyNote(currentNotes: MyNote[], data: MyNote) {
    const externalData = {
      id: data.id,
      color: data.color,
      title: data.title,
      content: data.content,
      images: data.images
    };
    if (data.id) {
      this.modifyNote(currentNotes, externalData);
    } else {
      this.createNote(currentNotes, externalData);
    }
  }

  private modifyNote(currentNotes: MyNote[], externalData: MyNote) {
    const index = currentNotes.findIndex(elem => elem.id === externalData.id);
    const myNote: MyNote = {
      ...externalData,
      createdDate: this.get(externalData.id).createdDate,
      modifiedDate: new Date().toISOString()
    };
    currentNotes[index] = UtilsService.copyDeep(myNote);
  }

  private createNote(currentNotes: MyNote[], externalData: MyNote) {
    const randomId = Math.random()
      .toString()
      .replace('.', '');
    const myNote: MyNote = {
      ...externalData,
      id: randomId,
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString()
    };
    currentNotes.unshift(myNote);
  }

  private setInStorage(data: MyNote[]): Promise<MyNote[]> {
    return this.storage
      .set(CONFIG_KEY, data)
      .then(resp => {
        this._myNotes = UtilsService.copyDeep(resp);
        this.myNotesSubject.next(this.myNotes);
        return this.myNotes;
      })
      .catch(() => null);
  }
}

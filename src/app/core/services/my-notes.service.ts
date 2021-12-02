/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { NoteTypes } from 'src/app/shared/constants/note-types';
import { MyNote } from '../../shared/models/my-note';
import { StaticUtilsService } from './static-utils.service';

const CONFIG_KEY = 'my-notes-mmg-notes';
@Injectable({
  providedIn: 'root'
})
export class MyNotesService {
  get myNotes(): MyNote[] {
    return StaticUtilsService.copyDeep(this._myNotes.sort((a, b) => b.position - a.position)) || [];
  }
  myNotes$: Observable<MyNote[]>;

  private _myNotes: MyNote[];
  private myNotesSubject = new BehaviorSubject<MyNote[]>([]);
  private get lastPosition() {
    return this.myNotes.reduce((response: number, note) => (response > note.position ? response : note.position), 0);
  }
  constructor(private storage: Storage) {
    this.myNotes$ = this.myNotesSubject.asObservable();
  }



  getActived(themeId?) {
    return this.myNotes.filter(note => !note.archived && (themeId ? note.themeId === themeId : true))
          .sort((a, b) => b.position - a.position);
  }

  getArchived(themeId?) {
    return this.myNotes.filter(note => note.archived && (themeId ? note.themeId === themeId : true))
                        .sort((a, b) => b.position - a.position);
  }

  get(id): MyNote {
    return this.myNotes.find(elem => elem.id === id);
  }

  create(data: MyNote): Promise<string> {
    const currentNotes = this.myNotes;
    const id = this.createNote(currentNotes, data);
    return this.setInStorage(currentNotes).then(
      () => id
    );
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
      this.modifyNote(currentNotes, note);
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

  switch(position1: number, position2: number): Promise<MyNote[]> {
    const index1 = this.myNotes.findIndex(elem => elem.position === position1);
    const index2 = this.myNotes.findIndex(elem => elem.position === position2);
    const currentNotes = this.myNotes;
    currentNotes[index1].position = position2;
    currentNotes[index2].position = position1;
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
        this._myNotes = StaticUtilsService.copyDeep(resp) || [];
        this.myNotesSubject.next(this.myNotes);
        if (this.myNotes.some(note => note.position === undefined)) {
          const notes = this.myNotes.map((note, i) =>({...note, position: i}));
          this.save(notes);
        }
        return this.myNotes;
      })
      .catch(_ => null);
  }

  private modifyNote(currentNotes: MyNote[], data: MyNote) {
    const noteData = this.prepareNoteData(data);
    const index = currentNotes.findIndex(elem => elem.id === noteData.id);
    const myNote: MyNote = {
      ...noteData,
      createdDate: this.get(noteData.id).createdDate,
      modifiedDate: new Date().toISOString()
    };
    currentNotes[index] = StaticUtilsService.copyDeep(myNote);
  }

  private createNote(currentNotes: MyNote[], data: MyNote) {
    const noteData = this.prepareNoteData(data);
    const randomId = StaticUtilsService.getRandomId();
    const myNote: MyNote = {
      ...noteData,
      id: randomId,
      position: this.lastPosition + 1,
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString()
    };
    currentNotes.push(myNote);
    return myNote.id;
  }

  private setInStorage(data: MyNote[]): Promise<MyNote[]> {
    return this.storage
      .set(CONFIG_KEY, data)
      .then(resp => {
        this._myNotes = StaticUtilsService.copyDeep(resp);
        this.myNotesSubject.next(this.myNotes);
        return this.myNotes;
      })
      .catch(() => null);
  }

  private prepareNoteData(data) {
    let externalData = {
      id: data.id,
      themeId: data.themeId,
      type: data.type || NoteTypes.note,
      images: data.images,
      position: data.position,
      archived: data.archived
    } as MyNote;
    if (externalData.type === NoteTypes.note) {
      externalData = {
        ...externalData,
        content: data.content,
        title: '',
        listItems: []
      };
    } else if (externalData.type === NoteTypes.list) {
      externalData = {
        ...externalData,
        title: data.title,
        listItems: data.listItems,
        content: ''
      };
    }
    return externalData;
  }
}

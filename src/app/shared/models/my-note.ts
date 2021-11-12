

export interface MyNote {
  id: string;
  title: string;
  content: string;
  images?: string[];
  createdDate?: string;
  modifiedDate?: string;
  archived?: boolean;
  color: string;
}

export interface MyNoteUi extends MyNote {
  selected?: boolean;
}

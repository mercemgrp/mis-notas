

export interface MyNote {
  id: string;
  title: string;
  content: string;
  images?: string[];
  createdDate?: string;
  modifiedDate?: string;
  archived?: boolean;
  color: string;
  position: number;
}

export interface MyNoteUi extends MyNote {
  selected?: boolean;
  c1: string;
  c2: string;
}

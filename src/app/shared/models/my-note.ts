
export interface ListItem {id: string; checked: boolean; item: string};
export interface MyNote {
  id: string;
  type: 1 | 2;
  title?: string;
  listItems?: ListItem[];
  content?: string;
  images?: string[];
  createdDate?: string;
  modifiedDate?: string;
  archived?: boolean;
  themeId: string;
  position: number;
}

export interface MyNoteUi extends MyNote {
  selected?: boolean;
  c1: string;
  c2: string;
  themeTitle: string;
}

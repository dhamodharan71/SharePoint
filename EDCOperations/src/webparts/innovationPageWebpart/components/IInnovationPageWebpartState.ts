import { IListItem } from "./IListItem";

export interface IInnovationPageWebpartState {
  status: string;
  items: IListItem[];
  currentItems: any;
  fileInput:any;
}
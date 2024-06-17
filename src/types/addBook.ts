export type AddBookValues = {
  id: number;
  title: string;
  publicationDate: string;
  isbn: string;
  pages: number;
  author: string;
  description: string;
  image: FileList;
  file: FileList;
  qty: number;
  categoryId: number[];
  selectAll: boolean;
};

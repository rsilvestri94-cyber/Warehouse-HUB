export type Priority = 1 | 2 | 3;

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  priority: Priority;
  author: string;
  authorEmail?: string;
  date: string;
}

export type FilterKey = 'all' | 'active' | 'done';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
  date: string;
}

export interface TodoCounts {
  all: number;
  active: number;
}

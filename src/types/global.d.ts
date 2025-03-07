export type Category = {
  id: number;
  createdAt: string;
  name: string;
  user_id: string;
};

export type Expense = {
  id: number;
  createdAt: string;
  name: string;
  amount: number;
  date: string;
  category_id: number;
  user_id: string;
};

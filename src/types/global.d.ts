export type Category = {
  id: number;
  createdAt: string;
  user_id: string;
  name: string;
  budgeted: boolean;
  budget_id: number | null;
  allocated_amount: number | null;
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

export type Budget = {
  id: number;
  createdAt: string;
  user_id: string;
};

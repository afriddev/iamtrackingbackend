export type userType = {
  emailId: string;
  mobilenumber: number;
  password: string;
  fisrtName: string;
  lastName?: string;
  todayDate: number;
  lastUpdatedDate: number;

  monthLimitAmount: number;
  todaySpends: {
    id: string;
    amount: number;
    response: string;
    date: string;
    type: string;
  }[];

  dailyLimit: number;
  dailySpends: {
    id: string;
    amount: number;
    response: string;
    date: string;
    type: string;
  }[];

  monthLyCharges: number;
  dailyChargeLimit: number;
  monthLySpends: number;
};

export type groceryType = {
  emailId: string;
  lastUpdateDate: number;
  todayDate: number;

  monthLyGroceryAmount: number;
  notifyHalf: boolean;

  groceryList: [groceryListDataType];
  notifications: [groceryListDataType];

  missedGroceryList: [groceryListDataType];
  todayGroceryList: [groceryListDataType];

  completedgroceryList: [groceryListDataType];
};

export type groceryListDataType = {
  itemName: string;
  pricePerKg: number;
  requiredGmsPerWeek: number;
  addedDate: number;
};

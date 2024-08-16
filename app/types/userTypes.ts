export type userType = {
  emailId: string;
  mobilenumber: number;
  password: string;
  fisrtName: string;
  lastName?: string;
  todayDate: number;
  lastUpdatedDate: number;
  monthLimitAmount: number;
  todaySpends: {id:string,amount:number,response:string,date:string,type:"Grocery" | "Normal"}[];
  balance: number;
  totalSpend:number;
  dailyLimit:number;
  totalSaved:number
  imageUrl:string;
  monthlySpends: {id:string,amount:number,response:string,date:string}[]
};

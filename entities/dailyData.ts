
import { ICompany } from "./company"

 interface IDailyData{
    id: number,
    date: Date,
    stock: ICompany,
    high: number,
    low: number,
    close: number,
    open: number
};


 class DailyData implements IDailyData{
    id: number;
    date: Date;
    stock: ICompany;
    high: number;
    low: number;
    close: number;
    open: number;
    constructor(id: number, date: Date, stock: ICompany, high: number, low: number, close: number, open: number){
    
        this.id = id;
        this.date = date;
        this.stock = stock;
        this.high = high;
        this.low = low;
        this.close = close;
        this.open = open;
    }

}

export { DailyData, IDailyData };



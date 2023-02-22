import {IIndustry} from './Industry';
import { ISector } from './sector';
import { IIpoYear } from './ipoYear';

interface ICompany {
    id: number,
    ticker: string,
    name: string,
    sector: ISector,
    industry: IIndustry,
    ipo_year?: IIpoYear
};

class Company implements ICompany{

    id: number;
    ticker: string;
    name: string;
    sector: ISector;
    industry: IIndustry;
    ipo_year?: IIpoYear;

    constructor(data: ICompany) {
        this.id = data.id;
        this.ticker = data.ticker;
        this.name = data.name;
        this.sector = data.sector;
        this.industry = data.industry;
        this.ipo_year = data.ipo_year;
    }

}

export {ICompany, Company}
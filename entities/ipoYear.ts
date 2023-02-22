 interface IIpoYear{
    id: number,
    year: number
};


 class IpoYear implements IIpoYear{

    id: number;
    year: number;

    constructor(id:number, year: number){

        this.id = id;
        this.year = year;

    }

}

export {IIpoYear, IpoYear};



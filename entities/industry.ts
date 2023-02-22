interface IIndustry{
    id: number,
    name: string
};

class Industry implements IIndustry{

    id: number;
    name: string;

    constructor(id: number, name: string){
    
        this.id = id;
        this.name = name;
    
    }

}

export { IIndustry, Industry }
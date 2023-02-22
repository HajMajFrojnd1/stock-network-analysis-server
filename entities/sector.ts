interface ISector{
    id: number,
    name: string
};

class Sector implements ISector{
    id: number;
    name: string;

    constructor(id: number, name: string){
   
        this.id = id;
        this.name = name;

    }
}

export { ISector, Sector };

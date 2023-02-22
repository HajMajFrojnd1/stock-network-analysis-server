const dfd = require("danfojs-node")
import { stringToColour } from "../helperFunctions";
import { JSONValue } from "./json";


interface INode{

    id: number;
    label: string;
    sector: string;
    edges: IEdge[];


}

interface IEdge{

    source: number;
    target: number;
    weight: number;

}

interface IGraph{

    nodes: INode[];
    edges: IEdge[];

}

class GNode implements INode{

    id: number;
    label: string;
    sector: string;
    edges: IEdge[];

    static createWithEdges(id: number, label: string, sector: string, edges: IEdge[]){
        const node = new GNode();
        node.id = id;
        node.label = label;
        node.sector = sector;
        node.edges = edges;
        return node;
    }

    static create(id: number, label: string, sector: string){
        const node = new GNode();
        node.id = id;
        node.label = label;
        node.sector = sector;
        return node;
    }

    static serialize(node: GNode): JSONValue{
        return {
            id: node.id,
            label: node.label,
            sector: node.sector,
        }
    }

}

class GEdge implements IEdge{

    source: number;
    target: number;
    weight: number;

    constructor( source: number, target: number, weight: number){

        this.source = source;
        this.target = target;
        this.weight = weight;

    }

    static serialize(edge: IEdge): JSONValue{
        return {
            source: edge.source,
            target: edge.target,
            weight: edge.weight,
        }
    }

}

class GGraph implements IGraph{

    nodes: INode[];
    edges: IEdge[];
    
    constructor(nodes: INode[], edges:IEdge[]){

        this.nodes = nodes;
        this.edges = edges;

    }

    addNode(id: number, label: string, color: string){
        this.nodes.push(GNode.create(id, label, color));
    }

    addEdge(id: number, source: GNode, target: INode, weight: number){
        this.edges.push(new GEdge(source.id, target.id, weight));
        this.nodes[source.id].edges.push(new GEdge(source.id, target.id, weight));
    }

    removeNode(id: number){
        this.nodes.splice(id, 1);
        this.edges = this.edges.filter(edge => edge.source!== id)
    }


    static async fromFile(file: string): Promise<GGraph>{
        
        let nodes_row = true ;
        let nodes: INode[] = [];
        let edges: IEdge[] = [];

        
        return dfd.streamCSV(file, (df) => {
            
            if(nodes_row){
                
                if(df.values[0].includes("edgedef>node1 VARCHAR")){
                    nodes_row = false;
                }
                else{
                    nodes.push(GNode.create(df.values[0][0], df.values[0][1], df.values[0][6]));
                }

            }else{
                edges.push(new GEdge(df.values[0][0], df.values[0][1], df.values[0][2]));
            }
            
            return;
        }, {delimiter: ","}).then((value) => {
            
            return new GGraph(nodes, edges);
            
        });

    }

    static serialize(graph: GGraph): JSONValue {
    
        return {
            nodes: graph.nodes.map(GNode.serialize),
            edges: graph.edges.map(GEdge.serialize),
        }
    
    }

}

export { GGraph, INode, IEdge, IGraph, GNode, GEdge };

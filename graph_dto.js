const mysql = require('mysql2');
const pool = require("./connection.js").pool;

class GraphInstance{
    constructor(id,from,to,aggregate,type,data){
    
        this.id = id;
        this.from = from;
        this.to = to;
        this.aggregate = aggregate;
        this.type = type;
        this.data = data;
    
    }
}

class GraphDTO {

    static insertGraphNetwork(from,to,aggregate,type,data,sim_type,con){
        return new Promise((resolve,reject)=>{
            con.query("INSERT INTO `Graph_Network` (start, end, aggregate, type, similarity_type) VALUES (?,?,?,?,?)",
                        [from,to,aggregate,type,sim_type],(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                    console.log(result);
                    let graphId = result.insertId;
                    let sql_data = [];
                    let nodes = {};

                    data.nodes.forEach(node => {
                        nodes[node.id] = node.label
                    });

                    data.edges.forEach(edge => {
                        sql_data.push([nodes[edge.source], nodes[edge.target], graphId, edge.weight]);
                    });

                    this.insertEdgesBatch(sql_data, con);
                }
            })
        });
    }

    static insertEdgesBatch(dataArray, con){
        return new Promise((resolve,reject)=>{
            con.query("INSERT INTO `Edge` (source, target, graph, weight) VALUES ?",
                        [dataArray],(err,result)=>{
                if(err){
                    console.log("Error graph id:", dataArray[0][2]);
                    reject(err);
                }else{
                    resolve(result);
                    console.log("graph id:", dataArray[0][2]);
                    console.log(result);
                }
            })
        });
    }

    static getGraphsBetweenDates(type,sim_type,start,end,con){
        return new Promise((resolve,reject)=>{
            con.query( "SELECT * FROM graph WHERE type = " + type + 
                        " AND aggregate = 1 " + 
                        " AND similarity_type = '" + sim_type + "'" +
                        " AND start >= '" + start + "'" +
                        " AND start <= '" + end + "'",
                (err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
            })
        });
    }
    

    static getSimpleByAggrType(aggregate, type, con){

        return new Promise((resolve,reject)=>{
            con.query("SELECT id, start, end FROM `Graph_Network` WHERE type = " + type + " AND aggregate = " + aggregate,(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        });
    }

    static getSimpleByAggrTypeSim(aggregate, type, sim_type, con){

        return new Promise((resolve,reject)=>{
            con.query("SELECT g.id, g.start, g.end FROM `Graph_Network` g " +
                        " JOIN `Similarity_Type` st on g.similarity_type = st.id" +
                        " WHERE type = " + type + 
                        " AND aggregate = " + aggregate +
                        " AND st.name = '" + sim_type + "'",
                (err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
            })
        });
    }

    static getSimType(con){
        return new Promise((resolve,reject)=>{
            con.query( "SELECT DISTINCT name FROM `Similarity_Type`",
                (err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
            })
        });
    }

    static getGraphById(id,con){
        return new Promise((resolve,reject)=>{
            con.query( "SELECT * FROM `Graph_Network` WHERE id = :id", {id: id},
                (err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
            })
        });
    }

    static getEdgesById(id,con){
        return new Promise((resolve,reject)=>{
            con.query( "SELECT e.source, e.target, e.weight FROM `Edge` e " +
                            " INNER JOIN `Company` s on s.ticker = e.source" +
                            " INNER JOIN `Company` t on t.ticker = e.target" +
                            " WHERE e.graph = :id",{id: id},
                (err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);

                    }
            })
        });
    }
    static getNodesById(id,con){
        return new Promise((resolve,reject)=>{
            con.query( "SELECT s.ticker as id, s.ticker as label, i.name as industry, se.name as sector FROM `Edge` e " +
                            " INNER JOIN `Company` s on s.ticker = e.source" +
                            " INNER JOIN `Sector` se on s.sector = se.id" +
                            " INNER JOIN `Industry` i on s.industry = i.id" +
                            " WHERE e.graph = :id"  +
                        " UNION" +
                        " SELECT t.ticker as id, t.ticker, i.name as industry, se.name as sector FROM `Edge` e " +
                            " INNER JOIN `Company` t on t.ticker = e.target" +
                            " INNER JOIN `Sector` se on t.sector = se.id" +
                            " INNER JOIN `Industry` i on t.industry = i.id" +
                            " WHERE e.graph = :id" , {id: id},

                (err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);

                    }
            })
        });
    }

}

module.exports = GraphDTO;
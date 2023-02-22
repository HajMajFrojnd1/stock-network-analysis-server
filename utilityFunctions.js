const fs = require("fs");
const GGraph = require("./entities/Graph.ts");
const GraphDTO = require("./graph_dto.js");



const getDirectories = source =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => source + "/" + dirent.name)

const getGraphFromDirectory = (directory) => {
    let file = directory + "/network.gdf";
    let graph = new GGraph.GGraph.fromFile(file);

    return {graph: graph, directory: directory};

}

const getGraphRangeAndIndex = (directory) => {

    let parts = directory.split("/");
    let range = parts[parts.length - 1];
    let index = parts[parts.length - 2];

    let [aggregate, type] = index.split("_");
    let [start, end] = range.split("_");

    let [day, month, year] = start.split("-");
    from = new Date(year, month - 1, day);
    
    [day, month, year] = end.split("-");
    to = new Date(year, month - 1, day);
    
    return {aggregate: aggregate, type: type, start: from, end: to};

}

const resolveGraphs = async (p_graphs,sim_type,con) => {

    p_graphs.map(({graph, directory}) => {

        let ri_obj = getGraphRangeAndIndex(directory);
        Promise.resolve(graph).then((gr)=>{
            let json_data = GGraph.GGraph.serialize(gr);
           
            GraphDTO.insertGraphNetwork(
                ri_obj.start.toISOString().split('T')[0],
                ri_obj.end.toISOString().split('T')[0],
                Number(ri_obj.aggregate),
                getType(ri_obj.type),
                json_data,
                sim_type,
                con
            );
            /*
            GraphDTO.insert(
                ri_obj.start.toISOString().split('T')[0],
                ri_obj.end.toISOString().split('T')[0],
                Number(ri_obj.aggregate),
                getType(ri_obj.type),
                JSON.stringify(json_data),
                sim_type,
                con
            );*/
        })
    })

}

const getType = (type) => {
    if (type === "day") {
        return 1;
    } else if (type === "month") {
        return 2;
    } else if (type === "year") {
        return 3;
    }
}

exports.getGraphFromDirectory = getGraphFromDirectory;
exports.getDirectories = getDirectories;
exports.resolveGraphs = resolveGraphs;
exports.getType = getType;
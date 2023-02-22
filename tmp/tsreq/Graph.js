"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GEdge = exports.GNode = exports.GGraph = void 0;
var dfd = require("danfojs-node");
var GNode = /** @class */ (function () {
    function GNode() {
    }
    GNode.createWithEdges = function (id, label, sector, edges) {
        var node = new GNode();
        node.id = id;
        node.label = label;
        node.sector = sector;
        node.edges = edges;
        return node;
    };
    GNode.create = function (id, label, sector) {
        var node = new GNode();
        node.id = id;
        node.label = label;
        node.sector = sector;
        return node;
    };
    GNode.serialize = function (node) {
        return {
            id: node.id,
            label: node.label,
            sector: node.sector,
        };
    };
    return GNode;
}());
exports.GNode = GNode;
var GEdge = /** @class */ (function () {
    function GEdge(source, target, weight) {
        this.source = source;
        this.target = target;
        this.weight = weight;
    }
    GEdge.serialize = function (edge) {
        return {
            source: edge.source,
            target: edge.target,
            weight: edge.weight,
        };
    };
    return GEdge;
}());
exports.GEdge = GEdge;
var GGraph = /** @class */ (function () {
    function GGraph(nodes, edges) {
        this.nodes = nodes;
        this.edges = edges;
    }
    GGraph.prototype.addNode = function (id, label, color) {
        this.nodes.push(GNode.create(id, label, color));
    };
    GGraph.prototype.addEdge = function (id, source, target, weight) {
        this.edges.push(new GEdge(source.id, target.id, weight));
        this.nodes[source.id].edges.push(new GEdge(source.id, target.id, weight));
    };
    GGraph.prototype.removeNode = function (id) {
        this.nodes.splice(id, 1);
        this.edges = this.edges.filter(function (edge) { return edge.source !== id; });
    };
    GGraph.fromFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var nodes_row, nodes, edges;
            return __generator(this, function (_a) {
                nodes_row = true;
                nodes = [];
                edges = [];
                return [2 /*return*/, dfd.streamCSV(file, function (df) {
                        if (nodes_row) {
                            if (df.values[0].includes("edgedef>node1 VARCHAR")) {
                                nodes_row = false;
                            }
                            else {
                                nodes.push(GNode.create(df.values[0][0], df.values[0][1], df.values[0][6]));
                            }
                        }
                        else {
                            edges.push(new GEdge(df.values[0][0], df.values[0][1], df.values[0][2]));
                        }
                        return;
                    }, { delimiter: "," }).then(function (value) {
                        return new GGraph(nodes, edges);
                    })];
            });
        });
    };
    GGraph.serialize = function (graph) {
        return {
            nodes: graph.nodes.map(GNode.serialize),
            edges: graph.edges.map(GEdge.serialize),
        };
    };
    return GGraph;
}());
exports.GGraph = GGraph;

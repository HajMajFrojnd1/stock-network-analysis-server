require('typescript-require');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const cors = require('cors');
const helper = require("./utilityFunctions.js");
const GraphDTO = require('./graph_dto.js');

Date.prototype.addHours= function(h){
  this.setHours(this.getHours()+h);
  return this;
}


const con = mysql.createConnection({
  "host":"db-mysql-fra1-82542-do-user-13612104-0.b.db.ondigitalocean.com",
  "port":"25060",
  "user":"doadmin",
  "password":"AVNS_zHy1PorZO9bMRWu5LA1",
  "database":"defaultdb",
  namedPlaceholders: true,
});

con.connect((err) => {
  if (err) throw err;

  console.log("Connected!");

  
  /*let sql_company = "CREATE INDEX graph_id_index ON `Edge` (graph);";
  con.query(sql_company, function (err, result) {
    if (err) throw err;
    console.log(result);
  });*/
    
  /*helper.resolveGraphs(
    helper.getDirectories("C:/Users/patri/Desktop/gauss-complete/8_day")
    .map((directory) => helper.getGraphFromDirectory(directory)),
    2,
    con
  );
  helper.resolveGraphs(
    helper.getDirectories("C:/Users/patri/Desktop/gauss-complete/9_day")
    .map((directory) => helper.getGraphFromDirectory(directory)),
    2,
    con
  );*/
  
    
    
    
  });


  
  app.use(cors());
  
  app.get('/test_graph', function (req, res) {
    res.end("lol0");
  })
  
  app.get("/graphs/types/sim_types", function (req, res) {
  
    GraphDTO.getSimType(con)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
      })
    
  
  });

app.get('/company/:company', function (req, res) {
    
    let sql_company = "SELECT c.ticker, c.name, i.name as industry, s.name as sector FROM `Company` c INNER JOIN `Industry` i ON i.id = c.industry" + " INNER JOIN `Sector` s ON s.id = c.sector" + " WHERE c.ticker = '" + req.params.company +"'";

    con.query(sql_company, function (err, result) {
      if (err) throw err;
      console.log(result);
      
      res.send(result[0]);

    });

});

app.get("/graphs/:aggr/:type", function (req, res) {

    let aggr = req.params.aggr;
    let type = helper.getType(req.params.type);

    GraphDTO.getByAggrType(aggr,type,con)
      .then((result) => {

        result.map(element => {
          element.start.addHours(1);
          element.end.addHours(1);
          return element;
        });
        
        result.sort((a, b) => b.end.getTime() - a.end.getTime());
       
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
      })
      
      
    });

app.get("/graphs/simple/:aggr/:type", function (req, res) {
  
  let aggr = req.params.aggr;
  let type = helper.getType(req.params.type);

  GraphDTO.getSimpleByAggrType(aggr,type,con)
    .then((result) => {

      result = result.map(element => {
        element.start.addHours(1);
        element.end.addHours(1);
        return element;
      });

      result.sort((a, b) => b.end.getTime() - a.end.getTime());
     
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    })
  

});

app.get("/graphs/simple/:aggr/:type/:sim_type", function (req, res) {

  let aggr = req.params.aggr;
  let type = helper.getType(req.params.type);
  let sim_type = req.params.sim_type;

  GraphDTO.getSimpleByAggrTypeSim(aggr,type,sim_type,con)
    .then((result) => {

      result = result.map(element => {
        element.start.addHours(2);
        element.end.addHours(2);
        return element;
      });

      result.sort((a, b) => b.end.getTime() - a.end.getTime());
     
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    })
  
});

app.get("/graphs/:id", function (req, res) {

  let id = req.params.id;
  let data = {nodes: null, edges: null}
  GraphDTO.getGraphById(id,con)
    .then((result_g) => {
      GraphDTO.getEdgesById(id,con)
        .then((result_e) => {
          GraphDTO.getNodesById(id,con)
            .then((result_n) => {
              data.nodes = result_n
              data.edges = result_e
              result_g[0].data = data
              res.send(result_g);
            })
            .catch((err) => {
              console.log(err);
            })
        })
        .catch((err) => {
          console.log(err);

          
        })
    })
    .catch((err) => {
      console.log(err);
    })
  

});

app.get("/temporary/graphs/:type/:sim_type/:start/:end", function (req, res) {

  let type = helper.getType(req.params.type);
  let sim_type = req.params.sim_type;
  let start = req.params.start;
  let end = req.params.end;

  GraphDTO.getGraphsBetweenDates(type,sim_type,start,end,con)
    .then((result) => {
      result = result.map(element => {
        element.start.addHours(2);
        element.end.addHours(2);
        return element;
      });
      result.sort((a, b) => b.end.getTime() - a.end.getTime());
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    })
  

});


var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})



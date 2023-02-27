require('typescript-require');
const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const cors = require('cors');
const helper = require("./utilityFunctions.js");
const GraphDTO = require('./graph_dto.js');
const HistoricDTO = require('./historic_data_dto.js');
const yahooFinance = require('yahoo-finance2').default
 
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

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
  supportBigNumbers: true,
  bigNumberStrings: true
});

con.connect((err) => {
  if (err) throw err;

  console.log("Connected!");

  
  //let sql_company = "SELECT date FROM Daily_data WHERE stock_id = 1 AND DATE >= '2022-09-01' ORDER BY ABS(DATEDIFF('2022-09-01', date)) ASC";
  
  //con.query("DELETE FROM Daily_data",(err, result) => console.log(result));
    


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
    
  /*con.query("ALTER TABLE Daily_data MODIFY volume BIGINT NOT NULL",(err, res) => {
      if(err){
        console.log(err);
      }  
      console.log(res);
    }
  );*/

  
  
  /*let ticker = "^GSPC";
  let from = "2007-01-03";
  let to = "2022-10-18";
  let id = 412;
    yahooFinance.historical(ticker,{
                            period1: from,
                            period2: to,
                            interval: '1d'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
                      })
                    .then ((quotes) => {
                      let q = quotes.map(({date, open, high, low, close, volume}) => {
                        return [date.toISOString().split("T")[0],id,open,high,low,close,volume];
                      })
                      con.query("INSERT INTO Daily_data (date, stock_id, open, high, low, close, volume) VALUES ?", [q],(err, res) => {
                        if(err){
                          console.log(err);
                        }  
                        console.log(res);
                        }
                      );
                    });*/
    
  });


  
  app.use(cors());
  

  app.post("/portfolio/data", (req, res) => {

    const {tickers, range} = req.body;
    let to = new Date("2022-10-18");
    let from = new Date(to);
    switch(range){
      case "1Month":  from = helper.subtractMonths(to, 1)
        break;
      case "3Month":  from = helper.subtractMonths(to, 3)
        break;
      case "6Month":  from = helper.subtractMonths(to, 3)
        break;
      case "1Year": from = helper.subtractMonths(to, 12)
        break;
      case "3Year": from = helper.subtractMonths(to, 36)
        break;
      case "All": from = "2007-01-03"
        break;
      case "GraphPeriod": from = req.body.from 
                          to = req.body.to
        break;
    }

    HistoricDTO.getPortfolioHistory(from, to, tickers, con)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
      })

  });
  
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

app.get('/hostorical/:start/:end', (req, res) => {
  let start = req.params.start;
  let end = req.params.end;

  HistoricDTO.getDataBetweenDatesAll(start, end, con)
    .then((result) => {
      let data = result
      let companies = {}
      
      data.forEach(element => {
        let ticker = element.ticker
        delete element["ticker"];
        if(!(ticker in companies)){
          companies[ticker] = []
        }
        companies[ticker].push(element);
      });

      res.send(companies);
  })
  .catch((err) => {
    console.log(err);
  })
});

app.get('/hostorical/:ticker/:start/:end', (req, res) => {
  let ticker = req.params.ticker;
  let start = req.params.start;
  let end = req.params.end;

  HistoricDTO.getDataBetweenDatesTicker(ticker, start, end, con)
    .then((result) => {
      res.send(result);
  })
  .catch((err) => {
    console.log(err);
  })
});

app.get('/spx/:from/:to', (req, res) => {
  let ticker = "^GSPC";
  let from = req.params.from;
  let to = req.params.to;

  yahooFinance.historical({
    symbol: ticker,
    from: from,
    to: to,
    period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
  }, (err, quotes) => {
    res.send(quotes);
  });
  
});




var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})



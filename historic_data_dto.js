Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}
class HistoricDTO {


    static getDataBetweenDatesAll(start,end,con){
        return new Promise((resolve,reject)=>{
            con.query("SELECT c.ticker, d.date, d.open, d.high, d.low, d.close FROM Company c " +
                            " INNER JOIN Daily_data d ON c.id = d.stock_id " +
                            " WHERE d.date >= :start AND d.date <= :end " +
                            " ORDER BY d.date",
                        {
                            start:start,
                            end:end
                        },
                (err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
            })
        });
    }

    static getDataBetweenDatesTicker(start,end,ticker,con){
        return new Promise((resolve,reject)=>{
            con.query("SELECT c.ticker, d.date, d.open, d.high, d.low, d.close, d.volume FROM Company c " +
                            " INNER JOIN Daily_data d ON c.id = d.stock_id " +
                            " WHERE d.date >= :start AND d.date <= :end AND c.ticker = :ticker "+
                            " ORDER BY d.date",
                        {   
                            start:start, 
                            end:end, 
                            ticker:ticker
                        },
                (err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
            })
        });
    }

    static getPortfolioHistory(from, to, tickers, con) {
        return new Promise((resolve,reject)=>{
            con.query(  
                "SELECT date FROM Daily_data " + 
                " WHERE stock_id = 1 AND date >= :from AND date <= :to" + 
                " ORDER BY date DESC",
                {
                    from: from,
                    to: to
                },
                (err, result) => {
                    if (err) reject(err);;
                    let dates = []
                    result.forEach(element => {
                        element.date.addHours(2);
                    });
                    for(let i = 0; i < result.length; i+=Math.floor(result.length/8)) {
                        dates.push(result[i].date.toISOString().split("T")[0]);
                    }
                    con.query(
                        "SELECT c.ticker, d.date, d.open, d.high, d.low, d.close, d.volume FROM Company c " +
                        " INNER JOIN Daily_data d ON c.id = d.stock_id " +
                        " WHERE d.date IN (:dates) AND c.ticker IN (:tickers)" +
                        " ORDER BY d.date",
                        {   
                            dates:dates,
                            tickers:tickers
                        },
                        (err,res)=>{
                            if(err)reject(err);
                            else {
                                res.push(dates.reverse());
                                resolve(res);
                            }
                        }
                    )
                }
            );
            
        });
    }

    static insertAllStockData(con){

            con.query("SELECT ticker, id FROM Company ORDER BY id", function (err, result) {
                if (err) throw err;
            
                let i = 0;
            
                result.forEach(({ticker, id}) => {
                  let from = "2007-01-03";
                  let to = "2022-10-18";
            
                  setTimeout(() => {
                    console.log("Downloading ticker", ticker, id);
                    yahooFinance.historical({
                      symbol: ticker,
                      from: from,
                      to: to,
                      period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
                    }, (err, quotes) => {
                      let q = quotes.map(({date, open, high, low, close, volume}) => {
                        return [date.toISOString().split("T")[0],id,open,high,low,close,volume];
                      })
              
                      con.query("INSERT INTO Daily_data (date, stock_id, open, high, low, close, volume) VALUES ?", [q],(err, res) => {
                          console.log(res);
                        }
                      );
              
                    });
                  },1000*i);
                  i++;
                })
              });

    }

}

module.exports = HistoricDTO;
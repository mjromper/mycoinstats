/**
* This is the main Node.js server script for your project
* Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
*/

// Client ID: ef045e5d1541d8f6f454ff53edb1812d, Client secret: a9402c87a63f54238e86be95df41e796b08cdf430629415077b062df28c9f348

const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const axios = require('axios');


app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


app.use('/static', express.static('public'))

app.use('/',express.static(__dirname + '/public'));

/**
 * Start App
 */

app.get('/api/data',(req, res) => {
  

  axios({
    method: 'get',
    url: 'https://api.coin-stats.com/v6/portfolio_items?coinExtraData=true',
    headers: {
      'token': 'r:a0fa9b4136fcfd97ba2dec2e62e50d23'
    }
  }).then(function (response) {
    
        var out = {};
    
        let data = response.data;
       
        data.sort(function(a,b){
            if (a.p.USD < b.p.USD) {
                return 1;
            }
            if (a.p.USD > b.p.USD) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });
        data.forEach( e=>{
            
  
            if (e.pi) {
                e.pi.sort(function(a,b){
                    if (a.c*a.p.USD > b.c*b.p.USD) {
                        return -1;
                    }
                    if (b.c*b.p.USD > a.c*a.p.USD) {
                        return 1;
                    }
                    return 0;
                });
                e.pi.forEach(pi=>{
                    if (!pi.coin.ifk){
                        let coin = {
                          image: pi.coin.ic,
                          coin: pi.coin.n,
                          symbol: pi.coin.s,
                          price: pi.p.USD,
                          amount: pi.c === ''? 0 :  pi.c
                          
                        }
                        if (!out[pi.coin.n]){
                          out[pi.coin.n] = coin;
                        }else {
                          out[pi.coin.n].amount += coin.amount;
                        }
                        
                    }
                });
            }
        });
        
        var out2 = [];
   
        Object.keys(out).forEach(key=>{
            var temp = out[key];
            
            out2.push(temp);
        });
    
        res.send(out2);
    
  });;
  
  
});

app.listen(3000, () => {
  console.log(`Server listening on port 3000`)
});

const images = {
    'Coinbase': 'https://static.coinstats.app/portfolio_images/RoKjUg08sQ_light.png',
    'Coinbase Pro': 'third-party/images/Coinbase Pro.png',
    'Binance': 'https://static.coinstats.app/portfolio_images/rEDgK7z0hU_light.png',
    'KuCoin': 'https://static.coinstats.app/portfolio_images/gVLGu9r0Fy_light.png',
    'Ledger Wallet': 'https://static.coinstats.app/portfolio_images/KjOVPzHTpv_light.png',
    'Trust Wallet': 'https://static.coinstats.app/portfolio_images/5f0c45da345c0c02fa7d278b_light.png',
    'Bybit Exchange': 'https://static.coinstats.app/portfolio_images/BlNjnGxZtB8cH5O_dark.png',
    'Bitget': 'https://static.coinstats.app/portfolio_images/bitget_dark.png',
};

function getIcon(x){
    if (images[x]){
        return images[x];
    } else {
        return 'https://coinstats.app/static/images/manual_portfolio.svg'
    }
}
function round(i, n){
    let p = 10;
    for (let x=1;x<i;x++){
        p = p*10;
    }
    return Math.round(n*p,i)/p;
}

function getBadge(number) {
    return (number/1000).toFixed(1) + "k";
}

function formatMoney(number) {
    var decPlaces = (number < 1)? 4 : 2;
    if ( number < 0.1 ) {
        decPlaces = 6;
    }
    var sign = number < 0 ? "-" : "";
    var i = String(parseInt(number = Math.abs(Number(number) || 0).toFixed(decPlaces)));
    var j = (j = i.length) > 3 ? j % 3 : 0;

    return sign +
        (j ? i.substring(0, j) + "," : "") +
        i.substring(j).replace(/(\.{3})(?=\.)/g, "$1" + ",") +
        (decPlaces ? "." + Math.abs(number - i).toFixed(decPlaces).slice(2) : "");
}

function render(){
    const thisToken = localStorage.getItem('token');
    console.log('#render: token = ', thisToken);
    const url = "https://api.coin-stats.com/v6/portfolio_items?coinExtraData=true";

    document.getElementById("error").innerHTML = "";
    document.getElementById("out").innerHTML = "";

    axios.defaults.headers.common['token'] = thisToken;

    var htmltext = "<table width='95%' style='margin: 0 auto;font-size: 14px;'>";
    htmltext += '<tr style="color: #AAA"><th></th><th></th><th style="text-align:right;">AMOUNT</th><th style="text-align:right;">PRICE</th><th style="text-align:left;padding-left:10px;">24h</th><th style="text-align:right;">TOTAL</th></tr>';
    axios.get(url)
    .then(function (response) {
        document.getElementById("settings").style.display = 'none';
        var eurToUsdPrice;
        let data = response.data;
        let total = 0;
        let totalBTC = 0;
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
            htmltext += `<tr>
                            <td colspan='6'>
                                <div style='padding: 5px;background: #f5f5f5;font-size: 18px;'>
                                <img style="vertical-align: middle;width: 32px;" src='${getIcon(e.n)}'>
                                <b style="color: #000; vertical-align: middle;">${e.n} <span style="float: right; margin-top: 5px;">$${formatMoney(e.p.USD)}</span></b>
                                </div>
                            </td>
                        </tr>`;
            
            if (e.pi.length) {
                total = total + e.p.USD;
                totalBTC = totalBTC + e.p.BTC;
                htmltext += '';
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
                    if (pi.c > 0 && !pi.coin.ifk){
                        if (!eurToUsdPrice && pi.coin.s === 'EUR') {
                            eurToUsdPrice = pi.p.USD;
                        }
                        htmltext += `<tr><td><img width='16px;' src='${pi.coin.ic}' /></td> 
                                <td>${pi.coin.n} [${pi.coin.s}]</td> 
                                <td style="text-align:right;">${round(5, pi.c)}</td>
                                <td style="text-align:right;">$${formatMoney(pi.p.USD)}</td>
                                <td style="text-align:left; padding-left:10px;"><span style="color:${parseFloat(pi.coin.p24)>0.5? 'lightgreen': parseFloat(pi.coin.p24)<-0.5? 'orangered': 'white'};">${pi.coin.p24}%</span></td>
                                <td style="text-align:right;"><b>$${formatMoney(pi.c*pi.p.USD)}</b></td></tr>`;
                    }
                })
                htmltext += `<tr><td colspan='5'>&nbsp;</td></tr>`;
            }
        });
        var totalInEur = eurToUsdPrice? (total/eurToUsdPrice) : 0; 
        htmltext = "</table><br><h1 style='margin: 0px;text-align: center;'><a style='color:#fff;text-decoration:none;' href='https://coinstats.app/portfolio/' target='_blank'>$"+ formatMoney(total) + "</a></h1><div style='margin-bottom: 30px;text-align:center'>"+totalBTC +" BTC</div>" + htmltext;
        //document.getElementById("bitcoin").style.display = "none";
        document.getElementById("out").innerHTML = htmltext;
        console.log("done render", total);

        
    }).catch(function(err){
        document.getElementById("settings").style.display = 'block';
        document.getElementById("error").innerHTML = err;
    });
}

const token = localStorage.getItem('token');
document.getElementById("token").value = token;


document.getElementById("settoken").onclick = function(){
    var token = document.getElementById("token").value;
    localStorage.setItem('token', token);
    render();
}

render();




"use strict";(function(){var currencies={};var config={attributes:true};function signDirectionFormat(result,sign,direction){var checkResultNegativeOrPositive=function checkResultNegativeOrPositive(){if(parseFloat(result)<0){if(typeof result==="string"){return"-"+sign+result.substring(1)}return"-"+sign+Math.abs(result)}return""+sign+result};return direction===0?checkResultNegativeOrPositive():""+result+sign}function priceFormatterWithPair(price,pair,locale,definedDigit){if(!price||!pair||!locale){return 0}var fractionDigits=getFractionDigitsCount(price,pair);if(fractionDigits===2&&definedDigit){fractionDigits=definedDigit}var result=new Intl.NumberFormat(locale,{minimumFractionDigits:fractionDigits,maximumFractionDigits:fractionDigits}).format(price);return result}function formatByCurrencyType(value,currencyData){var fractionDigits=getFractionDigitsCount(value,currencyData);if(!value||!currencyData){return 0}if(currencyData.isCrypto){return value/currencyData.rate}return value*currencyData.rate}function priceFormatter(priceUsd,locale){var currencyData=arguments.length>2&&arguments[2]!==undefined?arguments[2]:{symbol:"USD",usdValue:1,sign:"$",symbolDirection:0,isCrypto:false};var notCalc=arguments[3];if(!priceUsd||!locale){return 0}var pair=currencyData.name;var direction=currencyData.symbolDirection;var sign=currencyData.symbol;var price=notCalc?priceUsd:formatByCurrencyType(priceUsd,currencyData);var fractionDigits=getFractionDigitsCount(price,pair);var result=new Intl.NumberFormat(locale,{minimumFractionDigits:fractionDigits,maximumFractionDigits:fractionDigits}).format(price);return signDirectionFormat(result,sign,direction)}function getFractionDigitsCount(number,currency){var minimumFractionDigits=void 0;if(number%1===0){minimumFractionDigits=0}else if(currency==="BTC"){minimumFractionDigits=8}else if(currency==="ETH"&&number<1&&number>-1){minimumFractionDigits=8}else if(number<1&&number>-1){minimumFractionDigits=6}else{minimumFractionDigits=2}return minimumFractionDigits}function miniLoader(){var loader=document.createElement("div");loader.setAttribute("id","loader");loader.style.cssText="\n  height:70px;\n  width:70px;\n  border: none;\n  padding: 0;\n  z-index: 100;\n  outline: none;\n  position: relative;\n  overflow: hidden;\n  margin: 0 auto;\n  ";loader.innerHTML='    <svg className="circular" viewBox="25 25 50 50">\n  <circle\n    className="path"\n    cx="50"\n    cy="50"\n    r="20"\n    fill="none"\n    strokeWidth="2"\n    strokeMiterlimit="10"\n    strokeDasharray="200, 200"\n    strokeDashoffset="0"\n  />\n  <style>\n\n  circle {\n    animation: dash 1.5s ease-in-out infinite,\n      Darkcolor 6s ease-in-out infinite;\n  }\n  circle {\n    stroke-dasharray: 89, 500;\n    stroke-dashoffset: 0;\n    stroke: var(--bColor);\n    animation: dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite;\n    stroke-linecap: round;\n  }\n  #loader svg{\n    animation: rotate 2s linear infinite;\n    height: 100%;\n    width: 100%;\n    transform-origin: center center;\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    margin: auto;\n  }\n  \n  </style>\n</svg>';return loader}function getData(token,callback){return fetch("https://api.coin-stats.com/v2/portfolios/public?token="+token,{method:"GET",headers:{"Content-Type":"application/json"}}).then(function(res){return res.json()}).then(function(res){callback(res.portfolio)})}function getCurrencies(callback){return fetch("https://api.coin-stats.com/v3/currencies").then(function(resFiats){return resFiats.json()}).then(function(resFiats){callback(resFiats)})}function createWidget(placeHolder){var token=placeHolder.getAttribute("link");var loader=miniLoader();var container=document.createElement("div");if(token&&!document.getElementById("refreshPortfolio")){container.appendChild(loader);placeHolder.innerHTML=container.innerHTML;resetStyles(placeHolder)}getData(token,function(data){if(data){loader.remove();var localAtt=placeHolder.getAttribute("locale");var width=placeHolder.getAttribute("width");var statusUpColor=placeHolder.getAttribute("status-up-color");var statusDownColor=placeHolder.getAttribute("status-down-color");var textColor=placeHolder.getAttribute("text-color");var backgroundColor=placeHolder.getAttribute("bg-color");var borderColor=placeHolder.getAttribute("border-color");var currency=placeHolder.getAttribute("currency").toUpperCase();var disableCredits=placeHolder.getAttribute("disable-credits");var price=data.p;var profit=data.pt;var widgetType=placeHolder.getAttribute("widgetType");var coinsCount=placeHolder.getAttribute("coins-count");var id=placeHolder.getAttribute("id");var rotateBtnColor=placeHolder.getAttribute("rotate-button-color");var font=placeHolder.getAttribute("font")||"Roboto, Arial, Helvetica";var profitPercent=data.pp;var portfolioItems=data.pi;var colors={statusUp:statusUpColor,statusDown:statusDownColor,text:textColor,background:backgroundColor,border:borderColor};var size="large";if(Number(width)<240){size="small";width=240}if(Number(width)<362){size="small"}if(Number(width)>=362){size="medium"}if(Number(width)>=486){size="large"}var widgetContainer=document.createElement("div");var mainPriceContainer=document.createElement("div");var firstRow=document.createElement("div");var textNode=document.createElement("span");textNode.innerHTML=countMainPriceByCurrency(price,currency,localAtt);textNode.style.cssText="\n        font-size: 34px;\n        font-weight: 300;\n        font-stretch: normal;\n        font-style: normal;\n        line-height: normal;\n        letter-spacing: normal;\n        color: "+colors.text+";\n      ";var refreshIcon=document.createElement("span");refreshIcon.setAttribute("id","refreshPortfolio");refreshIcon.style.cssText="\n        margin: 0 10px;\n          cursor: pointer;\n    ";refreshIcon.innerHTML='\n    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 22">\n    <style>\n    svg:hover path{\n      fill:#ffa958\n    }\n    </style>\n      <path fill="'+rotateBtnColor+'" fill-rule="evenodd" d="M2.2 10.9c0-2.367.777-4.459 2.146-6.163l-2.06.976a.9.9 0 1 1-.772-1.626l3.8-1.8a.901.901 0 0 1 1.203.436l1.8 3.9a.9.9 0 0 1-1.635.755L5.9 5.682C4.688 7.106 4 8.865 4 10.9c0 4.503 3.597 8.1 8.1 8.1.773 0 1.47-.17 2.281-.373a.9.9 0 1 1 .437 1.746l-.035.009c-.78.195-1.672.418-2.683.418a9.862 9.862 0 0 1-9.9-9.9m7.618-7.727C10.63 2.97 11.326 2.8 12.1 2.8c4.503 0 8.1 3.597 8.1 8.1 0 1.943-.627 3.634-1.74 5.023l-.163-2.287a.9.9 0 1 0-1.795.128l.3 4.2a.9.9 0 0 0 .981.832l4.3-.4a.9.9 0 0 0-.167-1.792l-1.84.171C21.307 15.125 22 13.136 22 10.9 22 5.403 17.597 1 12.1 1c-1.01 0-1.902.223-2.683.418l-.035.009a.9.9 0 1 0 .436 1.746"/>\n    </svg>\n  ';firstRow.appendChild(textNode);firstRow.appendChild(refreshIcon);var profitRow=document.createElement("div");profitRow.style.cssText="\n        font-size: 24px;\n        display:flex;\n        margin-top:6px;\n    ";var profitPercentCounted=createPercentProfit(profitPercent,colors,localAtt,currency,size);var profitspan=document.createElement("span");var profitPercentspan=document.createElement("span");profitspan.appendChild(createProfit(profit,colors,localAtt,currency,size,profitPercent));profitPercentspan.appendChild(profitPercentCounted);profitRow.appendChild(profitspan);profitRow.appendChild(profitPercentspan);firstRow.style.cssText="\n          align-items: center;\n          display: flex;";mainPriceContainer.appendChild(firstRow);mainPriceContainer.appendChild(profitRow);mainPriceContainer.style.cssText="\n        padding:16px 20px;\n        border-top-left-radius: 20px;\n        border-top-right-radius: 20px;\n        border: 1px solid "+colors.border+";\n        background-color: "+colors.background+";\n      ";var widgetTable=createTable(data,colors,size,localAtt,currency,portfolioItems,coinsCount);widgetContainer.style.cssText="\n        max-width: "+width+"px;\n        font-family: "+font+", sans-serif;\n        color: "+colors.text+";\n      \n      ";widgetContainer.appendChild(mainPriceContainer);widgetContainer.appendChild(widgetTable);if(!disableCredits){widgetContainer.appendChild(createCredits(colors.text))}var _container=document.createElement("div");_container.appendChild(widgetContainer);placeHolder.innerHTML=_container.innerHTML;resetStyles(placeHolder);document.getElementById("refreshPortfolio").addEventListener("click",function(e){document.getElementById("refreshPortfolio").classList.remove("active");e.target.classList.add("active");initAll()})}})}function resetStyles(placeHolder){placeHolder.insertAdjacentHTML("beforeend","<style>\n      coin-stats-portfolio-widget * {\n        word-break: initial;\n        word-wrap: initial;\n        box-sizing: border-box;\n      }\n      .active{\n        transform-origin: center center;\n        animation: rotate 600ms linear infinite;\n      }\n      @keyframes rotate {\n        100% {\n          transform: rotate(360deg);\n        }\n      }\n      @keyframes dash-result {\n        100% {\n          stroke-dasharray: 200, 500;\n          stroke-dashoffset: 0;\n        }\n      }\n      \n     @keyframes rotate {\n        100% {\n          transform: rotate(360deg);\n        }\n      }\n      \n     @keyframes dash {\n        0% {\n          stroke-dasharray: 1, 500;\n          stroke-dashoffset: 0;\n        }\n        50% {\n          stroke-dasharray: 89, 500;\n          stroke-dashoffset: -#{rem(35)};\n        }\n        100% {\n          stroke-dasharray: 89, 500;\n          stroke-dashoffset: -#{rem(124)};\n        }\n      }\n      \n       @keyframes color {\n        100%,\n        0% {\n          stroke: #ffa959;;\n        }\n        40% {\n          stroke: #ffa959;;\n        }\n        66% {\n          stroke:#ff7a59;;\n        }\n        80%,\n        90% {\n          stroke: #ffa959;\n        }\n      }\n      \n       @keyframes Darkcolor {\n        100%,\n        0% {\n          stroke: var(--fColor);\n        }\n        40% {\n          stroke: var(--fColor);\n        }\n        66% {\n          stroke: var(--eDarkColor);\n        }\n        80%,\n        90% {\n          stroke: var(--fColor);\n        }\n      }\n       @keyframes LightColor {\n        100%,\n        0% {\n          stroke: #ffffff;\n        }\n        40% {\n          stroke: #ffffff;\n        }\n        66% {\n          stroke: var(--e80Color);\n        }\n        80%,\n        90% {\n          stroke: #ffffff;\n        }\n      }\n\n    </style>")}function createCredits(textColor){var credits=document.createElement("div");var anchor=document.createElement("a");anchor.href="http://coinstats.app";anchor.target="_blank";anchor.innerHTML='Powered by <span style="letter-spacing: 0.25px;font-size: 14px; vertical-align: unset;">Coin<b style="vertical-align: unset;">Stats</b></span>';anchor.style.cssText="\n      font-size: 12px;\n      font-weight: 300;\n      text-decoration: none;\n      color: "+textColor+";\n      vertical-align: unset;\n    ";credits.style.cssText="\n      padding-top: 10px;\n      padding-left: 34px;\n      vertical-align: unset;\n    ";credits.appendChild(anchor);return credits}function createTable(data,colors,size,localAtt,currency,portfolioItems,coinsCount){var table=document.createElement("table");table.style.cssText="\n    width: 100%;\n    overflow: hidden;\n    border-bottom-left-radius: 20px;\n    border-bottom-right-radius: 20px;\n    border-collapse: separate;\n    border-spacing: 0;\n    border: none;\n  ";var tableHead=document.createElement("tr");var nameTd=document.createElement("td");var emptyTd1=document.createElement("td");var emptyTd2=document.createElement("td");var amountTd=document.createElement("td");var priceTd=document.createElement("td");var totalTd=document.createElement("td");nameTd.innerHTML="Name";amountTd.innerHTML="Amount";priceTd.innerHTML="Price";totalTd.innerHTML="Total";tableHead.appendChild(nameTd);tableHead.appendChild(emptyTd2);if(size==="large"){tableHead.appendChild(amountTd)}tableHead.appendChild(priceTd);tableHead.appendChild(totalTd);tableHead.style.cssText="\n    font-size: 10px;\n    font-weight: 500;\n    font-stretch: normal;\n    font-style: normal;\n    line-height: normal;\n    letter-spacing: normal;\n    text-align: right;\n    color: #808080;\n    background-color: "+colors.background+";\n    text-transform:uppercase\n  ";amountTd.style.cssText="\n    padding:7px 0px;\n    padding-right: 20px;\n";priceTd.style.cssText="\n    padding:7px 0px;\n    padding-right: 20px;\n";nameTd.style.cssText="\n    border-left:1px solid "+colors.border+";\n    padding:7px 0px;\n    padding-left:20px;\n  ";totalTd.style.cssText="\n  border-right:1px solid "+colors.border+";\n  padding:7px 0px;\n  padding-right:15px;\n";table.style.sccText="border-right: solid 1px "+colors.border+";";table.appendChild(tableHead);var contentLength=portfolioItems.slice(0,coinsCount).length;var sortedPortfolioItems=portfolioItems.sort(function(a,b){return b.p.USD*b.c-a.p.USD*a.c});sortedPortfolioItems.slice(0,coinsCount).forEach(function(el,i){var isFirstEl=i===0;var isLastEl=contentLength-1===i;var tableRow=createTableRow(el,colors,size,localAtt,currency,isFirstEl,isLastEl);table.appendChild(tableRow)});return table}function createTableRow(data,colors,size,localAtt,currency,isFirstEl,isLastEl){var tableRow=document.createElement("tr");var rankTableData=document.createElement("td");var logoTableData=createLogoNode(data.coin.ic,colors,isLastEl,data.coin.n);var name=createName(data.coin.n,data.coin.s,colors,size,isLastEl);var total=createTotalNode(data.c,data.p,colors,localAtt,currency,isFirstEl,isLastEl);tableRow.style.cssText="\n    height: 51px;\n    cursor: pointer;\n  ";rankTableData.innerHTML=data.coin.r?data.coin.r:"";var rankTableDataStyles="\n    font-size: 14px;\n    font-weight: 300;\n    padding-left: 20px;\n    padding-right:4px;\n    vertical-align: middle;\n    background-color: "+colors.background+";\n    border: none;\n    border-top: solid 1px "+colors.border+";\n    border-left: solid 1px "+colors.border+";\n    color: "+colors.text+";\n  ";if(isFirstEl){}if(isLastEl){rankTableDataStyles+="\n      border-bottom-left-radius: 29px; \n      border-bottom: solid 1px "+colors.border+";"}rankTableData.style.cssText=rankTableDataStyles;tableRow.setAttribute("onclick","window.open('https://coinstats.app/en/coins/"+data.coin.i+"');");tableRow.appendChild(logoTableData);tableRow.appendChild(name);if(size==="large"){var amount=createAmount(data.c,colors,localAtt,currency,isFirstEl,isLastEl,data.coin.s);tableRow.appendChild(amount)}var price=createPrice(data.p,colors,localAtt,currency,isFirstEl,isLastEl);tableRow.appendChild(price);tableRow.appendChild(total);return tableRow}function createPercentProfit(percent,colors,localAtt,currency,size){var percentNodeBlock=document.createElement("div");var profitPercent=void 0;if(percent&&percent[currency]!==undefined){profitPercent=percent[currency]}else{profitPercent=percent.USD}var status=profitPercent<0?"statusDown":"statusUp";var styles="\n    color: "+colors[status]+";\n    font-size: 14px;\n    font-weight: 300;\n    text-align: right;\n    vertical-align: middle;\n    display: flex;\n    align-items: center;\n    "+(size!=="large"?"padding-right: 20px;":"padding-right: 20px;")+"\n ";percentNodeBlock.style.cssText=styles;var locale=localAtt||"en";if(!localAtt&&navigator){locale=navigator.language}percentNodeBlock.insertAdjacentHTML("afterbegin",createArrowSvg(colors[status],status==="statusDown"));percentNodeBlock.insertAdjacentHTML("beforeend","<span>"+Number(profitPercent).toFixed(2)+"%</span>");return percentNodeBlock}function createProfit(profit,colors,localAtt,currency,size,percent){var calcProfitByCurrency=true;var profitPercent=void 0;if(percent&&percent[currency]!==undefined){profitPercent=percent[currency]}else{profitPercent=percent.USD}if(profit&&profit[currency]!==undefined){calcProfitByCurrency=false;profit=profit[currency]}else{profit=profit.USD}var maximumFractionDigits=6;var locale=localAtt||"en";var percentNodeBlock=document.createElement("div");var status=profitPercent<0?"statusDown":"statusUp";var styles="\n    color: "+colors[status]+";\n    font-size: 14px;\n    font-weight: 300;\n    text-align: right;\n    vertical-align: middle;\n    padding-right: 20px;'}\n   \n   \n  ";percentNodeBlock.style.cssText=styles;if(!localAtt&&navigator){locale=navigator.language}var formattedPrice=calcProfitByCurrency?priceFormatter(profit,locale,currencies[currency]):signDirectionFormat(priceFormatterWithPair(profit,currencies[currency].name,locale),currencies[currency].symbol,currencies[currency].symbolDirection);percentNodeBlock.innerHTML=formattedPrice;return percentNodeBlock}function createPercentNode(percent,colors,size,isFirstEl,isLastEl){var tableData=document.createElement("td");var percentNodeBlock=document.createElement("div");var status=percent<0?"statusDown":"statusUp";var tableDataStyles="\n      color: "+colors[status]+";\n      font-size: 14px;\n      font-weight: 300;\n      text-align: right;\n      vertical-align: middle;\n      "+(size!=="large"?"padding-right: 20px;":"padding-right: 20px;")+"\n      border: none;\n      background-color: "+colors.background+";\n      border-top: solid 1px "+colors.border+";\n      border-right: solid 1px "+colors.border+";\n     \n    ";if(isLastEl){tableDataStyles+="border-bottom: solid 1px "+colors.border+";\n      border-bottom-right-radius: 29px;"}if(size!=="large"){tableDataStyles+="border-right: solid 1px "+colors.border+";";if(isLastEl){tableDataStyles+="border-bottom-right-radius: 29px;"}if(isFirstEl){}}tableData.style.cssText=tableDataStyles;percentNodeBlock.style.cssText="\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    ";percentNodeBlock.insertAdjacentHTML("afterbegin",createArrowSvg(colors[status],status==="statusDown"));percentNodeBlock.insertAdjacentHTML("beforeend","<span>"+Math.abs(percent).toFixed(2)+"%</span>");tableData.appendChild(percentNodeBlock);return tableData}function createArrowSvg(color,rotate){return'\n    <svg style="display: unset;'+(rotate?" transform: rotate(0.5turn);":"")+'displa" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">\n      <path fill="'+color+'" fill-rule="evenodd" d="M8.894 5.789l2.382 4.764A1 1 0 0 1 10.382 12H5.618a1 1 0 0 1-.894-1.447l2.382-4.764a1 1 0 0 1 1.788 0z"/>\n    </svg>\n  '}function createName(name,symbol,colors,size,isLastEl){var tableData=document.createElement("td");var nameNode=document.createElement("span");if(size==="small"){nameNode.innerHTML=symbol}else{nameNode.innerHTML=name+" ("+symbol+")"}nameNode.style.cssText="\n    font-size: 12px;\n    font-weight: 300;\n    padding-left:4px;\n    padding-right:4px;\n    color: "+colors.text+";\n  ";var tableDataStyles="\n      vertical-align: middle;\n      border: none;\n      background-color: "+colors.background+";\n      border-top: solid 1px "+colors.border+";\n    ";if(isLastEl){tableDataStyles+="border-bottom: solid 1px "+colors.border+";"}tableData.style.cssText=tableDataStyles;tableData.appendChild(nameNode);return tableData}function createAmount(count,colors,localAtt,currency,isFirstEl,isLastEl,coinSymbol){var tableData=document.createElement("td");var locale=localAtt||"en";var amount=priceFormatterWithPair(count,coinSymbol,locale);tableData.innerHTML=amount;var tableDataStyles="\n      font-size: 14px;\n      font-weight: 300;\n      text-align: right;\n      vertical-align: middle;\n      padding-right: 20px;\n      background-color: "+colors.background+";\n      border: none;\n      border-top: solid 1px "+colors.border+";\n      color: "+colors.text+";\n    ";if(isLastEl){tableDataStyles+="\n      border-bottom: solid 1px "+colors.border+";"}tableData.style.cssText=tableDataStyles;return tableData}function countMainPriceByCurrency(price,currency,localAtt){price=price.USD;var maximumFractionDigits=6;var locale=localAtt||"en";if(price>1){maximumFractionDigits=2}var priceCalculation=price*currencies[currency].rate;if(currency==="BTC"||currency==="ETH"){priceCalculation=price/currencies[currency].rate;maximumFractionDigits=8}var formattedPrice=new Intl.NumberFormat(locale,{maximumFractionDigits:maximumFractionDigits}).format(priceCalculation);return currencies[currency].symbol+formattedPrice}function createTotalNode(count,price,colors,localAtt,currency,isFirstEl,isLastEl){var tableData=document.createElement("td");var maximumFractionDigits=6;var locale=localAtt||"en";if(price*count>1){maximumFractionDigits=2}if(!localAtt&&navigator){locale=navigator.language}var total=priceFormatter(price.USD*count,locale,currencies[currency]);if(price[currencies[currency].name]!==undefined){total=currencies[currency].symbol+priceFormatterWithPair(price[currencies[currency].name]*count,currencies[currency].name,locale)}tableData.innerHTML=total;var tableDataStyles="\n      font-size: 14px;\n      font-weight: 300;\n      text-align: right;\n      vertical-align: middle;\n      padding-right: 20px;\n      background-color: "+colors.background+";\n      border: none;\n      border-top: solid 1px "+colors.border+";\n      border-right: solid 1px "+colors.border+";\n      color: "+colors.text+";\n    ";if(isLastEl){tableDataStyles+="\n      border-bottom: solid 1px "+colors.border+";\n      border-right: solid 1px "+colors.border+";\n      border-bottom-right-radius: 29px;\n      "}tableData.style.cssText=tableDataStyles;return tableData}function createPrice(price,colors,localAtt,currency,isFirstEl,isLastEl){price=price.USD;var tableData=document.createElement("td");var maximumFractionDigits=6;var locale=localAtt||"en";if(price>1){maximumFractionDigits=2}if(!localAtt&&navigator){locale=navigator.language}var priceCalculation=price*currencies[currency].rate;if(currency==="BTC"||currency==="ETH"){maximumFractionDigits=8;priceCalculation=price/currencies[currency].rate}var formattedPrice=new Intl.NumberFormat(locale,{maximumFractionDigits:maximumFractionDigits}).format(priceCalculation);tableData.innerHTML=currencies[currency].symbol+formattedPrice;var tableDataStyles="\n      font-size: 14px;\n      font-weight: 300;\n      text-align: right;\n      vertical-align: middle;\n      padding-right: 20px;\n      background-color: "+colors.background+";\n      border: none;\n      border-top: solid 1px "+colors.border+";\n      color: "+colors.text+";\n      \n    ";if(isLastEl){tableDataStyles+="\n      border-bottom: solid 1px "+colors.border+";"}tableData.style.cssText=tableDataStyles;return tableData}function iconMaker(icon){if(icon&&icon.toLowerCase().indexOf("http")>=0){return icon}return"https://api.coin-stats.com/api/files/812fde17aea65fbb9f1fd8a478547bde/"+icon}function createLogoNode(src,colors,isLastEl,name){var tableData=document.createElement("td");var logoNode=document.createElement("img");var noSrc=document.createElement("span");noSrc.innerHTML=name.slice(0,3);noSrc.style.cssText="\n    vertical-align: middle;\n    border-radius: 50%;\n    background: rgb(255, 169, 89);\n    color: #000000;\n    text-align: center;\n    font-weight: bold;\n    font-size: 8px;\n    width: 20px;\n    height: 20px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    \n  ";logoNode.setAttribute("src",iconMaker(src));logoNode.style.cssText="\n    height: 23px;\n    width: 23px;\n    max-width: none;\n  ";var tableDataStyles="\n      vertical-align: middle;\n      background-color: "+colors.background+";\n      border: none;\n      border-top: solid 1px "+colors.border+";\n      border-left: solid 1px "+colors.border+";\n      padding-left:12px;\n     \n      \n    ";if(isLastEl){tableDataStyles+="border-bottom: solid 1px "+colors.border+";\n      border-bottom-left-radius: 29px; "}tableData.style.cssText=tableDataStyles;if(src){tableData.appendChild(logoNode)}else{tableData.appendChild(noSrc)}return tableData}function ready(callbackFunc){if(document.readyState!=="loading"){callbackFunc()}else if(document.addEventListener){document.addEventListener("DOMContentLoaded",callbackFunc)}else{document.attachEvent("onreadystatechange",function(){if(document.readyState==="complete"){callbackFunc()}})}}function initAll(){var allPlaceHolders=document.querySelectorAll("coin-stats-portfolio-widget");allPlaceHolders.forEach(function(node){createWidget(node)})}function observeMutations(){var nodes=document.querySelectorAll("coin-stats-portfolio-widget");var observer=new MutationObserver(callback);nodes.forEach(function(node){var disable=node.getAttribute("disable-mutation-observer");if(!disable){observer.observe(node,config)}});function callback(MutationRecord){createWidget(MutationRecord[0].target)}}ready(function(){getCurrencies(function(res){currencies=res;initAll();observeMutations()})})})();
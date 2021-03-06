var fs = require('fs');
var content = JSON.parse(fs.read('/home/ubuntu/flightMonitorCatcher/destinos.json'));
var origem = content[0].origem;
var destinos = content[0].destinos;
console.log(destinos);
var menorPreco = 350;
var daysRange = [6,14];
var actualPrice;
var actualDate;
var actualDateBack;
var allData = {};


function printDate(date){
	return (date.getDate()*1 < 10 ? '0'+date.getDate()*1 : date.getDate()*1) + '/' + (date.getMonth()*1 < 9 ? '0'+(date.getMonth()*1+1) : date.getMonth()*1+1 )  + '/' + date.getFullYear();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDateArray(range){
	var piecesMin = range[0].split('/');
	var piecesMax = range[1].split('/');
	var dateMin = new Date(piecesMin[2], piecesMin[1]*1 - 1, piecesMin[0]);
	var dateMax = new Date(piecesMax[2], piecesMax[1]*1 - 1, piecesMax[0]);
	
	var dateArray = [];
	
	dateArray.push(printDate(dateMin));
	
	while (dateMax > dateMin){
		dateMin.setDate(dateMin.getDate() + 1);
		dateArray.push(printDate(dateMin));
	}
	return dateArray;
}


function convertDateFormat(td){
	var pieces = td.split('/');
	return pieces[2]+'-'+pieces[1]+'-'+pieces[0];
}

function getDateLater(td, days){
	var pieces = td.split('/');
	var date = new Date(pieces[2]*1, pieces[1]*1-1, pieces[0]*1);
	date.setDate(date.getDate()*1 + days);	
	return  printDate(date);
}

function getNextWeekend(td){
	var pieces = td.split('/');
	var date = new Date(pieces[2]*1, pieces[1]*1-1, pieces[0]*1);
	date.setDate(date.getDate() + (5 - date.getDay()));
	return  printDate(date);
}

//var dateRange = [getDateLater(printDate(new Date()), 10),'30/09/2015'];
var dateRange = ['01/08/2015','30/09/2015'];
console.log(dateRange);
var dates = generateDateArray(dateRange);

function generateURL(dataIda, dataVolta, origem, destino){
	//console.log("");console.log("");
	//console.log(dataIda);
	//console.log(dataVolta);
	//console.log("****DESTINO: "+destino);
	return "http://www.submarinoviagens.com.br/passagens/selecionarvoo?SomenteIda=false" + 
			"&Origem=" + origem + "&Destino=" + destino + 
			"&Origem=" + destino + "&Destino=" + origem + 
			"&Data=" + dataIda + "&Data=" + dataVolta + 
			"&NumADT=2&NumCHD=0&NumINF=0&SomenteDireto=false&Hora=&Hora=&selCabin=&Multi=false&Cia=&AffiliatedID=&s_cid=&utm_medium=&utm_source=&utm_campaign=";
}

function getNewURL(){
	actualDestin = destinos[getRandomInt(0,destinos.length-1)];
	if (["Belo Horizonte"].indexOf(actualDestin) != -1){
		actualDate = dates[getRandomInt(0,dates.length-1)];
		actualDate = getNextWeekend(actualDate);
		actualDateBack = getDateLater(actualDate,2);
	}else{
		actualDate = dates[getRandomInt(0,dates.length-1)];
		actualDateBack = getDateLater(actualDate,getRandomInt(daysRange[0],daysRange[1]));
	}
	console.log(actualDestin);
	return generateURL(actualDate,actualDateBack, origem, actualDestin);
}

var page = require("webpage").create();

var page_ = function(){};

var i = 0;


page_.onError = function(msg,trace){
	timeout = 0;
	clearInterval(loopClear);
	try{
		page.clearCookies();
		page.close();
	}catch(e){
		console.log(e);
	}
	abrePaginaRecursivo();
	return;
}


var loopTimes = 0;
var maxTimes = 10;
var loopClear;
function abrePaginaRecursivo(){
	loopTimes++;
	if (loopTimes > maxTimes) {
		console.log("SAINDO");
		phantom.exit();
	}
	var url = getNewURL();
	page = require('webpage').create();
	page.onError = page_.onError;
	page.open(url, function(){
		loopClear = setInterval(loop, 2000);
	});
	return;
};


setTimeout(function(){
	 abrePaginaRecursivo();
},0);

function cleanData(data){
	return data.replace(/ /g, '').replace(/\n/g, '').replace('R$','').replace(',','.')*1;
};


function removeElementsWithValue(arr, val) {
    var i = arr.length;
    while (i--) {
	arr[i] = arr[i]*1;
        if (arr[i] === val) {
            arr.splice(i, 1);
        }
    }
    return arr;
}	

var timeout = 0;
var api = require('webpage').create();
var stop = false;
var loop = function(){
	try{
		stop = page.evaluate(function(){
			return (document.getElementById('CreateHintBoxyDIVFundo') != null);
		});
		actualURL = page.url;
	}catch(e){
		console.log(e);
	}
	if (stop || timeout > 25){
		try{
			actualPrice = page.evaluate(function(){
				function cleanData(data){
					return data.replace(/ /g, '').replace(/\n/g, '').replace('R$','').replace(',','.')*1;
				};
				function removeElementsWithValue(arr, val) {
				    var i = arr.length;
				    while (i--) {
					arr[i] = arr[i]*1;
				        if (arr[i] === val) {
				            arr.splice(i, 1);
				        }
				    }
				    return arr;
				i};	
				var precos = [];
				if (document.getElementsByClassName('spanBestPriceNoStop')[0] !== undefined)
					precos.push(cleanData(document.getElementsByClassName('spanBestPriceNoStop')[0].innerText));
				if (document.getElementsByClassName('spanBestPriceOneStop')[0] != undefined)
					precos.push(cleanData(document.getElementsByClassName('spanBestPriceOneStop')[0].innerText));
				if (document.getElementsByClassName('spanBestPriceTwoStop')[0] != undefined)
					precos.push(cleanData(document.getElementsByClassName('spanBestPriceTwoStop')[0].innerText));
	
				if (precos.length==0)
					return false;
	
				var newArray = removeElementsWithValue(precos, 0);
				
				if (newArray.length==0)
					return false;
	
				return newArray.sort()[0];
				
			});
		}catch(e){
			actualPrice = 0;
		}
		if (actualPrice > 0 || timeout > 25){
			timeout = 0;
			clearInterval(loopClear);
			var settings = {
			  operation: "POST",
			  encoding: "utf8",
			  headers: {
				"Content-Type": "application/json"
			  },
			  data: JSON.stringify({
				"departDate": convertDateFormat(actualDate),
				"returnDate": convertDateFormat(actualDateBack),
				"origin": origem,
				"destination": actualDestin,
				"price": actualPrice,
				"searchUrl": actualURL
			  })
			};
			api = require("webpage").create();
			if (actualPrice > 0){
				api.open('http://ec2-54-148-212-165.us-west-2.compute.amazonaws.com/flights/', settings, function(status) {
			 		//console.log('Status: ' + status);
					//console.log("");
					console.log(actualDestin + ' - ' + actualDate + '-' + actualDateBack + ' - ' + actualPrice);
					try{
						page.clearCookies();
						page.close();
						api.close();
					}catch(e){
						console.log(e);
					}
					abrePaginaRecursivo();
				});
			}else{
				try{
					page.clearCookies();
					page.close();
				}catch(e){
					console.log(e);		
				}
				abrePaginaRecursivo();
			}
		}
	}
	
	timeout++;
	if (actualPrice < menorPreco && actualPrice != 0){
		//phantom.exit();
	}
}

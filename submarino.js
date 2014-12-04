var origem = "Rio de Janeiro";

var destinos = [
'Atenas',
'Veneza',
'Nova Iorque',
'Orlando',
'Madri',
'Paris',
'Lisboa',
'Miami',
'Los Angeles'
]
;

var menorPreco = 350;
var daysRange = [10,15];
var actualPrice;
var actualDate;
var actualDateBack;
var allData = {};


function printDate(date){
	return (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + '/' + (date.getMonth() < 10 ? '0'+(date.getMonth()) : date.getMonth() )  + '/' + date.getFullYear();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDateArray(range){
	var piecesMin = range[0].split('/');
	var piecesMax = range[1].split('/');
	var dateMin = new Date(piecesMin[2], piecesMin[1], piecesMin[0]);
	var dateMax = new Date(piecesMax[2], piecesMax[1], piecesMax[0]);
	
	var dateArray = [];
	
	dateArray.push(printDate(dateMin));
	
	while (dateMax > dateMin){
		dateMin.setDate(dateMin.getDate() + 1);
		dateArray.push(printDate(dateMin));
	}
	return dateArray;
}

var dateRange = ['01/03/2015','01/06/2015'];
var dates = generateDateArray(dateRange);

function convertDateFormat(td){
	var pieces = td.split('/');
	return pieces[2]+'-'+pieces[1]+'-'+pieces[0];
}

function getDateLater(td, days){
	var pieces = td.split('/');
	var date = new Date(pieces[2], pieces[1], pieces[0]);
	date.setDate(date.getDate() + days);	
	return  printDate(date);
}

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
	actualDate = dates[getRandomInt(0,dates.length-1)];
	actualDateBack = getDateLater(actualDate,getRandomInt(daysRange[0],daysRange[1]));
	actualDestin = destinos[getRandomInt(0,destinos.length-1)];
	return generateURL(actualDate,actualDateBack, origem, actualDestin);
}

var page = require("webpage").create();

var i = 0;

page.onInitialized = function(){
	console.log(new Date());
	loopClear = setInterval(loop,2000);
};

page.onError = function(msg,trace){
	clearInterval(loopClear);
	timeout = 0;
	page.clearCookies();
	abrePaginaRecursivo();
	return;
}

function abrePaginaRecursivo(){
	var url = getNewURL();
	page.open(url);
	return;
};


setTimeout(function(){
	 abrePaginaRecursivo();
},0);

var timeout = 0;
var api = require('webpage').create();
var stop = false;
var loopClear;
var loop = setInterval(function(){
	stop = page.evaluate(function(){
		if (window.hasOwnProperty('$'))
			return (document.getElementById('CreateHintBoxyDIVFundo') != null);
		return 0;
	});
	
	actualURL = page.url;
	if (stop || timeout > 20){
		actualPrice = page.evaluate(function(){		
			if (window.hasOwnProperty('$'))
				return document.getElementsByClassName('spanBestPriceOneStop')[0].innerText.replace(/ /g, '').replace(/\n/g, '').replace('R$','').replace(',','.')*1;
			return false;
		});
		if (actualPrice > 0 || timeout > 20){
			clearInterval(loopClear);
			timeout = 0;
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
				api.open('http://ec2-54-94-212-16.sa-east-1.compute.amazonaws.com/flights/', settings, function(status) {
			 		//console.log('Status: ' + status);
					//console.log("");
					console.log(actualPrice);
					page.clearCookies();
					abrePaginaRecursivo();
				});
			}else{
				page.clearCookies();
				abrePaginaRecursivo();
			}
		}
	}
	
	timeout++;
	if (actualPrice < menorPreco && actualPrice != 0){
		//phantom.exit();
	}
},2000);

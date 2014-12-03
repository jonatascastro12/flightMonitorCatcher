var origem = "Rio%20de%20Janeiro%20/%20RJ,%20Brasil,%20Todos%20os%20aeroportos%20(RIO)";

var destinos = [
'Madri,%20Espanha,%20Barajas%20(MAD)',
'Paris,%20Franca,%20Todos%20os%20aeroportos%20(PAR)',
'Lisboa,%20Portugal,%20Portela%20(LIS)'
];

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
	console.log("");console.log("");
	console.log(dataIda);
	console.log(dataVolta);
	console.log("****DESTINO: "+destino);
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
function abrePaginaRecursivo(){
	var url = getNewURL();
	page.open(url);
	return true;
};


setTimeout(function(){
	return abrePaginaRecursivo();
},0);

var timeout = 0;
var api = require('webpage').create();
var loop = setInterval(function(){
	stop = page.evaluate(function(){
		if (window.hasOwnProperty('$'))
			return ($('#CreateHintBoxyDIVFundo').size() == 0)
	});
	
	actualURL = page.url;
	
	if (stop || timeout > 60){
		timeout = 0;
		
		actualPrice = page.evaluate(function(){
			if (window.hasOwnProperty('$'))
				return $('.spanBestPriceOneStop').text().replace(/ /g, '').replace(/\n/g, '').replace('R$','').replace(',','.')*1;
		});
		
		if (actualPrice >0 || timeout > 60){
		
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
			api.open('http://127.0.0.1/flights/', settings, function(status) {
		  		console.log('Status: ' + status);
				console.log("");
				console.log(actualPrice);
				page.clearCookies();
				return abrePaginaRecursivo();
			})
		}
	}
	
	timeout++;
	
	if (actualPrice < menorPreco && actualPrice != 0){
		clearInterval(loop);
		
		console.log('**********MELHOR PREÇO************');
		console.log(actualPrice);
		console.log('**********LAST URL************');
		console.log(actualURL);
		console.log('**********ACTUAL URL************');
		console.log(page.url);
		
		phantom.exit();
	}
}, 2000);

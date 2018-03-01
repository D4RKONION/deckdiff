var tappedOutFetcher = function(url, deckToChange) {
	deckToChange = deckToChange
	var deckKey = url.slice(url.indexOf("/mtg-decks") + 11);
	if (deckKey.slice(-1) === "/") {
		deckKey = deckKey.slice(0, -1);
	}
	fetch('https://tappedout.net/api/deck/widget/?deck=' + deckKey)
		.then(function(response) {
		return response.json()
	})
	.then(function(myJson) {
		var allButBasics = myJson.cards.split("||");
		var basicLands = {"Island": "island", "Forest": "forest", "Swamp": "swamp", "Plains": "plains", "Mountain": "mountain"};
		for (var land in basicLands) {
			var generalArea = myJson.board.indexOf("boardContainer-" + basicLands[land] + "\">");
			var generalAreaSliced = myJson.board.slice(generalArea, generalArea + 100);
			var specificArea = generalAreaSliced.indexOf("x");
			var numberOfLands = Number(generalAreaSliced.slice(specificArea - 4, specificArea))
			if (numberOfLands !== 0) {
				allButBasics.push(numberOfLands + " " + land)
			}
		}
		return allButBasics

	})
	.then(function(tappedOutDeckList) {
		
		if (deckToChange === "deckOne") {
			document.getElementById("deckOneTextArea").innerHTML = "";
			for (var cardEnt in tappedOutDeckList) {
				document.getElementById("deckOneTextArea").innerHTML += (tappedOutDeckList[cardEnt] + "\n")
			}
			var deckOneBetaArray = document.getElementById('deckOneTextArea').value.split("\n");
			deckOneObj = deckObjectMaker(deckOneBetaArray);
			differnceFinder(deckOneObj, deckTwoObj)
		} else if (deckToChange === "deckTwo") {
			document.getElementById("deckTwoTextArea").innerHTML = "";
			for (var cardEnt in tappedOutDeckList) {
				document.getElementById("deckTwoTextArea").innerHTML += (tappedOutDeckList[cardEnt] + "\n")
			}
			var deckTwoBetaArray = document.getElementById('deckTwoTextArea').value.split("\n");
			deckTwoObj = deckObjectMaker(deckTwoBetaArray);
			differnceFinder(deckOneObj, deckTwoObj)
		}
		
		
	});
}


var deckObjectMaker = function(deckBetaArray) {
	var maindeckFinished = false;
	var deckObj = {"maindeck": {}, "sideboard": {}};

	for (var card in deckBetaArray) {
		var numberInDeck = deckBetaArray[card].slice(0, 1);
		var cardName = deckBetaArray[card].slice(2);
	    if (!maindeckFinished) {
	        if (deckBetaArray[card] === "") {
	            maindeckFinished = true;
	        } else {
	            deckObj["maindeck"][cardName] = numberInDeck;
	        }
	    } else if (maindeckFinished) {
			deckObj["sideboard"][cardName] = numberInDeck;
	    }
	}
	return deckObj;
}

var differnceFinder = function(deckOneObj, deckTwoObj) {
	var textDifference = "<h3>Main Deck</h3>";

	mainDifferenceList = [];
	mainDealtWithCards = [];
	

	for (var deckOneCardName in deckOneObj["maindeck"]) {
		for (var deckTwoCardName in deckTwoObj["maindeck"]) {
			if (deckOneCardName === deckTwoCardName) {
				if (deckOneObj["maindeck"][deckOneCardName] !== deckTwoObj["maindeck"][deckTwoCardName]) {
					mainDifferenceList.push((deckTwoObj["maindeck"][deckTwoCardName] - deckOneObj["maindeck"][deckOneCardName]) + " " + deckOneCardName)
				}
				mainDealtWithCards.push(deckOneCardName);
			} else if (deckOneCardName !== deckTwoCardName) {
				if (typeof deckTwoObj["maindeck"][deckOneCardName] === "undefined" && !mainDealtWithCards.includes(deckOneCardName)) {
					mainDifferenceList.push((deckOneObj["maindeck"][deckOneCardName] * -1) + " " + deckOneCardName);
					mainDealtWithCards.push(deckOneCardName);
				}
				if (typeof deckOneObj["maindeck"][deckTwoCardName] === "undefined" && !mainDealtWithCards.includes(deckTwoCardName)) {
					mainDifferenceList.push(deckTwoObj["maindeck"][deckTwoCardName] + " " + deckTwoCardName);
					mainDealtWithCards.push(deckTwoCardName);
				}
			}
		}
	}

	mainDifferenceList.sort();
	for (var cardEnt in mainDifferenceList) {
		if (mainDifferenceList[cardEnt].slice(0, 1) !== "-") {
			mainDifferenceList[cardEnt] = "+" + mainDifferenceList[cardEnt];
		}
		textDifference += (mainDifferenceList[cardEnt] + "<br>")
	}

	textDifference += "<br><h3>Sideboard</h3>"

	sideDifferenceList = [];
	sideDealtWithCards = [];
	for (var deckOneCardName in deckOneObj["sideboard"]) {
		for (var deckTwoCardName in deckTwoObj["sideboard"]) {
			if (deckOneCardName === deckTwoCardName) {
				if (deckOneObj["sideboard"][deckOneCardName] !== deckTwoObj["sideboard"][deckTwoCardName]) {
					sideDifferenceList.push((deckTwoObj["sideboard"][deckTwoCardName] - deckOneObj["sideboard"][deckOneCardName]) + " " + deckOneCardName)
				}
				sideDealtWithCards.push(deckOneCardName);
			} else if (deckOneCardName !== deckTwoCardName) {
				if (typeof deckTwoObj["sideboard"][deckOneCardName] === "undefined" && !sideDealtWithCards.includes(deckOneCardName)) {
					sideDifferenceList.push((deckOneObj["sideboard"][deckOneCardName] * -1) + " " + deckOneCardName);
					sideDealtWithCards.push(deckOneCardName);
				} else if (typeof deckOneObj["sideboard"][deckTwoCardName] === "undefined" && !sideDealtWithCards.includes(deckTwoCardName)) {
					sideDifferenceList.push(deckTwoObj["sideboard"][deckTwoCardName] + " " + deckTwoCardName);
					sideDealtWithCards.push(deckTwoCardName);
				}
			}
		}
	}
	
	sideDifferenceList.sort();
	for (var cardEnt in sideDifferenceList) {
		if (sideDifferenceList[cardEnt].slice(0, 1) !== "-") {
			sideDifferenceList[cardEnt] = "+" + sideDifferenceList[cardEnt];
		}
		textDifference += (sideDifferenceList[cardEnt] + "<br>")
	}

	document.getElementById("differenceSpace").innerHTML = textDifference;
}


document.addEventListener("DOMContentLoaded", function(event) {
	var deckOneBetaArray = document.getElementById('deckOneTextArea').value.split("\n");
	var deckTwoBetaArray = document.getElementById('deckTwoTextArea').value.split("\n");

	deckOneObj = deckObjectMaker(deckOneBetaArray);
	deckTwoObj = deckObjectMaker(deckTwoBetaArray);

	differnceFinder(deckOneObj, deckTwoObj)

	document.getElementById("deckOneTextArea").addEventListener("input", function() {
		var deckOneBetaArray = document.getElementById('deckOneTextArea').value.split("\n");
		deckOneObj = deckObjectMaker(deckOneBetaArray);
		differnceFinder(deckOneObj, deckTwoObj)
	}, false);

	document.getElementById("deckTwoTextArea").addEventListener("input", function() {
		var deckTwoBetaArray = document.getElementById('deckTwoTextArea').value.split("\n");
		deckTwoObj = deckObjectMaker(deckTwoBetaArray);
		differnceFinder(deckOneObj, deckTwoObj)
	}, false)
	
});


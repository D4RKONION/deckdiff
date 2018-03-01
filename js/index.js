var deckObjectMaker = function(deckBetaArray) {
	var mainboardFinished = false;
	var deckObj = {"mainboard": {}, "sideboard": {}};

	for (var card in deckBetaArray) {
		var numberInDeck = deckBetaArray[card].slice(0, 1);
		var cardName = deckBetaArray[card].slice(2);
	    if (!mainboardFinished) {
	        if (deckBetaArray[card] === "") {
	            mainboardFinished = true;
	        } else {
	            deckObj["mainboard"][cardName] = numberInDeck;
	        }
	    } else if (mainboardFinished) {
			deckObj["sideboard"][cardName] = numberInDeck;
	    }
	}
	return deckObj;
}

var differnceFinder = function(deckOneObj, deckTwoObj) {
	var textDifference = "<h3>Mainboard</h3>";

	mainDifferenceList = [];
	mainDealtWithCards = [];
	

	for (var deckOneCardName in deckOneObj["mainboard"]) {
		for (var deckTwoCardName in deckTwoObj["mainboard"]) {
			if (deckOneCardName === deckTwoCardName) {
				if (deckOneObj["mainboard"][deckOneCardName] !== deckTwoObj["mainboard"][deckTwoCardName]) {
					mainDifferenceList.push((deckTwoObj["mainboard"][deckTwoCardName] - deckOneObj["mainboard"][deckOneCardName]) + " " + deckOneCardName)
				}
				mainDealtWithCards.push(deckOneCardName);
			} else if (deckOneCardName !== deckTwoCardName) {
				if (typeof deckTwoObj["mainboard"][deckOneCardName] === "undefined" && !mainDealtWithCards.includes(deckOneCardName)) {
					mainDifferenceList.push((deckOneObj["mainboard"][deckOneCardName] * -1) + " " + deckOneCardName);
					mainDealtWithCards.push(deckOneCardName);
				}
				if (typeof deckOneObj["mainboard"][deckTwoCardName] === "undefined" && !mainDealtWithCards.includes(deckTwoCardName)) {
					mainDifferenceList.push(deckTwoObj["mainboard"][deckTwoCardName] + " " + deckTwoCardName);
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
				// console.log("name match!: " + deckOneCardName)
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


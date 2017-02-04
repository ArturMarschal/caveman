//////////////////////////////////////
/////      Initialization       //////
//////////////////////////////////////
var gameData = {};
$( document ).ready(function() {
    initGameStrings();
	initDomObjects();
	initGameObjects();
	updateInventory();
	setTimeout(updateInfo, 1500);
	setTimeout(updateInfo, 5000);
	setTimeout(showDomElem, 5000, $("#liWorld")[0], true);
	setTimeout(showDomElem, 5000, $("#World")[0], true);
});

function initGameStrings(){
	gameData.gameStringList = [];
	var gameStringList = gameData.gameStringList;
	gameStringList[0] = "Samu is awaken!";
	gameStringList[1] = "Samu would like to explore the world...";
	gameStringList[2] = "Samu is getting very hungry now...";
	gameStringList[3] = "Samu would like to eat something...anything.";
	gameStringList[4] = "What does Samu see over there? Is this edible?";
	gameStringList[5] = "Hmm... Berry! Samu need some more to get energy for explorations";
	gameStringList[6] = "What a nice glade... Samu shall build his camp here...";
	gameStringList[7] = "...need wood, a lot...";
	gameStringList[8] = "Samu";
	gameStringList[9] = "";
	gameStringList[6] = "";
	gameStringList[7] = "";
	gameStringList[8] = "";
	gameStringList[9] = "";
	gameStringList[6] = "";
	gameStringList[7] = "";
	gameStringList[8] = "";
	gameStringList[100] = "Samu need something before do this...";
}

function initDomObjects(){
	gameData.inventoryTab = $("#inventory")[0];
	gameData.infoTab = $("#info")[0];
	
	gameData.btnExplore = $("#btnExplore")[0];
	gameData.btnExplore.myClickCount = 0;
	gameData.btnExplore.myDuration = 1000;
	gameData.barExplore = $("#pbExplore")[0];
	gameData.barExplore.myValue = 0;
	
	gameData.btnEvolve = $("#btnEvolve")[0];
	gameData.barEvolve = $("#pbEvolve")[0];
	gameData.barEvolve.myValue = 0;
	
	gameData.btnMove = $("#btnMove")[0];
	gameData.barMove = $("#pbMove")[0];
	gameData.barMove.myValue = 0;
	
	gameData.btnSearchberry = $("#btnSearchberry")[0];
	gameData.btnSearchberry.myDuration = 500;
	gameData.barSearchberry = $("#pbSearchberry")[0];
	gameData.barSearchberry.myValue = 0;
	
	gameData.btnEatberry = $("#btnEatberry")[0];
	gameData.btnEatberry.myDuration = 500;
	gameData.barEatberry = $("#pbEatberry")[0];
	gameData.barEatberry.myValue = 0;
	
	gameData.btnEatmeat = $("#btnEatmeat")[0];
	gameData.btnEatmeat.myDuration = 500;
	gameData.barEatmeat = $("#pbEatmeat")[0];
	gameData.barEatmeat.myValue = 0;
	
	gameData.btnSearchwood = $("#btnSearchwood")[0];
	gameData.btnSearchwood.myDuration = 500;
	gameData.barSearchwood= $("#pbSearchwood")[0];
	gameData.barSearchwood.myValue = 0;
	
	// Set default active
	showDomElem($("#pbtnExplore")[0], true);
	showDomElem($("#pbtnEvolve")[0], false);
	showDomElem($("#pbtnSearchwood")[0], false);
	showDomElem($("#pbtnMove")[0], false);
	showDomElem($("#pbtnEatmeat")[0], false);
}

function initGameObjects(){
	gameData.intervalTick = 100;
	gameData.stringCounter = 0;
	gameData.steps = {
		exploreCount: 0,
		explorePrice: 0,
		isEnergyTab: false,
		isWoodButton: false,
		isFirstBerry: false
	};
	gameData.inventory = {};
	gameData.inventory["Berry"] = {
		name: "Berry",
		enabled: false,
		count: 0,
		limit: 20,
		price: [{
			need: [],
			produce: 20,
			button: gameData.btnSearchberry
		}]
	};
	gameData.inventory["Energy"] = {
		name: "Energy",
		enabled: false,
		count: 0,
		limit: 10,
		price: [{
			need: [{
				name: "Berry",
				count: 1 // TEST 10
			}],
			produce: 1,
			button: gameData.btnEatberry
		},{
			need: [{
				name: "Meat",
				count: 1 // TEST 10
			}],
			produce: 5,
			button: gameData.btnEatmeat	
		}]
	};
	gameData.inventory["Wood"] = {
		name: "Wood",
		enabled: false,
		count: 0,
		limit: 10,
		price: [{
			need: [{
				name: "Energy",
				count: 2 // TEST 10
			}],
			produce: 1,
			button: gameData.btnSearchwood
		}]
	};
	gameData.inventory["Stone"] = {
		name: "Wood",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["Club"] = {
		name: "Wooden Club",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["Meat"] = {
		name: "Meat",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["Bone"] = {
		name: "Bone",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["Blood"] = {
		name: "Blood",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["Tendril"] = {
		name: "Tendril",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["Paleo"] = {
		name: "Paleolithic",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["Leather"] = {
		name: "Leather",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["Spear"] = {
		name: "Spear",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["Sling"] = {
		name: "Sling",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["BSpear"] = {
		name: "Bone Spear",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["Water"] = {
		name: "Water",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["Mud"] = {
		name: "Mud",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["LFlask"] = {
		name: "Leather Flask",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["Salt"] = {
		name: "Salt",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["Fire"] = {
		name: "Fire",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["RMeat"] = {
		name: "Roast Meat",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["Soup"] = {
		name: "Soup",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["Flute"] = {
		name: "Flute",
		enabled: false,
		count: 0,
		limit: 10
	};
	gameData.inventory["Feather"] = {
		name: "Feather",
		enabled: false,
		count: 0,
		limit: 10
	};
}

//////////////////////////////////////
/////    Button click events    //////
//////////////////////////////////////
function clickExplore(){
	gameData.inventory["Energy"].count -= gameData.steps.explorePrice;
	checkButtonAvailable();
	disableButton(gameData.btnExplore, true);
	gameData.barExplore.intervalId = setInterval(progressOn, gameData.intervalTick, gameData.barExplore, gameData.btnExplore.myDuration, doExplore);
	updateInventory();
}

function clickEvolve(){
	checkButtonAvailable();
	disableButton(gameData.btnEvolve, true);
	gameData.barEvolve.intervalId = setInterval(progressOn, gameData.intervalTick, gameData.barEvolve, 1000, doEvolve);
}

function clickMove(){
	checkButtonAvailable();
	disableButton(gameData.btnMove, true);
	gameData.barMove.intervalId = setInterval(progressOn, gameData.intervalTick, gameData.barMove, 1000, doMove);
}

function clickSearchberry(){
	checkButtonAvailable();
	disableButton(gameData.btnSearchberry, true);
	gameData.barSearchberry.intervalId = setInterval(progressOn, gameData.intervalTick, gameData.barSearchberry,
													gameData.btnSearchberry.myDuration, doSearchberry);
	setTimeout(addToInventory, gameData.btnSearchberry.myDuration, gameData.btnSearchberry);
	if (!gameData.steps.isFirstBerry){
		gameData.steps.isFirstBerry = true;
		updateInfo();
	}
}

function clickEatberry(){
	subFromInventory(gameData.btnEatberry);
	checkButtonAvailable();
	disableButton(gameData.btnEatberry, true);
	gameData.barEatberry.intervalId = setInterval(progressOn, gameData.intervalTick, gameData.barEatberry, gameData.btnEatberry.myDuration, doEatberry);
	setTimeout(addToInventory, gameData.btnEatberry.myDuration, gameData.btnEatberry);
}

function clickSearchwood(){
	subFromInventory(gameData.btnSearchwood);
	checkButtonAvailable();
	disableButton(gameData.btnSearchwood, true);
	gameData.barSearchwood.intervalId = setInterval(progressOn, gameData.intervalTick, gameData.barSearchwood,
													gameData.btnSearchwood.myDuration, doSearchwood);
	setTimeout(addToInventory, gameData.btnSearchwood.myDuration, gameData.btnSearchwood);
}

//////////////////////////////////////
/////   Finished button events  //////
//////////////////////////////////////
function doExplore(){
	var btn = gameData.btnExplore;
	if (gameData.steps.exploreCount == 0){
		btn.myDuration = 1000;
		updateInfo();
	} else if (gameData.steps.exploreCount == 1){
		btn.myDuration = 1000;
		updateInfo();
	} else if (gameData.steps.exploreCount == 2){
		btn.myDuration = 2000;
		gameData.steps.explorePrice = 5;
		updateInfo();
		gameData.inventory["Berry"].enabled = true;
		showDomElem($("#liGather")[0], true);
		showDomElem($("#pbtnSearchberry")[0], true);
		updateInventory();
	} else if (gameData.steps.exploreCount == 3){
		btn.myDuration = 2000;
		updateInfo();
		
	}
	gameData.steps.exploreCount++;
	checkButtonAvailable();
}

function doEvolve(){
	disableButton(gameData.btnEvolve, false);
}

function doMove(){
	disableButton(gameData.btnMove, false);
}

function doSearchberry(){
	if (!gameData.steps.isEnergyTab && checkItemAvailable(gameData.inventory["Energy"])){
		showDomElem($("#liEnergy")[0], true);
		gameData.steps.isEnergyTab = true;
		gameData.inventory["Energy"].enabled = true;
	}
	checkButtonAvailable();
	updateInventory();
}

function doEatberry(){
	if (!gameData.steps.isWoodButton && checkItemAvailable(gameData.inventory["Wood"])){
		showDomElem($("#pbtnSearchwood")[0], true);
		gameData.steps.isWoodButton = true;
		gameData.inventory["Wood"].enabled = true;
	}
	checkButtonAvailable();
	updateInventory();
}

function doSearchwood(){
	checkButtonAvailable();
	updateInventory();
}

//////////////////////////////////////
/////      Common functions     //////
//////////////////////////////////////

// Disable/enable buttons
function disableButton(btn, disable){
	if (disable){
		btn.disabled = true;
		btn.className = "btnStyleDisabled";
	}
	else{
		btn.disabled = false;
		btn.className = "btnStyle";
	}
}

// Show/hide html divs
function showDomElem(elem, show){
	if (show){
		elem.style.display = "block";
	}
	else{
		elem.style.display = "none";
	}
}

// Returns the String form of an item
function itemToString(item){
	return item.name + ": " + item.count + "/" + item.limit;
}

// Increases the count of the item with the produced value
function addToInventory(button){
	var key, i;
	for (key in gameData.inventory){
		item = gameData.inventory[key];
		if (item.enabled){
			for (i = 0; i < item.price.length; i++){
				if (item.price[i].button == button){
					item.count += item.price[i].produce;
				}
			}
		}
	}
	updateInventory();
}

// Reduces ammount in regards the prices
function subFromInventory(button){
	var key, i, j;
	for (key in gameData.inventory){
		item = gameData.inventory[key];
		if (item.enabled){
			for (i = 0; i < item.price.length; i++){
				if (item.price[i].button == button){
					for (j = 0; j < item.price[i].need.length; j++){
						gameData.inventory[item.price[i].need[j].name].count -= item.price[i].need[j].count;
					}
				}
			}
		}
	}
	updateInventory();
}

// Checks if item available
function checkItemAvailable(item){
	var i, j, isAvailable;
	for (i = 0; i < item.price.length; i++){
		isAvailable = true;
		for (j = 0; j < item.price[i].need.length; j++){
			if (gameData.inventory[item.price[i].need[j].name].count < item.price[i].need[j].count){
				isAvailable = false;
			}
		}
		if (isAvailable){
			return true;
		}
	}
	return false;
}

// Enables buttons if possible
function checkButtonAvailable(){
	var key, i, j, isAvailable;
	for (key in gameData.inventory){
		item = gameData.inventory[key];
		if (item.enabled && item.count < item.limit){
			for (i = 0; i < item.price.length; i++){
				isAvailable = true;
				for (j = 0; j < item.price[i].need.length; j++){
					if (gameData.inventory[item.price[i].need[j].name].count < item.price[i].need[j].count){
						isAvailable = false;
					}
				}
				disableButton(item.price[i].button, !isAvailable);
			}
		}
	}
	disableButton(gameData.btnExplore, gameData.steps.explorePrice > gameData.inventory["Energy"].count);
}

// Updates the inventory
function updateInventory(){
	var invText = "";
	for (var key in gameData.inventory){
		if (gameData.inventory[key].enabled){
			invText += itemToString(gameData.inventory[key]) + "<br>";
		}
	}
	gameData.inventoryTab.innerHTML = invText;
}

// Adds gameString to the info panel with specified index, color can be "simple", "bold", "alert"
function updateInfo(index, color){
	var log = gameData.gameStringList[index];
	var logHtml = "<p class=\"" + color + "\">" + log + "</p>";
	gameData.infoTab.innerHTML = logHtml + gameData.infoTab.innerHTML;
}

// Adds gameString to the info panel, uses next from the story
function updateInfo(){
	var color = "bold";
	var log = gameData.gameStringList[gameData.stringCounter++];
	var logHtml = "<p class=\"" + color + "\">" + log + "</p>";
	gameData.infoTab.innerHTML = logHtml + gameData.infoTab.innerHTML;
}

// Progress bar setter
function progressOn(bar, timeout, doAction){
	bar.myValue += gameData.intervalTick;
	if (bar.myValue > timeout){
		bar.myValue = 0;
		clearInterval(bar.intervalId);
		doAction();
	}
	bar.style.width = "" + bar.myValue / timeout * 100 + "%";
}

// Open tabs
function openTab(evt, tabName){
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for(i = 0; i < tabcontent.length; i++){
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for(i = 0; i < tablinks.length; i++){
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}


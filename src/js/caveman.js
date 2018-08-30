//////////////////////////////////////
/////       Declarations        //////
//////////////////////////////////////
function Layout(){
	var tabs = {};
	var btns = {};
	var interval = 25;
	var elTabHeader = document.getElementById("gameTabs");
	var elTabContent = document.getElementById("game");
	var activeTab = "";
	this.createLayout = function(config){
		for (tab in config.tabs){
			tabs[config.tabs[tab].name] = new Tab(config.tabs[tab]);
			tabs[config.tabs[tab].name].appendTo(elTabHeader, elTabContent);
			for (btn in config.tabs[tab].buttons){
				btns[config.tabs[tab].buttons[btn].name] = new ProgressButton(
					config.tabs[tab].buttons[btn],
					tabs[config.tabs[tab].name]);
			}
		}
	};
	this.revealTab = function(tabName, activate = false){
		tabs[tabName].revealHeader();
		if (activate){
			this.tabClick(tabName);
		}
	};
	this.revealButton = function(btnName){
		btns[btnName].revealButton();
	};
	this.updateButton = function(btnUpdate){
		btns[btnUpdate.name].updateParameters(btnUpdate);
	};
	this.enableButton = function(btnName){
		btns[btnName].enableButton();
	};
	this.tabClick = function(tabName){
		if (activeTab === tabName){
			return;
		}
		if (activeTab !== ""){
			tabs[activeTab].deactivate();
		}
		activeTab = tabName;
		tabs[activeTab].activate();
	};
	this.buttonClick = function(btnName){
		var btn = btns[btnName];
		var layout = engine.getLayout();
		// TODO: remove time manipulation
		var handler = setInterval(layout.doProgress, interval*0.05, btn);
		btn.startProgress(handler);
	};
	this.setHint = function(hint){
		var btn = btns["Explore"];
		btn.setHint(hint);
	};
	this.doProgress = function(btn){
		if (btn.isReady(interval)){
			clearInterval(btn.finishProgress());
		}
	};
	this.updateStatus = function(){
		for (i in btns){
			btns[i].updateStatus();
		}
	};
	// TODO: Remove debug feature
	this.debug = function(){
		return {tabs: tabs, buttons:btns};
	};
}

function Information(){
	var elInfo = document.getElementById("info");
	this.logInformation = function(message, style){
		if (elInfo.firstChild !== null && elInfo.firstChild.innerHTML.includes(message)){
			if (elInfo.firstChild.innerHTML.includes(message + ' x')){
				var parts = elInfo.firstChild.innerHTML.split(' x');
				var num = parseInt(parts[parts.length-1]) + 1;
				elInfo.firstChild.innerHTML = message + " x" + num;
			}
			else{
				elInfo.firstChild.innerHTML += " x2";
			}
		}
		else {
			var p = document.createElement("p");
			p.innerHTML = message;
			p.setAttribute("class", style);
			elInfo.insertBefore(p, elInfo.firstChild);
			if (elInfo.childElementCount > 50){
				elInfo.removeChild(elInfo.lastChild);
			}
		}
	};
}

function Tab(config){
	var tabName = config.name;
	var isVisible = false;
	var tabLink = document.createElement("a");
	var tabHeader = document.createElement("li");
	var tabContent = document.createElement("div");
	tabLink.setAttribute("href", "#");
	tabLink.setAttribute("class", "tablinks");
	tabLink.innerHTML = tabName;
	tabLink.onclick = function(){engine.getLayout().tabClick(this.innerHTML);};
	tabHeader.appendChild(tabLink);
	tabHeader.style.display = "none";
	tabContent.setAttribute("class", "tabcontent");
	tabContent.style.display = "none";
	this.getName = function(){
		return tabName;
	};
	this.revealHeader = function(){
		tabHeader.style.display = "block";
	};
	this.activate = function(){
		tabContent.style.display = "block";
		tabLink.setAttribute("class", "active");
	};
	this.deactivate = function(){
		tabContent.style.display = "none";
		tabLink.setAttribute("class", "");
	};
	this.appendTo = function(parentHeader, parentContent){
		parentHeader.appendChild(tabHeader);
		parentContent.appendChild(tabContent);
	};
	this.appendAction = function(actionBtn){
		tabContent.appendChild(actionBtn);
	}
}

function ProgressButton(btnConfig, _tab){
	// Properties
	var tab = _tab;
	var enabled = false;
	var isVisible = false;
	var btnParams = btnConfig;
	// Doms
	var content = document.createElement("div");
	var btn = document.createElement("button");
	var pBarContent = document.createElement("div");
	var pBar = document.createElement("span");
	// Animation related
	var handler = null;
	var progress = 0;
	var inProgress = false;
	pBar.style.width = "0%";
	pBarContent.setAttribute("class", "progressBar");
	pBarContent.appendChild(pBar);
	btn.setAttribute("type", "button");
	btn.setAttribute("class", "btnStyle");
	btn.title = btnParams.hint;
	btn.innerHTML = btnParams.name;
	btn.onclick = function(){engine.getLayout().buttonClick(this.innerHTML);};
	content.setAttribute("class", "progressButton");
	content.appendChild(btn);
	content.appendChild(pBarContent);
	content.style.display = "none";
	tab.appendAction(content);
	this.revealButton = function(){
		enabled = true;
		this.isVisible = true;
		content.style.display = "block";
	};
	this.enableButton = function(){
		enabled = true;
	};
	this.setHint = function(hint){
		btn.title = hint;
	};
	this.updateParameters = function(btnUpdate){
		for (var attr in btnUpdate){
			btnParams[attr] = btnUpdate[attr];
		}
		btn.title = btnParams.hint;
	};
	this.updateStatus = function(){
		if (!enabled || inProgress){
			return;
		}
		var inventory = engine.getInventory();
		var fulfillNeeds = true;
		for (i in btnParams.needs){
			if (!inventory.canFulfillNeed(btnParams.needs[i].item, btnParams.needs[i].amount)){
				fulfillNeeds = false;
			}
		}
		var canProduce = btnParams.produces.length == 0;
		for (i in btnParams.produces){
			if (inventory.canProduceMore(btnParams.produces[i].item)){
				canProduce = true;
			}
		}
		if (canProduce && fulfillNeeds){
			if (!isVisible){
				isVisible = true;
				content.style.display = "block";
				engine.getLayout().revealTab(tab.getName());
			}
			btn.disabled = false;
			btn.setAttribute("class", "btnStyle");
		}else{			
			btn.disabled = true;
			btn.setAttribute("class", "btnStyleDisabled");
		}
	};
	this.startProgress = function(_handler){
		var inventory = engine.getInventory();
		if (btnParams.name === "Explore") {
			engine.startExplore();
		}
		inProgress = true;
		for (i in btnParams.needs){
			inventory.decreaseItem(btnParams.needs[i].item, btnParams.needs[i].amount);
		}
		inventory.updateInventory();
		handler = _handler;
		progress = 0;
		btn.disabled = true;
		btn.setAttribute("class", "btnStyleDisabled");
	};
	this.isReady = function(interval){
		progress += interval;
		pBar.style.width = "" + (progress / btnParams.time * 100) + "%";
		if (progress > btnParams.time){
			return true;
		}
		return false;
	};
	this.finishProgress = function(){
		var inventory = engine.getInventory();
		inProgress = false;
		for (i in btnParams.produces){
			inventory.increaseItem(btnParams.produces[i].item, btnParams.produces[i].amount);
			var info = "You have produced " + btnParams.produces[i].amount + " " + btnParams.produces[i].item + ".";
			engine.getInformation().logInformation(info, "simple");
		}
		if (btnParams.name === "Explore") {
			engine.finishExplore();
		}
		inventory.updateInventory();
		pBar.style.width = "0%";
		return handler;
	};
}

function Inventory(){
	var elInventory = document.getElementById("inventory");
	var inventory = {
		'Berry':  		{amount: 0, max: 10, enabled: false},
		'Energy': 		{amount: 0, max: 10, enabled: false},
		'Wood':   		{amount: 0, max: 10, enabled: false},
		'Stone':  		{amount: 0, max: 10, enabled: false},
		'Leaf':   		{amount: 0, max: 10, enabled: false},
		'Rope':   		{amount: 0, max: 10, enabled: false},
		'Poor Axe': 	{amount: 0, max:  2, enabled: false},
		'Fire':			{amount: 0, max:  1, enabled: false},
		'Clue':			{amount: 0, max: 10, enabled: false}
	};
	this.updateItem = function(item){
		for (var attr in item){
			if (attr !== "name"){
				inventory[item.name][attr] = item[attr];
			}
		}
	}
	this.increaseItem = function(item, amount){
		inventory[item].amount = Math.min(inventory[item].max, inventory[item].amount + amount);
	};
	this.decreaseItem = function(item, amount){
		inventory[item].amount = Math.max(0, inventory[item].amount - amount);
	};
	this.canFulfillNeed = function(item, amount){
		return inventory[item].amount >= amount;
	};
	this.canProduceMore = function(item){
		return inventory[item].amount < inventory[item].max;
	};
	this.updateInventory = function(){
		var invText = "";
		for (var item in inventory){
			if (inventory[item].enabled){
				invText += item + ": " + inventory[item].amount + "/" + inventory[item].max + "<br>";
			}
		}
		elInventory.innerHTML = invText;
		engine.getLayout().updateStatus();
	};
}

function Engine(){
	var config = {
		tabs: [
		{
			name: "World",
			buttons: [
			{
				name: "Explore",
				hint: "Start your journey",
				time: 1000,
				needs: [],
				produces: []
			}
			]
		},{
			name: "Gather",
			buttons: [
			{
				name: "Search berry",
				hint: "Produce 1 berry",
				time: 1000,
				needs: [],
				produces: [{amount:1, item:"Berry"}]
			},{
				name: "Search 10 berries",
				hint: "Produce 10 berries",
				time: 10000,
				needs: [{amount:5, item:"Energy"}],
				produces: [{amount:10, item:"Berry"}]
			},{
				name: "Search wood",
				hint: "Gather 1 wood",
				time: 2000,
				needs: [{amount:1, item:"Energy"}],
				produces: [{amount:1, item:"Wood"}]
			},{
				name: "Search stone",
				hint: "Gather 1 stone",
				time: 3000,
				needs: [{amount:5, item:"Energy"}],
				produces: [{amount:1, item:"Stone"}]
			},{
				name: "Search leaf",
				hint: "Gather 1 leaf",
				time: 1000,
				needs: [{amount:5, item:"Energy"}],
				produces: [{amount:1, item:"Leaf"}]
			},{
				name: "Search clue",
				hint: "Gather 1 clue",
				time: 2000,
				needs: [{amount:5, item:"Energy"}],
				produces: [{amount:1, item:"Clue"}]
			}]
		},{
			name: "Energy",
			buttons: [
			{
				name: "Eat berry",
				hint: "Eat 1 berry for 1 energy",
				time: 500,
				needs: [{amount:1, item:"Berry"}],
				produces: [{amount:1, item:"Energy"}]
			},{
				name: "Eat berries",
				hint: "Eat 10 berries for 10 energy",
				time: 500,
				needs: [{amount:10, item:"Berry"}],
				produces: [{amount:10, item:"Energy"}]
			}]
		},{
			name: "Craft",
			buttons: [
			{
				name: "Craft rope",
				hint: "?",
				time: 2000,
				needs: [{amount:1, item:"Energy"}, {amount:1, item:"Leaf"}],
				//TODO: 10-10
				produces: [{amount:1, item:"Rope"}]
			},{
				name: "Craft poor axe",
				hint: "?",
				time: 2000,
				needs: [{amount:1, item:"Energy"}, {amount:1, item:"Rope"}, {amount:1, item:"Stone"}, {amount:1, item:"Wood"}],
				//TODO: 1
				produces: [{amount:1, item:"Poor Axe"}]
			}]
		}/*,{
			name: "Hunting",
			buttons: [
			{
				name: "Craft rope",
				hint: "?",
				time: 2000,
				needs: [{amount:10, item:"Energy"}, {amount:10, item:"Leaf"}],
				produces: [{amount:1, item:"Rope"}]
			},{
				name: "Craft poor axe",
				hint: "?",
				time: 2000,
				needs: [{amount:10, item:"Energy"}, {amount:1, item:"Rope"}, {amount:1, item:"Stone"}, {amount:1, item:"Wood"}],
				produces: [{amount:1, item:"Poor Axe"}]
			}]
		}*/
		]
	};
	var levels = {
		1: {
			exploreBeginMsg: "Samu took his first steps.",
			exploreEndMsg: "He realized it is just the beginning of a long journey!",
			updateButtons:[{name: "Explore", time: "4000", hint: ""}],
			nextLevel:3
		},
		3: {
			exploreBeginMsg: "Samu started to feel hungry.",
			exploreEndMsg: "Finally, he found a bush full of tasty looking berries.",
			updateItems:[{name: "Berry", enabled: true}],
			enableButtons:["Search berry"],
			updateButtons:[{name: "Explore", time: "8000", needs:[{amount:5, item:"Berry"}]}],
			nextLevel:4
		},
		4: {
			exploreBeginMsg: "He felt strange, like he does the same thing over and over again.",
			exploreEndMsg: "Yes - he realized - I am in an incomplete game. Damn it urghghghgh.",
			updateButtons:[{name: "Explore", time: "12000", needs:[{amount:10, item:"Energy"}], hint: "A lot of Energies needed"}],
			updateItems:[{name: "Berry", max: 50}, {name: "Wood", enabled: true}, {name: "Energy", enabled: true}],
			enableButtons:["Search wood", "Eat berry", "Search 10 berries"],
			nextLevel:5
		},
		5: {
			exploreBeginMsg: "?",
			exploreEndMsg: "?",
			updateButtons:[{name: "Explore", time: "16000", needs: [{amount:2, item:"Stone"}, {amount: 2, item:"Leaf"}, {amount: 5, item:"Wood"},
				{amount:10, item:"Energy"}],
				produces: [{amount: 1, item: "Fire"}], hint: "2 Stones, 2 Leaves, 5 Woods needed for make a fire and be able to see in the Dark Woods"}],
			updateItems:[{name: "Stone", enabled: true}, {name: "Leaf", enabled: true}],
			enableButtons:["Search stone", "Search leaf"],
			nextLevel:6
		},
		6: {
			exploreBeginMsg: "?",
			exploreEndMsg: "?",
			updateButtons:[{name: "Explore", time: "20000", needs: [{amount:1, item:"Poor Axe"}], produces: [], hint: "Craft a Poor Axe to go deeper in to the woods"}],
			updateItems:[{name: "Poor Axe", enabled: true}, {name: "Rope", enabled: true}, {name: "Fire", enabled: true}],
			enableButtons:["Craft poor axe", "Craft rope"],
			nextLevel:7
		},
		7: {
			exploreBeginMsg: "?",
			exploreEndMsg: "?",
			updateButtons:[{name: "Explore", time: "30000", needs: [{amount:5, item:"Clue"}, {amount:25, item:"Energy"}], hint: "Get 5 animal Clues and 25 Energies"}],
			updateItems:[{name: "Energy", max: 50}, {name: "Clue", enabled: true}],
			enableButtons:["Eat berries", "Search clue"],
			nextLevel:8
		},
		8: {
			exploreBeginMsg: "?",
			exploreEndMsg: "?",
			updateButtons:[{name: "Explore", time: "50000", needs: [{amount:2, item:"Poor Axe"}], hint: "Craft 2 Poor Axes to go deeper in to the woods"}],
			updateItems:[{name: "Poor Axe", enabled: true}, {name: "Rope", enabled: true}, {name: "Fire", enabled: true}],
			enableButtons:["Craft poor axe", "Craft rope"],
			nextLevel:9
		}
	};
	var currentLevel = 1;
	var inventory = new Inventory();
	var information = new Information();
	var layout = new Layout();
	this.startGame = function(){
		layout.createLayout(config);
		layout.revealTab("World", true);
		layout.revealButton("Explore");
		information.logInformation("Samu is awaken!", "bold");
	};
	this.startExplore = function(){
		var level = levels[currentLevel];
		information.logInformation(level.exploreBeginMsg, "bold");
	};
	this.finishExplore = function(){
		var level = levels[currentLevel];
		information.logInformation(level.exploreEndMsg, "bold");
		layout.setHint(level.exploreHint);
		if (level.updateButtons !== undefined){
			for (var i in level.updateButtons){
				layout.updateButton(level.updateButtons[i]);
			}
		}
		if (level.enableButtons !== undefined){
			for (var i in level.enableButtons){
				layout.enableButton(level.enableButtons[i]);
			}
		}
		if (level.updateItems !== undefined){
			for (var i in level.updateItems){
				inventory.updateItem(level.updateItems[i]);
			}
		}
		currentLevel = levels[currentLevel].nextLevel;
	};
	this.getInventory = function(){
		return inventory;
	};
	this.getLayout = function(){
		return layout;
	};
	this.getInformation = function(){
		return information;
	};
	// TODO: remove debug function
	this.setLevel = function(newLevel){
		var levelExists = false;
		for (var i in levels){
			if (levels[i].nextLevel == newLevel){
				levelExists = true;
				break;
			}
		}
		if (levelExists) {
			while(currentLevel!=newLevel){
				this.startExplore();
				this.finishExplore();
			}
			inventory.updateInventory();
			layout.updateStatus();
		}
			
	}
}

//////////////////////////////////////
/////      Initialization       //////
//////////////////////////////////////
// TODO: Remove debug feauture
var debug;
var engine;
$(function(){
	engine = new Engine();
	engine.startGame();
})
//TODO: ismétlődő tevékenység egyszerűsítése x15 pl
//TODO: SKILL OPTION


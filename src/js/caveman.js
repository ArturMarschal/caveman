//////////////////////////////////////
/////       Declarations        //////
//////////////////////////////////////
function Layout(){
	var tabs = {};
	var btns = {};
	var interval = 25;
	var elTabHeader = document.getElementById("gameTabs");
	var elTabContent = document.getElementById("game");
	var elInfo = document.getElementById("info");
	var activeTab = "";
	this.createLayout = function(config){
		for (tab in config.tabs){
			tabs[config.tabs[tab].name] = new Tab(config.tabs[tab]);
			for (btn in config.tabs[tab].buttons){
				btns[config.tabs[tab].buttons[btn].name] = new ProgressButton(
					config.tabs[tab].buttons[btn],
					tabs[config.tabs[tab].name]);
			}
		}
	};
	this.revealTab = function(tabName, activate = false){
		if (activate){
			this.tabClick(tabName);
		}
		tabs[tabName].appendTo(elTabHeader, elTabContent);
	};
	this.revealButton = function(btnName){
		btns[btnName].revealButton();
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
		var handler = setInterval(layout.doProgress, interval, btn);
		btn.startProgress(handler);
	};
	this.doProgress = function(btn){
		if (btn.isReady(interval)){
			clearInterval(btn.finishProgress());
		}
	};
	this.updateStatus = function(){
		for (i in btns){
			if (btns[i].isVisible){
				btns[i].updateStatus();
			}
		}
	};
	this.debug = function(){
		return {tabs: tabs, buttons:btns};
	};
}

function Tab(config){
	var tabName = config.name;
	var tabLink = document.createElement("a");
	var tabHeader = document.createElement("li");
	var tabContent = document.createElement("div");
	tabLink.setAttribute("href", "#");
	tabLink.setAttribute("class", "tablinks");
	tabLink.innerHTML = tabName;
	tabLink.onclick = function(){layout.tabClick(this.innerHTML);};
	tabHeader.appendChild(tabLink);
	tabContent.setAttribute("class", "tabcontent");
	tabContent.style.display = "none";
	this.activate = function(){
		tabContent.style.display = "block";
		tabLink.setAttribute("class", "tablinks active");
	};
	this.deactivate = function(){
		tabContent.style.display = "none";
		tabLink.setAttribute("class", "tablinks");
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
	var name = btnConfig.name;
	var maxTime = btnConfig.time;
	var needs = btnConfig.needs;
	var produces = btnConfig.produces;
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
	btn.innerHTML = name;
	btn.onclick = function(){layout.buttonClick(this.innerHTML);};
	content.setAttribute("class", "progressButton");
	content.appendChild(btn);
	content.appendChild(pBarContent);
	this.isVisible = false;
	this.revealButton = function(){
		this.isVisible = true;
		tab.appendAction(content);
	};
	this.updateStatus = function(){
		if (inProgress){
			return;
		}
		var fulfillNeeds = true;
		for (i in needs){
			if (!inventory.canFulfillNeed(needs[i].item, needs[i].amount)){
				fulfillNeeds = false;
			}
		}
		var canProduce = produces.length == 0;
		for (i in produces){
			if (inventory.canProduceMore(produces[i].item)){
				canProduce = true;
			}
		}
		if (canProduce && fulfillNeeds){
			btn.disabled = false;
			btn.setAttribute("class", "btnStyle");
		}else{			
			btn.disabled = true;
			btn.setAttribute("class", "btnStyleDisabled");
		}
	};
	this.startProgress = function(_handler){
		inProgress = true;
		for (i in needs){
			inventory.decreaseItem(needs[i].item, needs[i].amount);
		}
		inventory.updateInventory();
		handler = _handler;
		progress = 0;
		btn.disabled = true;
		btn.setAttribute("class", "btnStyleDisabled");
	};
	this.isReady = function(interval){
		progress += interval;
		pBar.style.width = "" + (progress / maxTime * 100) + "%";
		if (progress > maxTime){
			return true;
		}
		return false;
	};
	this.finishProgress = function(){
		inProgress = false;
		for (i in produces){
			inventory.increaseItem(produces[i].item, produces[i].amount);
		}
		inventory.updateInventory();
		pBar.style.width = "0%";
		return handler;
	};
}

function Inventory(){
	var elInventory = document.getElementById("inventory");
	var inventory = {
		Level:  {amount: 0, max:100, enabled: true},
		Berry:  {amount: 0, max:100, enabled: true},
		Energy: {amount: 10, max:100, enabled: true},
		Wood:   {amount: 0, max:100, enabled: true}
	};
	this.increaseItem = function(item, amount){
		inventory[item].amount = Math.min(inventory[item].max, inventory[item].amount + amount);
	};
	this.decreaseItem = function(item, amount){
		inventory[item].amount -= amount;
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
		layout.updateStatus();
	};
}

function GameConfig(){
	var config = {
		tabs: [
		{
			name: "World",
			buttons: [
			{
				name: "Explore",
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
				time: 1000,
				needs: [],
				produces: [{amount:1, item:"Berry"}]
			},{
				name: "Search wood",
				time: 2000,
				needs: [{amount:1, item:"Energy"}],
				produces: [{amount:1, item:"Wood"}]
			}
			]
		}
		]
	};
	this.getConfig = function(){
		return config;
	};
}

var layout;
var config = new GameConfig();
var debug;
var inventory;
$(function(){
	inventory = new Inventory();
	layout = new Layout();
	layout.createLayout(config.getConfig());
	debug = layout.debug();
	layout.revealTab("World", true);
	layout.revealTab("Gather");
	layout.revealButton("Search wood");
	layout.revealButton("Search berry");
	layout.revealButton("Explore");
})
//////////////////////////////////////
/////      Initialization       //////
//////////////////////////////////////





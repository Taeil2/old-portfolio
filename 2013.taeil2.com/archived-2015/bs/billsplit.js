/* Initialize variables */

var numPeople = 1; // number of ppl
var pplImg = []; // holds the image filename
var pplItems = []; // how many items does each person have?
var pplItemPrices = []; // cost of items
var pplSharedItemPrices = []; // shared items per person
var sharedItems = []; // shared items (cost and people. SEE SHAREDOBJECT)
var sharedItemID = 0; // gives each shared item a new ID
var sharedItemCounter = 0; // keep track of shared items
var jqDumb1 = 0; // jquery mobile has inconsistent behavior. This helps keep track of what kind of behavior it's going to have.
var jqDumb2 = 0;
var showShared = 0;
var subtotal = 0;
var tax = 0;
var taxPercent = 8;
var totalWoTip = 0;
var tip = 0;
var tipPercent = 18;
var totalWTip = 0;
var subtotals = []; // arrays for each person
var taxes = [];
var tips = [];
var totals = [];



/* document functions */

$(document).ready(function(){
	// hide all but first person
  for (var i=2; i < 9; i++){
		var pplNumber = "#ppl"+i;
		$(pplNumber).hide();
	}

});

$(document).on({ // Rounds all dollar amounts to 2 decimal places
  'blur': function () {
    var num = parseFloat($(this).val());
	  var cleanNum = num.toFixed(2);
	  $(this).val(cleanNum);
  }
}, 'input');

/* Party Size Page */

function perUp(){
	if (numPeople==8){
		return;
	}
	numPeople += 1;
	var pplNumber = "#ppl"+numPeople;
	$(pplNumber).show();
	$('#numPplDisplay').html(numPeople);
}

function perDown(){
	if (numPeople==1){
		return;
	}
	var pplNumber = "#ppl"+numPeople;
	$(pplNumber).hide();
	numPeople -= 1;
	$('#numPplDisplay').html(numPeople);
}

/* Item Page */

function toItemPage(){
	$('#pplItems').html(""); //clear people items
	$('#sharedItem1').remove();
	$('#sharedCard').hide();

	for (var i=1; i<numPeople+1; i++){
		pplImg[i] = i+"-"+Math.floor((Math.random()*1)+1); // times 2 for number of images available
		pplItems[i] = 1; // initialize number for pplitems for each person
		if (jqDumb1 == 0){ // jqmobile is dumb.
			$('#pplItems').append('<fieldset class="container_16 card" id="card'+i+'"><div class="grid_3"><div class="iconContainer"><img src="img/'+pplImg[i]+'.png"></div></div><div class="grid_9 items" id="items'+i+'"><div class="item" id="item'+i+'-1"><div class="grid_2 alpha dollarSign">$</div><div class="grid_10 itemInput"><div class="coverLeft"></div><input type="number" id="item'+i+'-1Amount" placeholder="0.00" class="ui-input-text ui-body-c"><div class="coverRight"></div></div><div class="grid_4 omega itemX"><a href="#" class="ui-link" onclick="clearItem('+i+',1)"><i class="fui-cross"></i></a></div></div></div><div class="grid_4"><a href="#" data-role="button" class="btn addItem ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" id="addItemButton'+i+'" onclick="addItem('+i+')" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c"><span class="ui-btn-inner"><span class="ui-btn-text">Add<br>Item</span></span></a></div></fieldset>');
		}
		else{
			$('#pplItems').append('<fieldset class="container_16 card" id="card'+i+'"><div class="grid_3"><div class="iconContainer"><img src="img/'+pplImg[i]+'.png"></div></div><div class="grid_9 items" id="items'+i+'"><div class="item" id="item'+i+'-1"><div class="grid_2 alpha dollarSign">$</div><div class="grid_10 itemInput"><div class="coverLeft"></div><div class="ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow ui-body-c"><input type="number" id="item'+i+'-1Amount" placeholder="0.00" class="ui-input-text ui-body-c"></div><div class="coverRight"></div></div><div class="grid_4 omega itemX"><a href="#" class="ui-link" onclick="clearItem('+i+',1)"><i class="fui-cross"></i></a></div></div></div><div class="grid_4"><a href="#" data-role="button" class="btn addItem ui-btn ui-shadow ui-btn-corner-all ui-btn-up-c" id="addItemButton'+i+'" onclick="addItem('+i+')" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c"><span class="ui-btn-inner"><span class="ui-btn-text">Add<br>Item</span></span></a></div></fieldset>');
		}
		// Match add button height to parent div
		// var parentHeight = $('#card'+i).height();
	}
	$(document).on('pageshow','#itemPage' ,function(){    
		for (var i=1; i<numPeople+1; i++){
			var parentHeight = $('#card'+i).height();
			$('#addItemButton'+i).height(parentHeight);
			var spanPadding = (parentHeight-44)/2;
			$('#addItemButton'+i+' .ui-btn-inner').css("padding-top", spanPadding);
		}
	});
	jqDumb1 = 1;
}

function clearItem(p,i){
	var itemID = "#item"+p+'-'+i;
	var inputID = itemID+"Amount";
	if (pplItems[p]==1){ // If there is one item, clear that item
		$(inputID).val("");
	}
	else{
		if (pplItems[p] == i){ // If it is the last item, delete that item
			$(itemID).remove();
		}
		else{ //If it is in the middle, move the values up one and delete the last item
			for (var j=i; j<pplItems[p]; j++){
				var inputID1 = "#item"+p+'-'+j+"Amount";
				var k = j+1;
				var inputID2 = "#item"+p+'-'+k+"Amount";
				$(inputID1).val($(inputID2).val());
			}
			lastItemID = "#item"+p+'-'+pplItems[p];
			$(lastItemID).remove();

		}
		pplItems[p]-=1; // person P has one less item
	}
}

function addItem(p){
	pplItems[p] += 1; // person P has one more item
	var itemsID = "#items"+p;
	$(itemsID).append('<div class="item" id="item'+p+'-'+pplItems[p]+'"><div class="grid_2 alpha dollarSign">$</div><div class="grid_10 itemInput"><div class="coverLeft"></div><div class="ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow ui-body-c"><input type="number" id="item'+p+'-'+pplItems[p]+'Amount" placeholder="0.00" class="ui-input-text ui-body-c"></div><div class="coverRight"></div></div><div class="grid_4 omega itemX"><a href="#" class="ui-link" onclick="clearItem('+p+','+pplItems[p]+')"><i class="fui-cross"></i></a></div></div></div>');
	var parentHeight = $('#card'+p).height();
	$('#addItemButton'+p).height(parentHeight);
	var spanPadding = (parentHeight-44)/2;
	$('#addItemButton'+p+' .ui-btn-inner').css("padding-top", spanPadding);
	
}

// Shared Page functions

function toSharedPage(){
	$('#sharedItem').val(""); // clear item price
	if (jqDumb2 == 0){ // load selectors on the first load
		$('#sharedPpl').html("");
		for (var i=1; i<numPeople+1; i++){
			var sharedRow = Math.floor((i+3)/4);
			var sharedRowID = '#sharedRow'+sharedRow;
			if (i%4==1){ // if it's the first in a row, append fieldset
				$('#sharedPpl').append('<fieldset class="container_12 selectButtons" id="sharedRow'+sharedRow+'"></fieldset>');
			}
			$(sharedRowID).append('<div class="grid_3"><input type="checkbox" name="sharedPplBtns" id="shared'+i+'" value="shared'+i+'" class="inputHidden" onclick="checkShared()"/><label for="shared'+i+'" class="checkboxLabel"><img src="img/'+pplImg[i]+'.png"></label></div>');
		}
	}
	selectNone(); //Clear all checked values
	$("#sharedAddButton").attr("disabled", "disabled");
	jqDumb2 = 1;
}

$('#sharedItem').blur(function() {
  checkShared();
})

// if the shared item is not zero, and at least two ppl are selected, enable add button, else leave disabled
function checkShared(){
	var numChecked = 0;
	for (var i=1; i<numPeople+1; i++){
		var checkboxID = "#shared" + i;
		var checkboxLabel = "label[for=shared"+i+"]";
		if ($(checkboxID).prop("checked") == true){
			numChecked += 1;
		}
	}
	if (numChecked < 2 || $('#sharedItem').val() == 0){
		// disable shared button
		$("#sharedAddButton").attr("disabled", "disabled");
		$("#sharedAddButton").removeAttr("onclick");
	}
	else{
		//enable shared button
		$("#sharedAddButton").removeAttr("disabled");
		$("#sharedAddButton").attr("onclick", "sharedAdd()");
	}
}

function clearShared(){ // X button
	$('#sharedItem').val("");
	checkShared();
}

function selectAll(){
	for (var i=1; i<numPeople+1; i++){
		var checkboxID = "#shared" + i;
		var checkboxLabel = "label[for=shared"+i+"]";
		if ($(checkboxID).prop("checked") == false){
			$(checkboxID).prop("checked",true);
			$(checkboxLabel).toggleClass('ui-checkbox-off ui-checkbox-on');
		}
	}
	checkShared();
}

function selectNone(){
	for (var i=1; i<numPeople+1; i++){
		var checkboxID = "#shared" + i;
		var checkboxLabel = "label[for=shared"+i+"]";
		if ($(checkboxID).prop("checked") == true){
			$(checkboxID).prop("checked",false);
			$(checkboxLabel).toggleClass('ui-checkbox-on ui-checkbox-off');
		}
	}
	checkShared();
}

function sharedAdd(){ // Add the shared item to both the HTML and the object

	if (showShared==0){
		$('#sharedCard').show();
		showShared=1;
	}

	var sharedChecked = [];
	var sharedImgs = "";
	for (var i=1; i<numPeople+1; i++){
		var checkboxID = "#shared" + i;
		if ($(checkboxID).prop("checked") == true){
			sharedChecked.push(i);
			sharedImgs += '<img src="img/'+i+'.png">';
		}
	}

	sharedItemCounter += 1;
	sharedItemID += 1;
	var sharedObject = { //This is what the shareditems look like
		item: $('#sharedItem').val(),
		ppl: sharedChecked,
		id: sharedItemID
	};

	sharedItems.push(sharedObject);

	$('#sharedItems').append('<div class="item" id="sharedItem'+sharedItemID+'"><div class="grid_7 alpha"><p>$'+$('#sharedItem').val()+'</p></div><div class="grid_7 sharedIcons">'+sharedImgs+'</div><div class="grid_2 omega itemX"><a href="#" onclick="clearSharedItem('+sharedItemID+')" class="ui-link"><i class="fui-cross"></i></a></div></div>');

	$.mobile.changePage( "#itemPage", { transition: "fade"});

}

function clearSharedItem(i){
	var sharedItemID2 = "#sharedItem"+i;
	$(sharedItemID2).remove(); //remove from HTML

	for (var j=0; j<sharedItems.length; j++){
		if (sharedItems[j].id == i){
			sharedItems.splice(j,1); //remove from object array
		}
	}
}

// tax and tip Page

function tottPage(){
	// calculate the subtotal and create person items
	for (var i=1; i<numPeople+1; i++){
		var itemPrices = [];
		for (var j=1; j<pplItems[i]+1; j++){
			var itemPriceID = "#item"+i+"-"+j+"Amount";
			var itemPriceNumber = 0;
			// turn empty value into 0
			if ($(itemPriceID).val() == ""){
			}
			else{
				itemPriceNumber = parseFloat($(itemPriceID).val());
			}
			itemPrices.push(itemPriceNumber);
			subtotal += itemPriceNumber;
		}
		pplItemPrices[i] = itemPrices;
	}
	for (var i=0; i<sharedItems.length; i++){
		subtotal += parseFloat(sharedItems[i].item);
	}
	calculateTT();
}

function clearTax(){
	$("#taxAmount").val("");
	tax = 0;
	taxPercent = tax/subtotal*100;
	$("#taxPercent").html(toDollar(taxPercent)+"%");
	calculateTT();
}

function backToItemPage(){
	// 
	subtotal = 0;
	pplItemPrices = [];
}

function calculateTT(){
	// calculate and display ttPage amounts
	$("#subtotal").html(toDollar(subtotal));
	tax = subtotal*taxPercent/100;
	$("#taxAmount").val(toDollar(tax));
	totalWoTip = subtotal+tax;
	$("#totalWoTip").html(toDollar(totalWoTip));
	tip = subtotal*tipPercent/100;
	$("#tip").html(toDollar(tip));
	totalWTip = totalWoTip+tip;
	$("#total").html(toDollar(totalWTip));
}

function taxPer(n){
	if (n == 1){
		taxPercent += 0.25;
	}
	else{
		taxPercent -= 0.25;
	}
	$("#taxPercent").html(toDollar(taxPercent)+"%");
	tax = subtotal*taxPercent;
	calculateTT();
}

$("#taxAmount").on('blur', function(){
	tax = $("#taxAmount").val();
	taxPercent = tax/subtotal*100;
	$("#taxPercent").html(toDollar(taxPercent)+"%");
	calculateTT();
});

function tipPer(n){
	if (n == 1){
		tipPercent += 1;
	}
	else{
		tipPercent -= 1;
	}
	$("#tipPercent").html(tipPercent+"%");
	tip = subtotal*tipPercent;
	calculateTT();
}

function toDollar(amount){
	return parseFloat(amount).toFixed(2);
}

// Results Page

function toResultsPage(){
	console.log(sharedItems);
	// figure out individual items
	for (var i=1; i<pplItemPrices.length; i++){
		subtotals[i]=0;
		for (var j=0; j<pplItemPrices[i].length; j++){
			subtotals[i]+=pplItemPrices[i][j];
		}
	}
	console.log(subtotals);
	for (var i=0; i<sharedItems.length; i++){
		for (var j=0; j<sharedItems[i].ppl.length; j++){
			var personNumber = sharedItems[i].ppl[j];
			var perPerson = parseFloat(sharedItems[i].item)/(sharedItems[i].ppl.length);
			subtotals[personNumber]+=perPerson;
		}
		// sharedItems[i].ppl.length is the number of people that shared it
		// sharedItems[i]
	}
	$('#resultCards').html("");
	for (var i=1; i<numPeople+1; i++){
		// math
		var perTax = subtotals[i]*taxPercent/100;
		var perTip = subtotals[i]*tipPercent/100;
		var perTotal = subtotals[i]+perTax+perTip;
		// presentation
		var resultRow = Math.floor((i+3)/4);
		var resultRowID = '#resultRow'+resultRow;
		if (i%4==1){ // if it's the first in a row, append fieldset
			$('#resultCards').append('<fieldset class="container_12 selectButtons" id="resultRow'+resultRow+'"></fieldset>');
		}
		// place card
		$(resultRowID).append('<div class="grid_3"><div class="perResult"><div class="card"><img class="fit" src="img/'+pplImg[i]+'.png"><div id="per'+i+'ResultItems"></div><div id="per'+i+'SharedItems"></div><p class="perSubtotal">'+subtotals[i].toFixed(2)+'</p><p class="perTax">'+perTax.toFixed(2)+'</p><p class="perTip">'+perTip.toFixed(2)+'</p><p class="perTotal">'+perTotal.toFixed(2)+'</p></div></div></div>');
		// insert items
		var perItemsID = "#per"+i+"ResultItems";
		for (var j=0; j<pplItemPrices[i].length; j++){
			$(perItemsID).append('<p class="perItem">'+pplItemPrices[i][j].toFixed(2)+'</p>');
		}
	}
	// insert shared items
	for (var i=0; i<sharedItems.length; i++){
		for (var j=0; j<sharedItems[i].ppl.length; j++){
			var personNumber = sharedItems[i].ppl[j];
			var sharedPersonID = "#per"+personNumber+"SharedItems";
			$(sharedPersonID).append('<p class="perSharedItem">'+sharedItems[i].item+'/'+sharedItems[i].ppl.length+'</p>');
		}
	}
	$('#resultCards').append('<div id="grandTotals"><fieldset class="container_12 card"><div class="grid_4"><h3>Grand Totals</h3></div><div class="grid_4" id="grandTotalsLabels"><p>Subtotal:</p><p>Tax:</p><p>Tip:</p><p class="perTotal">Total:</p></div><div class="grid_4"><p class="perSubtotal">'+subtotal.toFixed(2)+'</p><p class="perTax">'+tax.toFixed(2)+'</p><p class="perTip">'+tip.toFixed(2)+'</p><p class="perTotal">'+toDollar(totalWTip)+'</p></div></fieldset></div>');
}
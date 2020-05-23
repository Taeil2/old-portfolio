/* Initialize variables */

var focusedValue = "";
var focusedPerson = 1;
var focusedItem = 1;
var subtotal = 0;
var numItems = [];
var itemPrices = [];
var shareditems_price = 0; // for calculating subtotal
var number_people;

/* Page Transitions */
function setFocus(){
	document.getElementById("numPeople").select();
	window.top.scrollTo(0, 1);
}
function toItem(){
	$.mobile.changePage( "#itemPage");
	$('#peopleItems').html("");
	focusedValue = "";
	focusedPerson = 1;
	focusedItem = 1;
	// Initialize the number of items
	numItems = new Array(parseInt(numPeople.value));
	itemPrices = new Array(parseInt(numPeople.value));
	for (var i=0;i<numItems.length;i++){
		numItems[i]=1;
		itemPrices[i]=0;
	}
	// Fill in people html
	for (var i=0;i<numPeople.value;i++){
		number_people = numPeople.value;
		var j = i+1;
		$('#peopleItems').append('<div class="person" id="person'+j+'"><div class="personIcon" onclick="personFocus('+j+')"><img src="img/person2.png"><span>'+j+'</span></div><button class="addItemButton" id="addItemButton'+j+'" data-role="none" onclick="addItem('+j+')">Add Item</button><input id="checkbox'+j+'" class="checkboxes" name="" type="checkbox"><div class="personItems" id="per'+j+'items"><div class="itemAndButton" id="itemAndButton'+j+'-1"><a class="deleteButton ui-btn ui-shadow ui-btn-corner-all ui-btn-icon-left ui-btn-up-c" data-role="button" data-icon="delete" onclick="removeItem('+j+',1)" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">&nbsp;</span><span class="ui-icon ui-icon-delete ui-icon-shadow">&nbsp;</span></span></a><div class="itemContainer"><input type="text" class="item ui-input-text ui-body-c ui-corner-all ui-shadow-inset" id="per'+j+'item1" name="per'+j+'item1" value="$0.00" onclick="itemFocus('+j+',1)" readonly="readonly"></div></div></div></div>');
	}
	$("#itemPage").live('pageshow',function(event, ui){
		document.getElementById("per1item1").select();
		// Set keyboard function to right focus
	});

	$(".checkboxes").bind( "change", checkboxChange);



}
function backToPeople(){
	$.mobile.changePage( "#peoplePage");
	$("#peoplePage").live( 'pageshow',function(event, ui){
	  document.getElementById("numPeople").select();
	  focusedValue="";
	});
}
function toTaxTip(){
	$.mobile.changePage( "#taxTipPage");
	focusedValue = "";
	ttFocus = 0;
	$("#taxTipPage").live('pageshow',function(event, ui){
		document.getElementById("tax").select();
	});
}
function backToItem(){
	$.mobile.changePage( "#itemPage");
	focusedValue = "";
	focusedPerson = 1;
	focusedItem = 1;
	$("#itemPage").live('pageshow',function(event, ui){
		document.getElementById("per1item1").select();
	});
}
function backToTaxTip(){
	$.mobile.changePage( "#taxTipPage");
	focusedValue = "";
	ttFocus = 0;
	$("#taxTipPage").live('pageshow',function(event, ui){
		document.getElementById("tax").select();
	});
}
function toResults2(){
	$.mobile.changePage("#simpleResults");
	calculateResults2();
}
function toResults(){
	$.mobile.changePage("#resultsPage");
	calculateResults();
}

/* Numpad Functions for People Page */

/* Adds number */
function btnPressedppl(key){
	focusedValue = focusedValue + key.toString();
	document.getElementById("numPeople").value = focusedValue;
}

/* Deletes a character */
function btnPressedDelppl(){
	if (focusedValue.length == 1){
		focusedValue = "";
	}
	else{
		focusedValue = focusedValue.substring(0, focusedValue.length - 1);
	}
	document.getElementById("numPeople").value = focusedValue;
}

/* Numpad Functions for the peopleItems Page */

/* Initialize variables */
var focusedPerMod = 0;

/* Adds number to the focused field */
function btnPressed(key){
	focusedValue = focusedValue + key.toString();
	document.getElementById("per"+focusedPerson+"item"+focusedItem).value = "$" + focusedValue;
}

/* Deletes a character */
function btnPressedDel(){
	if (focusedValue.length == 1){
		focusedValue = "";
	}
	else{
		focusedValue = focusedValue.substring(0, focusedValue.length - 1);
	}
	document.getElementById("per"+focusedPerson+"item"+focusedItem).value = "$" + focusedValue;
}

function personFocus(n){
	document.getElementById("per"+n+"item1").select();
	focusedValue = "";
	focusedPerson = n;
	focusedItem = 1;

}
function itemFocus(p,n){
	document.getElementById("per"+p+"item"+n).select();
	focusedValue = "";
	focusedPerson = p;
	focusedItem = n;
	console.log("Item focus: Person:"+p+" Item: "+n);
}

function removeItem(p,n){
	console.log("remove item called on person/item: " + p + "/"+ n);
	var number_existing_items;

	if (p == 0){
		number_existing_items = $('#per0items').children('.shareditem').length;
	}
	else{
		number_existing_items = numItems[p-1];
	}

	// if there is one item, zero that item
	if (number_existing_items == 1){
		document.getElementById("per"+p+"item1").value = "$0.00";
		focusedItem=1;
		document.getElementById("per"+p+"item1").select();
	}
	else{
		// if the item is the last one, remove that item
		if (n==number_existing_items){
			$('#itemAndButton'+p+"-"+n).remove();
			focusedItem = n-1;
			document.getElementById("per"+p+"item"+focusedItem).select();
		}
		// else, transfer values up and remove the last item
		else{
			for (var i=0;i<number_existing_items-n;i++){
				var j=i+n;
				var k=j+1;

				$("#per"+p+"item"+j).val($("#per"+p+"item"+k).val());
				console.log($("#per"+p+"item"+k).val());
			}
			$('#itemAndButton'+p+"-"+number_existing_items).remove();
			focusedItem = n;
			document.getElementById("per"+p+"item"+n).select();
		}
		numItems[p-1] -= 1;
		// hack: set item button lower than it should be, then bring it back up to the parent height
		var parentHeight = $('#person'+p).height();
		$('#addItemButton'+p).height(parentHeight-60);
		var parentHeight = $('#person'+p).height();
		$('#addItemButton'+p).height(parentHeight);
	}
	focusedPerson=p;
	focusedValue="";
}

function removeSharedItem(n){
	var remove_price = $('#per0item'+n).val();
	var number_existing_items = $('#per0items').children('.shareditem').length;
	shareditems_price -= parseFloat(remove_price.replace(/\$/g, ''));

	// if there's more than 1 item and it's not the last item, shift everything after the item up. Remove the last item.
	if (n < number_existing_items){
		for (var i = n+1; i < number_existing_items - 1; i++){
			$('#per0item'+i).attr("value", $('#per0item'+i+1));
		}

		$('#itemAndButton0-'+number_existing_items).remove();
	}
	// if n is the last item, remove the item
	// if n == 1, then remove the item
	else {
		$('#itemAndButton0-'+n).remove();
	}
	$('.shared_item_'+n).remove();

	console.log("Remove shared item called");
}

function addItem(n){
	numItems[n-1] += 1;
	var itemNum = numItems[n-1];
	
	$('#per'+n+'items').append('<div class="itemAndButton" id="itemAndButton'+n+'-'+itemNum+'"><a class="deleteButton ui-btn ui-shadow ui-btn-corner-all ui-btn-icon-left ui-btn-up-c" data-role="button" data-icon="delete" onclick="removeItem('+n+','+itemNum+')" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">&nbsp;</span><span class="ui-icon ui-icon-delete ui-icon-shadow">&nbsp;</span></span></a><div class="itemContainer"><input type="text" class="item ui-input-text ui-body-c ui-corner-all ui-shadow-inset" id="per'+n+'item'+itemNum+'" name="per'+n+'item'+itemNum+'" value="$0.00" onclick="itemFocus('+n+','+itemNum+')" readonly="readonly"></div></div>');
	document.getElementById("per"+n+"item"+itemNum).select();
	focusedPerson = n;
	focusedItem = itemNum;
	focusedValue = "";
	// Match add button height to parent div
	var parentHeight = $('#person'+n).height();
	$('#addItemButton'+n).height(parentHeight);

}

// Updates each person's total and total subtotal
// Enables and disables the add item button
function calculateSubtotal(){
	subtotal = 0;
	for (var i=0;i<numItems.length;i++){
		itemPrices[i]=0;
		var p = i+1;
		for (var j=0;j<numItems[i];j++){
			n = j+1;
			var currItem = "per" + p + "item" + n;
			var currItemValue = parseFloat(document.getElementById(currItem).value.substr(1));

			subtotal = subtotal + currItemValue;
			itemPrices[i] = itemPrices[i]+currItemValue;
			if (j==numItems[i]-1){
				if (currItemValue == 0){
					$("#addItemButton"+p).attr("disabled", "disabled");
				}
				else{
					$("#addItemButton"+p).removeAttr("disabled");
				}
			}
		}
	}
	subtotal += shareditems_price;
	$('#runningSubtotalNum').html(displayDollar(subtotal));
}

// Calculate the subtotal with each click
$(document).click(function() {
	calculateSubtotal();
});

/* Changes the display of fields to appropriate values */
function displayDollar(amount){
	return "$" + (Math.round(amount*100)/100).toFixed(2).toString()
}


/* Numpad Functions for Tax and Tip Page */

var ttFocus = 0;
var ttFields = ["tax","tip"];

/* Adds number to the focused field */
function btnPressedtt(key){
	focusedValue = focusedValue + key.toString();
	if (ttFocus == 0){
		document.getElementById(ttFields[ttFocus]).value = "$" + focusedValue;
	}
	else{
		document.getElementById(ttFields[ttFocus]).value = focusedValue + "%";
	}
}

/* Deletes a character */
function btnPressedDeltt(){
	if (focusedValue.length == 1){
		focusedValue = "";
	}
	else{
		focusedValue = focusedValue.substring(0, focusedValue.length - 1);
	}
	if (ttFocus == 0){
		document.getElementById(ttFields[ttFocus]).value = "$" + focusedValue;
	}
	else{
		document.getElementById(ttFields[ttFocus]).value = focusedValue + "%";
	}
}


/* When input fields are clicked, change the focus in the javascript to match the clicked focus */
function taxClick(){
	ttFocus = 0;
	focusedValue = "";
	document.getElementById(ttFields[ttFocus]).select();
}
function tipClick(){
	ttFocus = 1;
	focusedValue = "";
	document.getElementById(ttFields[ttFocus]).select();
}

/* Calculate simple results */
function calculateResults2(){

	tipDecimal = parseFloat(tip.value.substr(0, tip.value.length-1))/100;
	taxValue = tax.value.substr(1);
	taxPercent = parseFloat(taxValue)/subtotal;
	
	$('#resultsContent2').html('');

	for (var i=0;i<numItems.length;i++){
		var p = i+1;
		$('#resultsContent2').append('<div class="personResult"><div class="personResultBorder"><img src="img/person2.png">'+p+'<div class="personTotals2" id="personTotals2'+p+'"></div></div></div>');
	}
	// p = person number
	for (var i=0;i<numItems.length;i++){
		var p = i+1;

		// check each shared item and add subtotal to each person

		var currPersonSub = itemPrices[i]; // subtotal per person (i = p - 1)
		var currPersonTax = currPersonSub*taxPercent;
		var currPersonTip = currPersonSub*tipDecimal;
		var currPersonTotal = currPersonSub+currPersonTax+currPersonTip;
		
		$('#personTotals2'+p).append('<span class="personTotal">'+displayDollar(currPersonTotal)+'</span>');

	}

	gtTipValue = subtotal*tipDecimal;
	gtTotalValue = subtotal+parseFloat(taxValue)+gtTipValue;
	console.log(typeof subtotal, typeof tipDecimal, typeof taxValue, typeof gtTipValue, typeof gtTotalValue);

	$('#gtSub2').html(displayDollar(subtotal));
	$('#gtTax2').html(displayDollar(taxValue));
	$('#gtTip2').html(displayDollar(gtTipValue));
	$('#gtTotal2').html(displayDollar(gtTotalValue));

}

/* Calculate the results page */

function calculateResults(){
	tipDecimal = parseFloat(tip.value.substr(0, tip.value.length-1))/100;
	taxValue = tax.value.substr(1);
	taxPercent = parseFloat(taxValue)/subtotal;
	$('#resultsContent').html('<div class="personResult"><div class="personResultBorder personIconLegend"><img src="img/person2.png"><div class="personResultItems"><span>items</span><span class="personResultShared">shared</span></div><div class="personTotals""><span class="personSub">subtotal</span><span class="personTax">tax</span><span class="personTip">tip</span><span class="personTotal">total</span></div></div></div>');
	
	for (var i=0;i<numItems.length;i++){
		var p = i+1;
		$('#resultsContent').append('<div class="personResult"><div class="personResultBorder"><img src="img/person2.png">'+p+'<div class="personResultItems" id="personResultItems'+p+'"></div><div class="personTotals" id="personTotals'+p+'"></div></div></div>');
	}
	// p = person number
	for (var i=0;i<numItems.length;i++){
		var p = i+1;

		// add each item to the person's tab (if > $0.00)
		for (var j=0;j<numItems[i];j++){
			n = j+1;
			var currItem = "per" + p + "item" + n;
			var currItemValue = parseFloat(document.getElementById(currItem).value.substr(1));
			if (currItemValue != 0){
				$('#personResultItems'+p).append('<span>'+displayDollar(currItemValue)+'</span>');
			}
		}

		// check each shared item and add subtotal to each person
		$.each($('#per'+p+'items').children(".shareditem"), function(){
			var itemValue = parseFloat($(this).attr("value"));
			console.log("adding shared item to subtotal...");
			console.log(itemValue);
			if (itemValue != 0){
				$('#personResultItems'+p).append('<span class="personResultShared">'+displayDollar(itemValue)+'</span>');
				itemPrices[p-1] += itemValue;
			}
		});
		var currPersonSub = itemPrices[i]; // subtotal per person (i = p - 1)
		var currPersonTax = currPersonSub*taxPercent;
		var currPersonTip = currPersonSub*tipDecimal;
		var currPersonTotal = currPersonSub+currPersonTax+currPersonTip;
		
		$('#personTotals'+p).append('<span class="personSub">'+displayDollar(currPersonSub)+'</span><span class="personTax">'+displayDollar(currPersonTax)+'</span><span class="personTip">'+displayDollar(currPersonTip)+'</span><span class="personTotal">'+displayDollar(currPersonTotal)+'</span>');

	}

	gtTipValue = subtotal*tipDecimal;
	gtTotalValue = subtotal+parseFloat(taxValue)+gtTipValue;
	console.log(typeof subtotal, typeof tipDecimal, typeof taxValue, typeof gtTipValue, typeof gtTotalValue);

	$('#gtSub').html(displayDollar(subtotal));
	$('#gtTax').html(displayDollar(taxValue));
	$('#gtTip').html(displayDollar(gtTipValue));
	$('#gtTotal').html(displayDollar(gtTotalValue));

}


// addToPeople has been clicked
// checkbox action
function checkboxChange(){ // possibly passed a person #

	if ($(this).is(':checked') == true){
		// add person's icon to page
		var n = $(this).attr("id")[8]; // get checkbox number
		$('#per0ppl').append('<span class="picon'+n +' thumb_picon"><img src="img/person2.png" width="15" height="15"><span class="thumb_number">'+n+'</span></span>');
	}
	else{

		var n = $(this).attr("id")[8];
		console.log("Person removed " + n);
		$('.picon'+n).remove();
	}
}

// Set defaults when clicking the accordion
$('#sharedAccordion').bind('expand', function () {
  itemFocus(0,0);
  // hide or gray out the add to people button
	// hide the keyboard
	$('#person_shared').hide();
	
	// add a checkbox too each person div where the Add Item button is.
	$('.addItemButton').hide();
	$('.checkboxes').show();
}).bind('collapse', function () {
	itemFocus(1,1);
  $('.addItemButton').show();
	$('.checkboxes').hide();
});

// done is clicked after people have been selected
function doneShared(){
	var new_value = $('#per0item0').val();
	// close the Add Shared Item
	$( "#add_shared_items" ).trigger( "collapse" );

	$('.addItemButton').show();
	$('.checkboxes').hide();

	$('#person_shared').show();

	var n = 0;
	var itemNum = $('#per0items').children('.itemAndButton').length + 1;
	var num_ppl = $('#per0ppl').children('.thumb_picon').length;
	var perPerson = parseFloat(new_value.replace(/\$/g, ''))/num_ppl; // the cost per person for this shared item: price/number of people

	// for each person, save a copy of the shared item invisibly into their div
	$.each($('#per0ppl').children('.thumb_picon'), function(){
		var person_number = $(this).children(".thumb_number")[0].innerHTML;
		$('#per'+person_number+'items').append('<div class="shareditem shared_item_'+itemNum+'" id="shared_item'+itemNum+'" style="display:none;" value="'+perPerson+'"></div>');
	});

	// add to Running Subtotal
	shareditems_price += parseFloat(new_value.replace(/\$/g, ''));

	// add item amount and row of person icons to Shared Item div.
	$('#per0items').append('<div class="itemAndButton" id="itemAndButton'+n+'-'+itemNum+'"><a class="deleteButton ui-btn ui-shadow ui-btn-corner-all ui-btn-icon-left ui-btn-up-c" data-role="button" data-icon="delete" onclick="removeSharedItem('+itemNum+')" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" data-theme="c"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">&nbsp;</span><span class="ui-icon ui-icon-delete ui-icon-shadow">&nbsp;</span></span></a><div class="itemContainer"><input type="text" class="item ui-input-text ui-body-c ui-corner-all ui-shadow-inset" id="per'+n+'item'+itemNum+'" name="per'+n+'item'+itemNum+'" value="'+ new_value +'" onclick="itemFocus('+n+','+itemNum+')" readonly="readonly"><div id="pplitem'+itemNum+'"></div></div></div>');
	$('#per0ppl').clone().appendTo('#pplitem'+itemNum);

	// copy of people list no longer respond to checkboxes
	for (var i=0; i <= number_people; i++){
		$('span').removeClass('picon'+i);
	}

	// show the person shared div, if it isn't already visible
	$('#person_shared').show();

	// clear Shared Item amount, people container, and checkboxes
	$('#per0item0').val("$0.00");
	$('#per0ppl').empty();
	$('input:checkbox').removeAttr('checked');
}

/* Click events */
/* people Page */

$("#buttonppl0").fastClick(function(){
	btnPressedppl(0);
})
$("#buttonppl1").fastClick(function(){
	btnPressedppl(1);
})
$("#buttonppl2").fastClick(function(){
	btnPressedppl(2);
})
$("#buttonppl3").fastClick(function(){
	btnPressedppl(3);
})
$("#buttonppl4").fastClick(function(){
	btnPressedppl(4);
})
$("#buttonppl5").fastClick(function(){
	btnPressedppl(5);
})
$("#buttonppl6").fastClick(function(){
	btnPressedppl(6);
})
$("#buttonppl7").fastClick(function(){
	btnPressedppl(7);
})
$("#buttonppl8").fastClick(function(){
	btnPressedppl(8);
})
$("#buttonppl9").fastClick(function(){
	btnPressedppl(9);
})
$("#buttonDotppl").fastClick(function(){
	btnPressedppl('.');
})
$("#buttonDelppl").fastClick(function(){
	btnPressedDelppl();
})

/* itemPage */
$("#button0").fastClick(function(){
	btnPressed(0);
	calculateSubtotal();
})
$("#button1").fastClick(function(){
	btnPressed(1);
	calculateSubtotal();
})
$("#button2").fastClick(function(){
	btnPressed(2);
	calculateSubtotal();
})
$("#button3").fastClick(function(){
	btnPressed(3);
	calculateSubtotal();
})
$("#button4").fastClick(function(){
	btnPressed(4);
	calculateSubtotal();
})
$("#button5").fastClick(function(){
	btnPressed(5);
	calculateSubtotal();
})
$("#button6").fastClick(function(){
	btnPressed(6);
	calculateSubtotal();
})
$("#button7").fastClick(function(){
	btnPressed(7);
	calculateSubtotal();
})
$("#button8").fastClick(function(){
	btnPressed(8);
	calculateSubtotal();
})
$("#button9").fastClick(function(){
	btnPressed(9);
	calculateSubtotal();
})
$("#buttonDot").fastClick(function(){
	btnPressed('.');
	calculateSubtotal();
})
$("#buttonDel").fastClick(function(){
	btnPressedDel();
	calculateSubtotal();
})

/* taxTipPage */
$("#buttontt0").fastClick(function(){
	btnPressedtt(0);
})
$("#buttontt1").fastClick(function(){
	btnPressedtt(1);
})
$("#buttontt2").fastClick(function(){
	btnPressedtt(2);
})
$("#buttontt3").fastClick(function(){
	btnPressedtt(3);
})
$("#buttontt4").fastClick(function(){
	btnPressedtt(4);
})
$("#buttontt5").fastClick(function(){
	btnPressedtt(5);
})
$("#buttontt6").fastClick(function(){
	btnPressedtt(6);
})
$("#buttontt7").fastClick(function(){
	btnPressedtt(7);
})
$("#buttontt8").fastClick(function(){
	btnPressedtt(8);
})
$("#buttontt9").fastClick(function(){
	btnPressedtt(9);
})
$("#buttonDottt").fastClick(function(){
	btnPressedtt('.');
})
$("#buttonDeltt").fastClick(function(){
	btnPressedDeltt();
})




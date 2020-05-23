/* Initialize variables */

var focusedValue = "";
var focusedFields = ["billTotal", "tip", "numPeople"];
var focusedIndex = 0;

/* Starts the page with focus on the total bill */
function setFocus(){
	document.getElementById("billTotal").select();
	window.top.scrollTo(0, 1);
}

/* Adds number to the focused field */
function btnPressed(key){
	focusedValue = focusedValue + key.toString();
	if (focusedIndex == 0){
		document.getElementById(focusedFields[focusedIndex]).value = "$" + focusedValue;
	}
	else if (focusedIndex == 1){
		document.getElementById(focusedFields[focusedIndex]).value = focusedValue + "%";
	}
	else{
		document.getElementById(focusedFields[focusedIndex]).value = focusedValue;
	}
}

/* Deletes a character */
function btnPressedDel(){
	if (focusedValue.length == 1){
		focusedValue = "";
	}
	else{
		focusedValue = focusedValue.substring(0, focusedValue.length - 1);
	}
	if (focusedIndex == 0){
		document.getElementById(focusedFields[focusedIndex]).value = "$" + focusedValue;
	}
	else if (focusedIndex == 1){
		document.getElementById(focusedFields[focusedIndex]).value = focusedValue + "%";
	}
	else{
		document.getElementById(focusedFields[focusedIndex]).value = parseInt(focusedValue);
	}
}

/* Calculates the tip, reveals the results, and hides form and numpad */
$("#doneButton").fastClick(function(){
	var billTotalNum = parseFloat(billTotal.value.substr(1));
	var tipNum = parseFloat(tip.value.substr(0, tip.value.length-1))/100;
	var tipAmountNum = billTotalNum*tipNum;
	var totalWTipNum = tipAmountNum+billTotalNum;
	var perPersonNum = totalWTipNum/numPeople.value;
	tipAmount.value = displayDollar(tipAmountNum);
	totalWTip.value = displayDollar(totalWTipNum);
	perPerson.value = displayDollar(perPersonNum);

	$('#resultsContent').html('<div class="personResult"><div class="personResultBorder personIconLegend"><img src="img/person2.png"><div class="personTotals"><span class="personSub">tip</span><span class="personTip">grand total</span><span class="personTotal">per person</span></div></div></div>');

	$('#resultsContent0').html('<div class="personResult0"><div class="personResultBorder"><div class="personTotals" id="personTotals"></div></div></div>');

	$('#personTotals').append('<span class="personSub">'+displayDollar(tipAmountNum)+'</span><span class="personTip">'+displayDollar(totalWTipNum)+'</span><span class="personTotal">'+displayDollar(perPersonNum)+'</span>');

  $.mobile.changePage( "#simpleResults");
})

/* Turns a number amount into a dollar amount */
function displayDollar(amount){
	return "$" + (Math.round(amount*100)/100).toFixed(2).toString();
}

/* Back button goes back and resets the focus to the first field */
$("#backToForm").fastClick(function(){
	$.mobile.changePage( "#simpleForm");
	
	focusedIndex = 0;
	focusedValue = "";
	$("#simpleForm").live( 'pageshow',function(event, ui){
	  document.getElementById("billTotal").select();
	});
})

/* When input fields are clicked, change the focus in the javascript to match the clicked focus */
$("#billTotal").fastClick(function(){
	focusedIndex = 0;
	focusedValue = "";
	document.getElementById("billTotal").select();
})
$("#tip").fastClick(function(){
	focusedIndex = 1;
	focusedValue = "";
	document.getElementById("tip").select();
})
$("#numPeople").fastClick(function(){
	focusedIndex = 2;
	focusedValue = "";
	document.getElementById("numPeople").select();
})

/* When keyboard buttons are pressed, call functions */
$("#button0").fastClick(function(){
	btnPressed(0);
})
$("#button1").fastClick(function(){
	btnPressed(1);
})
$("#button2").fastClick(function(){
	btnPressed(2);
})
$("#button3").fastClick(function(){
	btnPressed(3);
})
$("#button4").fastClick(function(){
	btnPressed(4);
})
$("#button5").fastClick(function(){
	btnPressed(5);
})
$("#button6").fastClick(function(){
	btnPressed(6);
})
$("#button7").fastClick(function(){
	btnPressed(7);
})
$("#button8").fastClick(function(){
	btnPressed(8);
})
$("#button9").fastClick(function(){
	btnPressed(9);
})
$("#buttonDot").fastClick(function(){
	btnPressed('.');
})
$("#buttonDel").fastClick(function(){
	btnPressedDel();
})


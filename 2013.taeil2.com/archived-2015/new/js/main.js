// animate background variables
var ucberkeleyanimated = 0;
var monsooncompanyanimated = 0;
var tectureanimated = 0;

// animate skill circles variables
var htmlcssanimated = 0;
var jsanimated = 0;
var jqueryanimated = 0;
var psaianimated = 0;

$(window).scroll(function() {
	var windowTop = $(this).scrollTop();
	var windowHeight = $(this).height();

	// sticky header
	if ($(this).scrollTop() > 1){  
	    $('header').addClass("sticky");
	  }
	  else{
	    $('header').removeClass("sticky");
	  }

	// Highlight navigation section
	if ($(this).scrollTop() >= $("#contactSection").offset().top - 40){
		if ($('#contactNav').hasClass('active')){
			// do nothing if already at section
		}
		else {
			$('nav a').removeClass('active');
			$('#contactNav').addClass('active');
		}
	}
	else if ($(this).scrollTop() >= $("#workSection").offset().top - 40) {
		if ($('#workNav').hasClass('active')){
			// do nothing if already at section
		}
		else {
			$('nav a').removeClass('active');
			$('#workNav').addClass('active');
		}
	}
	else if ($(this).scrollTop() >= $("#skillsSection").offset().top - 40) {
		if ($('#skillsNav').hasClass('active')){
			// do nothing if already at section
		}
		else {
			$('nav a').removeClass('active');
			$('#skillsNav').addClass('active');
		}
	}
	else if ($(this).scrollTop() >= $("#backgroundSection").offset().top - 40) {
		if ($('#backgroundNav').hasClass('active')){
			// do nothing if already at section
		}
		else {
			$('nav a').removeClass('active');
			$('#backgroundNav').addClass('active');
		}
	}
	else {
		$('nav a').removeClass('active')
	}

	// animate background in
	if (ucberkeleyanimated == 0) {
		if ($(this).scrollTop() >= $(".ucberkeley").offset().top - 40 - windowHeight + 240){
			$('.ucberkeley').removeClass('invisible');
			$('.ucberkeley').addClass('fadeInUp animated');

			ucberkeleyanimated = 1;
		}
	}
	if (monsooncompanyanimated == 0) {
		if ($(this).scrollTop() >= $(".monsoonco").offset().top - 40 - windowHeight + 240){
			$('.monsoonco').removeClass('invisible');
			$('.monsoonco').addClass('fadeInUp animated');

			monsooncompanyanimated = 1;
		}
	}
	if (tectureanimated == 0) {
		if ($(this).scrollTop() >= $(".tecture").offset().top - 40 - windowHeight + 240){
			$('.tecture').removeClass('invisible');
			$('.tecture').addClass('fadeInUp animated');

			tectureanimated = 1;
		}
	}


	// animate skill circles
	if (htmlcssanimated == 0) {
		if ($(this).scrollTop() >= $("#htmlSkill").offset().top - 40 - windowHeight + 240){
			var htmlCircle = new ProgressBar.Circle('#htmlSkill', {
			    color: '#e55126',
			    strokeWidth: 4
			});
			htmlCircle.animate(0.9, function() {
			})

			var cssCircle = new ProgressBar.Circle('#cssSkill', {
			    color: '#0c73b8',
			    strokeWidth: 4
			});
			cssCircle.animate(0.75, function() {
			})

			htmlcssanimated = 1;
		}
	}
	if (jsanimated == 0) {
		if ($(this).scrollTop() >= $("#javascriptSkill").offset().top - 40 - windowHeight + 240){
			var javascriptCircle = new ProgressBar.Circle('#javascriptSkill', {
			    color: '#e5a228',
			    strokeWidth: 4
			});
			javascriptCircle.animate(0.5, function() {
			})

			jsanimated = 1;
		}
	}
	if (jqueryanimated == 0) {
		if ($(this).scrollTop() >= $("#jquerySkill").offset().top - 40 - windowHeight + 240){
			var jqueryCircle = new ProgressBar.Circle('#jquerySkill', {
			    color: '#0868ab',
			    strokeWidth: 4
			});
			jqueryCircle.animate(0.7, function() {
			})

			jqueryanimated = 1;
		}
	}
	if (psaianimated == 0) {
		if ($(this).scrollTop() >= $("#photoshopSkill").offset().top - 40 - windowHeight + 240){
			var photoshopCircle = new ProgressBar.Circle('#photoshopSkill', {
			    color: '#090054',
			    strokeWidth: 4
			});
			photoshopCircle.animate(0.5, function() {
			})

			var illustratorCircle = new ProgressBar.Circle('#illustratorSkill', {
			    color: '#604b38',
			    strokeWidth: 4
			});
			illustratorCircle.animate(0.7, function() {
			})

			psaianimated = 1;
		}
	}
});

// Nav buttons

$("#backgroundNav").click(function() {
    $('html, body').animate({
        scrollTop: $("#backgroundSection").offset().top - 40
    }, 500);
});
$("#skillsNav").click(function() {
    $('html, body').animate({
        scrollTop: $("#skillsSection").offset().top - 40
    }, 500);
});
$("#workNav").click(function() {
    $('html, body').animate({
        scrollTop: $("#workSection").offset().top - 40
    }, 500);
});
$("#contactNav").click(function() {
    $('html, body').animate({
        scrollTop: $("#contactSection").offset().top - 40
    }, 500);
});

// Mobile Nav

$('.mobileNav').click(function() {
	$('#mainNav').slideToggle();
});

// Portfolio
var filters = {};

$(document).ready(function(){

	// initiate isotope
	var $container = $('#portfolio');
	$container.isotope({
		itemSelector: '.workitem'
	})

	$('button.portfolioFilter').click(function(){
		var $this = $(this);
		// get group key
		var $buttonGroup = $this.parents('.button-group');
		var filterGroup = $buttonGroup.attr('data-filter-group');
		// set filter for group
		filters[ filterGroup ] = $this.attr('data-filter');
		// combine filters
		var filterValue = '';
		for ( var prop in filters ) {
		filterValue += filters[ prop ];
		}
		// set filter for Isotope
		$container.isotope({ filter: filterValue });

		$buttonGroup.children('button').each(function(){
			$(this).removeClass('active');
		})
		$this.addClass('active');
	});
	$('#resetFilter').click(function(){
		$('button.portfolioFilter').each(function(){
			$(this).removeClass('active');
		});
		$container.isotope({ filter: '' });
		filters = {};
	})

	

});




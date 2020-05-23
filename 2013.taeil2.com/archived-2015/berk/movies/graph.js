
$(document).ready(function(){
	// limit=25 gets back 25 movies. The max is 50.
	var url = 'http://api.rottentomatoes.com/api/public/v1.0/lists/movies/box_office.json?apikey=bq2gvg6a4zv8ac366yq676uu&limit=20&callback=?';
	$.getJSON(url, function(json){
  	graph(json.movies);
	});
});

function graph(data){

	console.log(data);
  
	var margin = {top: 20, right: 15, bottom: 60, left: 60}
	  , width = 960 - margin.left - margin.right
	  , height = 500 - margin.top - margin.bottom;

	var format = d3.time.format("%Y-%m-%d");
	console.log(format.parse(data[0].release_dates.theater));

	// find the minimum and maximum dates
	var minDate = Number.POSITIVE_INFINITY;
	var maxDate = Number.NEGATIVE_INFINITY;
	var tmp;
	for (var i=data.length-1; i>=0; i--) {
    tmp = format.parse(data[i].release_dates.theater);
    if (tmp < minDate) minDate = tmp;
    if (tmp > maxDate) maxDate = tmp;
	}

	var x = d3.time.scale()
	  .domain([minDate, maxDate])
	  .range([ 0, width ]);
	  
	var y = d3.scale.linear()
		// Top possible score is 100
	  .domain([0, 100])
	  .range([ height, 0 ]);
	 
	var chart = d3.select('body')
	.append('svg:svg')
	.attr('width', width + margin.right + margin.left)
	.attr('height', height + margin.top + margin.bottom)
	.attr('class', 'chart')

	// the main object where the chart and axis will be drawn
	var main = chart.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
	.attr('width', width)
	.attr('height', height)
	.attr('class', 'main')   

	// draw the x axis
	var xAxis = d3.svg.axis()
	.scale(x)
	.orient('bottom');

	main.append('g')
	.attr('transform', 'translate(0,' + height + ')')
	.attr('class', 'main axis date')
	.call(xAxis);

	// draw the y axis
	var yAxis = d3.svg.axis()
	.scale(y)
	.orient('left');

	main.append('g')
	.attr('transform', 'translate(0,0)')
	.attr('class', 'main axis date')
	.call(yAxis);

	// draw the graph object
	var g = main.append("svg:g"); 

	g.selectAll("circle")
	  .data(data)
	  .enter().append("svg:circle")
	    .attr("r", 5)
	    .attr("cx", function (d,i) { return x(format.parse(d.release_dates.theater)); } )
	    .attr("cy", function (d) { return y(d.ratings.critics_score); } );
	    // .attr("cy", function(d){ return y(d.ratings.audience_score); } );

	g.selectAll("image")
	  .data(data)
	  .enter().append("image")
		  .attr("x", function(d,i){ return x(format.parse(d.release_dates.theater)); } )
		  //d.ratings.audience_score or d.ratings.critics_score
		  .attr("y", function(d){ return y(d.ratings.critics_score); } )
		  // .attr("y", function(d){ return y(d.ratings.audience_score); } )
		  // poster image defaults are 180x266
		  .attr("xlink:href", function (d,i){return d.posters.detailed;})
		  .attr("width", 36)
		  .attr("height", 53);



}

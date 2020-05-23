var width = 790,
    height = 790;

var force = d3.layout.force()
    .charge(-130)
    .linkDistance(function(link) {
          return 5 * (100 - link.value); //link.value measures the strength of the correllation, with higher values being a higher "similarity score"
       })
    .gravity(.9)
    .size([width, height]);

var svg = d3.select("#chart").append("svg")
    .attr("viewBox", "0 0 " + width + " " + height )
    .attr("preserveAspectRatio", "xMidYMid meet");

d3.json("fewer.json", function(json) {
  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

   var link = svg.selectAll("line.link")         //code for links with text adapted from https://groups.google.com/forum/?fromgroups=#!topic/d3-js/GR4FeV85drg
      .data(json.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", 0) //  no stroke renders bubbles in space
      .text("test");

   var node = svg.selectAll("g.node") 
      .data(json.nodes) 
      .enter().append("svg:g") 
      .attr("class", "node"); 

    node.append("svg:circle") 
      .attr("r", function(d) { 
           return Math.floor(d.freq/3); }) 
      .style("fill", function() { return getRandomColor()})
      .style("stroke", "#888")
      .style("opacity", .85)
     .call(force.drag); 

    node.append("svg:text") 
      .style("pointer-events", "none") 
      .attr("text-anchor", "middle")
      .attr("fill", "#000") 
      .attr("font-size", "15px")
      .attr("font-family", "sans-serif")
      .attr("dx", "0") 
      .attr("dy", ".3em") 
      .text(function(d) { return d.name; }); 

    node.append("svg:title") 
      .style("pointer-events", "none") 
      .text(function(d) { return d.name; }); 

    node.on("click", function(d) {
        handleClick(d);
    });

    force.on("tick", function() { 

    link.attr("x1", function(d) { return d.source.x; }) 
      .attr("y1", function(d) { return d.source.y; }) 
      .attr("x2", function(d) { return d.target.x; }) 
      .attr("y2", function(d) { return d.target.y; }); 

    node.attr("transform", function(d) { return "translate(" + d.x + 
  "," + d.y + ")"; }); 

    });

});


    function getRandomColor() {
      var h = Math.floor(Math.random() * 360);
      var s = 60;
      var l = 80;
      var m1, m2, hue;
      var r, g, b
      s /=100;
      l /= 100;
      if (s == 0)
        r = g = b = (l * 255);
      else {
        if (l <= 0.5)
          m2 = l * (s + 1);
        else
          m2 = l + s - l * s;
        m1 = l * 2 - m2;
        hue = h / 360;
        r = Math.floor(HueToRgb(m1, m2, hue + 1/3));
        g = Math.floor(HueToRgb(m1, m2, hue));
        b = Math.floor(HueToRgb(m1, m2, hue - 1/3));
      }
      var color = rgbToHex(r, g, b);
      return color;
    }

  function HueToRgb(m1, m2, hue) {
    var v;
    if (hue < 0)
      hue += 1;
    else if (hue > 1)
      hue -= 1;

    if (6 * hue < 1)
      v = m1 + (m2 - m1) * hue * 6;
    else if (2 * hue < 1)
      v = m2;
    else if (3 * hue < 2)
      v = m1 + (m2 - m1) * (2/3 - hue) * 6;
    else
      v = m1;

    return 255 * v;
  }

  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }


  function handleClick(d){
    

    // Reset the append divs and initialize variables
    $("#welcome").hide();
    $("#tagInfo").show();
    $("#topTracks").html("<h2>Top Tracks</h2><div id='player'></div>")
    $("#topArtists").html("<h2>Top Artists</h2>");
    tag = d.name;


    // Get title and summary
    $.getJSON("https://ws.audioscrobbler.com/2.0/?method=tag.getinfo&tag=" + tag + "&api_key=1d4e90a59a76ae5489f0a080f0da6979&format=json", function(infoJSON){

      console.log(infoJSON);

      $("#tagTitle").html(infoJSON.tag.name);
      $("#tagSummary").html(infoJSON.tag.wiki.summary);

    });

    // Get top tracks
    $.getJSON("https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=" + tag + "&api_key=1d4e90a59a76ae5489f0a080f0da6979&format=json", function(tracksJSON){

      console.log(tracksJSON);
      // This is how you get the artist name:
      console.log(tracksJSON.toptracks.track[0].artist.name);
      // This is how you get the track name:
      console.log(tracksJSON.toptracks.track[0].name);

      var urls = "";
      var mia = 0;

      for (var i=0; i<7; i++){

        var query = tracksJSON.toptracks.track[i].artist.name + " " + tracksJSON.toptracks.track[i].name;
        $.getJSON("https://ws.spotify.com/search/1/track.json?q="+query, function(data){

            console.log(data);
            if (data.info.num_results == 0){
              mia+=1;
            }
            else{
              var url = data.tracks[0].href;
              url = url.replace("spotify:track:","");
              urls = urls + url + ",";
            }
            var jsonDone = urls.length + 23*mia;
            if (jsonDone==161){
              urls = urls.substring(0, urls.length - 1);
              console.log(urls);
              $("#player").html("<iframe src='https://embed.spotify.com/?uri=spotify:trackset:toptracks:" + urls + "' width='280' height='340' frameborder='0' allowtransparency='true'></iframe>");
            }

          });
        
        }

      });

    // Get top artists
    $.getJSON("https://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag="+ tag + "&api_key=1d4e90a59a76ae5489f0a080f0da6979&format=json", function(artistsJSON){

      console.log(artistsJSON);
      for (var i=0; i<4; i++){

        console.log(artistsJSON.topartists.artist[i].image[2]['#text']);

        $("#topArtists").append("<div class='artist' id='artist" + i +"'><a href='"+artistsJSON.topartists.artist[i].url+"'target='_blank'><img src='" + artistsJSON.topartists.artist[i].image[2]['#text'] + "'><span class='artistName'>" + artistsJSON.topartists.artist[i].name + "</span></a></div>");
      }

    });

  }

// Hack to get the chart to fit in that window
function setSizes() {
   var contentHeight = $(".content").height();
   $("#chartwrapper").height(contentHeight);
}

$(window).resize(function() { setSizes(); });

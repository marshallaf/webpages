// this is the URL that I'm trying to get
var quoteURL = "https://howmuchisthe.fish/json/random";
var currQuote = "";
var twitQuote = "";

function getQuote() {
	
	$.ajax( {
	    url: quoteURL,
	    datatype: 'jsonp',
	    success: function(data) {
	    	currQuote = data.quote.text;
	    	if (currQuote.indexOf("faggot") != -1) return;
	    	$("#quote").html("&ldquo;" + currQuote + "&rdquo;");
			twitQuote = '"' + currQuote + '" - H.P. Baxxter';
			$("#twitter-button").prop('href', 'https://twitter.com/intent/tweet?text=' + twitQuote);
	    }
	});
	
}

$(document).ready(function() {

	getQuote();

	$("#getQuote").on("click", function(e) {
		getQuote();    	
	});

});
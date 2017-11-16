var request = require('request')
request({
	url:'https://en.wikipedia.org/w/api.php',
	qs:{
	 action:'query',
	 titles: process.argv[2],
	 prop:'extracts',
	 exintro: true,
	 explaintext: true,
	 format: 'json'
	}}, function(err,res,data){
	if(err){
	 return console.log('Error ' + err)
	}
	// console.log(data)
	var dataObj = JSON.parse(data).query.pages
	for (var page in dataObj){
		console.log(dataObj[page].extract)
	}
})
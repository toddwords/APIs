//opens a random gif
//requires an API key from developers.giphy.com

var fs = require('fs')
var request = require('request')
request({
	url:'https://api.giphy.com/v1/gifs/random',
	qs:{
	 tag: process.argv[2],
	 api_key: 'SnREKKYQNbZIxQm0BvFOeBhW1lYCDpjy'
	}}, function(err,res,data){
	if(err){
	 return console.log('Error ' + err)
	}
	request(JSON.parse(data).data.image_original_url).pipe(fs.createWriteStream(process.argv[2]+'.gif'))
})
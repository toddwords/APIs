# APIs
An intro to accessing APIs in Node and in the browser with fetch.

### What are APIs?
API stands for **Application Programming Interface**. It's the part of a server that takes in requests and sends data in response, and it allows services to connect to each other.

Here's a [video that explains it well](https://www.youtube.com/watch?v=s7wmiS2mSXY)

### Accessing an API
Most APIs are accessible via an HTTP request to a special URL. The url has two parts, let's look at an example:

https://api.giphy.com/v1/gifs/random?api_key=SnREKKYQNbZIxQm0BvFOeBhW1lYCDpjy&tag=dog

**The Endpoint**
The first part of the URL up until the question mark. This is the part of the API we're sending a request to. Most APIs have multiple endpoints for different functions. The [Giphy API](https://developers.giphy.com/docs/) has endpoints for Search (list of gifs on a search term), Trending (current trending gifs) and Random (one random gif with a certain tag).

To call the Random endpoint we send a request to **https://api.giphy.com/v1/gifs/random**

**The Query String**
After the endpoint comes a '?' followed by some data. This data is like the parameters we pass into a function. 
Query Strings have the following format **?**property_name1**=**value1**&**property_name2**=**value2..
An **&** separates each set of key value pairs.
For the random Giphy gif, we need two things, an API Key and a tag.
**?api_key=SnREKKYQNbZIxQm0BvFOeBhW1lYCDpjy&tag=dog**
An API Key is a unique key that identifies a certain application and is used to avoid server spam. Usually you can get an API key for free on the APIs website. I got mine at [https://developers.giphy.com/docs/](https://developers.giphy.com)

[https://api.giphy.com/v1/gifs/random?api_key=SnREKKYQNbZIxQm0BvFOeBhW1lYCDpjy&tag=dog](https://api.giphy.com/v1/gifs/random?api_key=SnREKKYQNbZIxQm0BvFOeBhW1lYCDpjy&tag=dog)

When we go to this link in the browser, we see a bunch of JSON data in the response, not the cute dog gif we want! That's because APIs aren't designed to be accessed from a browser URL bar, but rather programmatically through Javascript.

There are two ways to access an API in JS
- Node
- In-Browser Javscript with Fetcb

### Accessing APIs with Node
There are two ways of accessing APIs with Node:
- Api-specific packages
- General calls with Request

#### Api-specific packages
Many popular APIs have dedicated Node packages for accessing them. Here are some examples:
- [Twit](https://www.npmjs.com/package/twit) - For Twitter's API
- [New York Times](https://www.npmjs.com/package/newyorktimes)
- [Google Maps](https://www.npmjs.com/package/@google/maps)
- [Flickr](https://www.npmjs.com/package/flickr-sdk)

These APIs have simplified methods for commonly used API functions so you don't have to write out long URLs. They usually don't add any functionality beyond what you could do with a general HTTP request, just make it easier to use.

#### General calls with Request
[Request](https://www.npmjs.com/package/request) is a souped-up version of the built-in Node http package that makes it much easier to make HTTP requests and API calls.
You'll need to install request with `npm install request`
A basic Request api call looks like this:
```
var request = require('request')
request('https://api.giphy.com/v1/gifs/random?api_key=SnREKKYQNbZIxQm0BvFOeBhW1lYCDpjy&tag=dog', function(error,response,data){
  if(error){
	 return console.log('Error: ' + err)
	}
  console.log(data)
}
```
You can also write out the query string as an object, which is handy when there's a lot of variables you want to change. Look at this example from the Wikipedia Api:
```
var request = require('request')
request({
	url:'https://en.wikipedia.org/w/api.php',
	qs:{
	 action:'query',
	 titles: 'Pizza',
	 prop:'extracts',
	 exintro: true,
	 explaintext: true,
	 format: 'json'
	}}, function(err,res,data){
	if(err){
	 return console.log('Error ' + err)
	}
	console.log(data)
})
```
The data looks like JSON in the console, but we can't access it like JSON until we parse it. To do this we use a command called JSON.parse(). This is useful because we usually don't want the entire response from an API, just part of it. The example below shows how we extract the image URL from the Giphy API response and then use that to download the image:
```
var request = require('request')
request('https://api.giphy.com/v1/gifs/random?api_key=SnREKKYQNbZIxQm0BvFOeBhW1lYCDpjy&tag=dog', function(error,response,data){
  if(error){
	 return console.log('Error: ' + err)
	}
  data = JSON.parse(data)
  var imageURL = data.data.image_original_url
  //Here we send another request to download the image url
  request(imageURL).pipe(fs.createWriteStream('dog.gif'))

}
```
The line `data.data.image_original_url` is kind of weird, this is because the Giphy api returns it's data in a big object called data, which leads to us having an object called data inside an object called data, thus `data.data.image_original_url`. It's often a good idea to noodle around with the data in the console to make sure you're accessing the right thing.

#### Accessing APIs in the Browser with Fetch
You don't have to use Node to access API. Depending on what you're using them for, it may make more sense to access them from the browser, especially if you're trying to immediately show that data on a web page. In bygone days you used to have to use jQuery to do this using a relatively complex AJAX function. But with the new ES6 version of javascript, there's a built-in function called `fetch` which is perfect for it.

The basic syntax of a fetch request is as follows:
```
var url = 'https://api.giphy.com/v1/gifs/random?api_key=SnREKKYQNbZIxQm0BvFOeBhW1lYCDpjy&tag=dog'
		fetch(url)
      //.then is a synchronous function that runs after the data is loaded
      //first we convert the data into a json promise
			.then(function(response){return response.json()})
      //then we do stuff with it, it needs to be done in two steps
			.then(function(data){
			  console.log(data)
			//catch runs when there's an error
      .catch(function(error){
				return console.log(error)
			})
```
First we `fetch` the URL, `then` we convert into the type of data we want to use `then` we do stuff with it. Also an important note:
```
fetch(url)
  .then(code...)
  .then(code...)
IS THE SAME AS

fetch(url).then(code...).then(code...)
It's just easier to read
```
Usually you'll want to be turning the data into JSON, but if you're loading in an image or audio file, you can use `response.blob()` 

Look at the giphy.html file for a full example. 

### List of APIs
Want to explore what APIs are out there?
- Check out this [list on GitHub](https://github.com/abhishekbanthia/Public-APIs)
- And this one has a good featured list: [any-api](https://any-api.com/)

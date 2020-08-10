import comics from './main';

$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
	console.log(jqXHR.responseText);
})
var root = typeof self == 'object' && self.self === self && self ||
           typeof global == 'object' && global.global === global && global ||
           this;
root.comics = comics;
comics();
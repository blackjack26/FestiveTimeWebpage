var $submitButton = $('#submitButton');

$submitButton.on('click', function(){
	console.log('Submit');
	
	$(".open-item").remove();

	var return_to = getQueryParam('return_to', 'pebblejs://close#');
	document.location = return_to + encodeURIComponent(JSON.stringify(getAndStoreConfigData()));
});

var $batteryDisplayCheckbox = $('#batteryDisplayCheckbox');
var $timeFormatCheckbox = $('#timeFormatCheckbox');
var $temperatureTab = $('.temp-tab');
var $birthdayList = $('.item-bday-list');
var $invertColorCheckbox = $('#invertColorCheckbox');
var $locationUsageCheckbox = $("#locationUsageCheckbox");
var $cityBox = $("#cityInput");

console.log('Loaded: ' + JSON.stringify(localStorage));

if(localStorage.temperatureFormat){
	$batteryDisplayCheckbox[0].checked = localStorage.batteryDisplayOnOff === 'true';
	$timeFormatCheckbox[0].checked = localStorage.twentyFourHourFormat === 'true';
	$invertColorCheckbox[0].checked = localStorage.invertColor === 'true';
	$locationUsageCheckbox[0].checked = localStorage.useLocation === 'true';
	updateLocationBox();
	$cityBox[0].value = localStorage.location;
	
	// Setting active temperature
	for(var i = 0; i < $temperatureTab.length; i++){
		$($temperatureTab[i]).removeClass("active");
		if($($temperatureTab[i]).html() === localStorage.temperatureFormat){
			$($temperatureTab[i]).addClass("active");
		}
	}
	
	// Adding birthdays
	var birthdayArr = localStorage.birthdayList.split(",");
	for(var i = 0; i < birthdayArr.length; i+=2){
		var name = birthdayArr[i];
		var date = birthdayArr[i+1];
	
		var $item = $('<div class="item">'
                      + '<p id="nameTxt">' + name + '</p> (<p id="dateTxt">' + date + '</p>)'
                  + '</div>');

		var deletebutton = $('<div class="delete-item"></div>');

	    deletebutton.click(function(){
	      $(this).parent().remove();
	    });
	    $item.append(deletebutton);
      	$birthdayList.append($item);
	}
}

function storeBirthdayArray(birthdayItems){
	var $bdayArray = new Array(birthdayItems.length);
	for(var i = 0; i < $bdayArray.length; i++){
		var name = $(birthdayItems[i]).find("#nameTxt").html();
		var date = $(birthdayItems[i]).find("#dateTxt").html();
		$bdayArray[i] = [ name, date ];
	}
	return $bdayArray.join();
}

function getAndStoreConfigData() {
	var $batteryDisplayCheckbox = $('#batteryDisplayCheckbox');
	var $timeFormatCheckbox = $('#timeFormatCheckbox');
	var $temperatureTab = $('.temp-tab.active');
	var $birthdayItems = $('.item-bday-list').children(".item:not(.add-item)");
	var $invertColorCheckbox = $('#invertColorCheckbox');
	var $locationUsageCheckbox = $("#locationUsageCheckbox");
	var $cityBox = $("#cityInput");

	var options = {
		twentyFourHourFormat: $timeFormatCheckbox[0].checked,
		batteryDisplayOnOff: $batteryDisplayCheckbox[0].checked,
		temperatureFormat: $temperatureTab.html(),
		birthdayList: storeBirthdayArray($birthdayItems),
		invertColor: $invertColorCheckbox[0].checked,
		useLocation: $locationUsageCheckbox[0].checked,
		location: $cityBox[0].value
	};

	localStorage.twentyFourHourFormat = options.twentyFourHourFormat;
	localStorage.batteryDisplayOnOff = options.batteryDisplayOnOff;
	localStorage.temperatureFormat = options.temperatureFormat;
	localStorage.birthdayList = options.birthdayList;
	localStorage.invertColor = options.invertColor;
	localStorage.useLocation = options.useLocation;
	localStorage.location = options.location;

	console.log("Got options: " + JSON.stringify(options));
	return options;
}

function getQueryParam(variable, defaultValue){
	var query = location.search.substring(1);
	var vars = query.split('&');
	for(var i = 0; i < vars.length; i++){
		var pair = vars[i].split('=');
		if(pair[0] === variable) {
			return decodeURIComponent(pair[1]);
		}
	}
	return defaultValue || false;
}

function updateLocationBox(){
	if(!document.getElementById("locationUsageCheckbox").checked){
		document.getElementById("locationCityBox").style.display = "block";
	}else{
		document.getElementById("locationCityBox").style.display = "none";
		document.getElementById("locationCityBox").value = "";
	}
}

document.getElementById("locationUsageCheckbox").onclick = function(){
	if(!this.checked)
		document.getElementById("locationCityBox").style.display = "block";
	else{
		document.getElementById("locationCityBox").style.display = "none";
		document.getElementById("locationCityBox").value = "";
	}
};

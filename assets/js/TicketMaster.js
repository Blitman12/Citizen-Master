var searchInput = document.querySelector('input');
var searchButtonEl = document.getElementById('searchButton')
var city = 0;

var page = 0;

function getEvents(page) {
    city = searchInput.value;
    $('#events-panel').show();
    $('#attraction-panel').hide();

    if (page < 0) {
        page = 0;
        return;
    }
    if (page > 0) {
        if (page > getEvents.json.page.totalPages - 1) {
            page = 0;
        }
    }

    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/events.json?apikey=pLOeuGq2JL05uEGrZG7DuGWu6sh2OnMz&size=4&page=0" + "&city=" + city,
        async: true,
        dataType: "json",
        success: function (json) {
            getEvents.json = json;
            showEvents(json);
        },
        error: function (xhr, status, err) {
            console.log(err);
        }
    });
}

function showEvents(json) {
    console.log("success")
    for (var i = 0; i < json._embedded.events.length; i++) {
        var eventName = json._embedded.events[i].name;
        var eventDescription = json._embedded.events[i].id;
        var eventURL = json._embedded.events[i].url;
        var eventImageURL = json._embedded.events[i].images[i].url;
        if (json._embedded.events[i].priceRanges == undefined) {
            var currency = "";
            var eventCost = "Data not available";
        } else {
            var currency = json._embedded.events[i].priceRanges[0].currency;
            var eventCost = ' ' + json._embedded.events[i].priceRanges[0].min;
        }
        //console.log(json._embedded.events[1].priceRanges[0].currency)
        appendAPIresponse(eventName, eventDescription, eventURL, eventImageURL, currency, eventCost)
    }

}

$("#prev").click(function () {
    getEvents(--page);
});

$("#next").click(function () {
    getEvents(++page);
});

// function getAttraction(id) {
//     $.ajax({
//         type: "GET",
//         url: "https://app.ticketmaster.com/discovery/v2/attractions/" + id + ".json?apikey=pLOeuGq2JL05uEGrZG7DuGWu6sh2OnMz",
//         async: true,
//         dataType: "json",
//         success: function (json) {
//             showAttraction(json);
//         },
//         error: function (xhr, status, err) {
//             console.log(err);
//         }
//     });
// }

function showAttraction(json) {
    $("#events-panel").hide();
    $("#attraction-panel").show();

    $("#attraction-panel").click(function () {
        getEvents(page);
    });

    $("#attraction .list-group-item-heading").first().text(json.name);
    $("#attraction img").first().attr('src', json.images[0].url);
    $("#classification").text(json.classifications[0].segment.name + " - " + json.classifications[0].genre.name + " - " + json.classifications[0].subGenre.name);
}

//getEvents(page);

//Takes the API data from TicketMaster and displays it to the page if the right data is passed through.
function appendAPIresponse(eventTitleAPI, eventDescriptionAPI, eventURLAPI, eventImageURLAPI, currencyAPI, eventCostAPI) {

    if (!eventTitleAPI || !eventDescriptionAPI || !eventURLAPI || !eventImageURLAPI || !currencyAPI || !eventCostAPI) {
        console.log("You need to pass more data through!")
    } else {
        //Create the body elements
        var Parent = document.querySelector('.panel-heading');
        var panelBody = document.createElement("div");
        var events = document.createElement("div");
        var eventImage = document.createElement("img")
        var groupItem = document.createElement("a");
        var groupItemHeading = document.createElement("h4");
        var eventInformationStyling = document.createElement("div");
        var groupItemText = document.createElement("p");
        var eventPrice = document.createElement("p");
        var venue = document.createElement("p");

        //modifications
        panelBody.setAttribute('class', 'panel-body');

        events.setAttribute('id', 'events');
        events.setAttribute('class', 'list-group')

        eventImage.setAttribute('src', eventImageURLAPI);
        eventImage.setAttribute('class', 'uk-width-1-6');

        groupItem.setAttribute('href', eventURLAPI);
        groupItem.setAttribute('class', 'list-item-group');

        groupItemHeading.setAttribute('class', 'list-group-item-heading');
        groupItemHeading.textContent = eventTitleAPI;

        eventInformationStyling.setAttribute('class', 'uk-flex uk-flex-inline uk-width-1-1');
        eventInformationStyling.setAttribute('style', 'background: whitesmoke;');

        groupItemText.setAttribute('class', 'list-group-item-text uk-width-5-6 uk-flex-between');
        groupItemText.textContent = eventDescriptionAPI;

        eventPrice.setAttribute('class', 'list-group-item-text uk-width-1-6 uk-flex-between');
        eventPrice.textContent = currencyAPI + eventCostAPI;

        venue.setAttribute('class', 'venue');
        venue.textContent = '';

        //append data
        panelBody.appendChild(events);
        events.appendChild(groupItem);
        groupItem.appendChild(groupItemHeading);
        groupItem.appendChild(eventInformationStyling);
        eventInformationStyling.appendChild(eventImage);
        eventInformationStyling.appendChild(groupItemText);
        eventInformationStyling.appendChild(eventPrice);
        eventInformationStyling.appendChild(venue)
        Parent.prepend(panelBody);
    }
}

function searchButtonTest() {
    console.log("Im here")
}

searchButtonEl.addEventListener("click", getEvents);

//appendAPIresponse(eventTitleAPI, eventDescriptionAPI, eventURLAPI, eventImageURLAPI, currencyAPI, eventCostAPI);

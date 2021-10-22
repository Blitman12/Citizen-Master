var page = 0;

function getEvents(page) {

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
        url: "https://app.ticketmaster.com/discovery/v2/events.json?apikey=pLOeuGq2JL05uEGrZG7DuGWu6sh2OnMz&size=4&page=" + page,
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
    var items = $("#events .list-group-item");
    items.hide();
    var events = json._embedded.events;
    var item = items.first();
    for (var i = 0; i < events.length; i++) {
        item.children('.list-group-item-heading').text(events[i].name);
        item.children('.list-group-item-text').text(events[i].dates.start.localDate);
        try {
            item.children(".venue").text(events[i]._embedded.venues[0].name + " in " + events[i]._embedded.venues[0].city.name);
        } catch (err) {
            console.log(err);
        }
        item.show();
        item.off("click");
        item.click(events[i], function (eventObject) {
            console.log(eventObject.data);
            try {
                getAttraction(eventObject.data._embedded.attractions[0].id);
            } catch (err) {
                console.log(err);
            }
        });
        item = item.next();
    }
}

$("#prev").click(function () {
    getEvents(--page);
});

$("#next").click(function () {
    getEvents(++page);
});

function getAttraction(id) {
    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/attractions/" + id + ".json?apikey=pLOeuGq2JL05uEGrZG7DuGWu6sh2OnMz",
        async: true,
        dataType: "json",
        success: function (json) {
            showAttraction(json);
        },
        error: function (xhr, status, err) {
            console.log(err);
        }
    });
}

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

getEvents(page);







//Takes the API data from TicketMaster and displays it to the page if the right data is passed through.
function appendAPIresponse(eventTitleAPI, eventDescriptionAPI, eventURLAPI) {

    if (!eventTitleAPI || !eventDescriptionAPI || !eventURLAPI) {
        console.log("You need to pass more data through!")
    } else {
        //Create the body elements
        var Parent = document.querySelector('.panel-heading');
        var panelBody = document.createElement("div");
        var events = document.createElement("div");
        var groupItem = document.createElement("a");
        var groupItemHeading = document.createElement("h4")
        var groupItemText = document.createElement("p");
        var venue = document.createElement("p");

        //modifications
        panelBody.setAttribute('class', 'panel-body');

        events.setAttribute('id', 'events');
        events.setAttribute('class', 'list-group')

        groupItem.setAttribute('href', eventURLAPI);
        groupItem.setAttribute('class', 'list-item-group');

        groupItemHeading.setAttribute('class', 'list-group-item-heading');
        groupItemHeading.textContent = eventTitleAPI;

        groupItemText.setAttribute('class', 'list-group-item-text');
        groupItemText.textContent = eventDescriptionAPI;

        venue.setAttribute('class', 'venue');
        venue.textContent = '';

        //append data
        panelBody.appendChild(events);
        events.appendChild(groupItem);
        groupItem.appendChild(groupItemHeading);
        groupItem.appendChild(groupItemText);
        groupItem.appendChild(venue)
        Parent.prepend(panelBody);
    }
}

appendAPIresponse("Fall Out Boy", "This is a concert", "./Link will go here");
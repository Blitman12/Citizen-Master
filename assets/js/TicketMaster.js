var searchInput = document.querySelector('input');
var searchButtonEl = document.getElementById('searchButton')
var city = "";
var Parent = document.querySelector('#events');
var searchHistoryButton = document.getElementById("ticket-target")


function getEvents(cityName) {
    city = cityName
    if (searchInput.value) {
        city = searchInput.value
    }

    $.ajax({
        type: "GET",
        url: `https://app.ticketmaster.com/discovery/v2/events.json?apikey=pLOeuGq2JL05uEGrZG7DuGWu6sh2OnMz&size=4&page=0&city=${city}`,
        async: true,
        dataType: "json",
        success: function (json) {
            getEvents.json = json;
            console.log(this.url)
            showEvents(json);
        },
        error: function (xhr, status, err) {
            console.log(err);
        }
    });
}

function showEvents(json) {
    console.log(json)
    Parent.innerHTML = ""
    for (var i = 0; i < json._embedded.events.length; i++) {
        var eventName = json._embedded.events[i].name;
        var eventDescription = json._embedded.events[i].id;
        var eventURL = json._embedded.events[i].url;
        var eventImageURL = json._embedded.events[i].images[i].url;
        if (json._embedded.events[i].priceRanges == undefined) {
            var currency = "---";
            var eventCost = "Data not available";
        } else {
            var currency = json._embedded.events[i].priceRanges[0].currency;
            var eventCost = ' ' + json._embedded.events[i].priceRanges[0].min;
        }
        console.log(json)
        appendAPIresponse(eventName, eventDescription, eventURL, eventImageURL, currency, eventCost)
    }

}

//Takes the API data from TicketMaster and displays it to the page if the right data is passed through.
function appendAPIresponse(eventTitleAPI, eventDescriptionAPI, eventURLAPI, eventImageURLAPI, currencyAPI, eventCostAPI) {
    if (!eventTitleAPI || !eventDescriptionAPI || !eventURLAPI || !eventImageURLAPI || !currencyAPI || !eventCostAPI) {
        console.log("You need to pass more data through!")
    } else {
        // Create Elements
        let containerDiv = document.createElement("div")
        let oneEventDiv = document.createElement("div")
        let imageEl = document.createElement("img")
        let canvasEl = document.createElement("canvas")
        let titleDiv = document.createElement("div")
        let h3Div = document.createElement("h3")
        let pEl = document.createElement("p")
        let divLink = document.createElement("a")

        // Modify Elements
        containerDiv.classList.add("uk-card", "uk-card-default", "uk-grid-collapse", "uk-width-1-1", "uk-margin-top")
        containerDiv.setAttribute("uk-grid", "")
        containerDiv.setAttribute("style", "z-index: -1")
        divLink.setAttribute("href", eventURLAPI)
        divLink.classList.add("uk-margin-remove", "uk-padding-remove")
        divLink.setAttribute("target", "_blank")
        oneEventDiv.classList.add("uk-card-media-left", "uk-cover-container")
        imageEl.setAttribute("uk-cover", "")
        imageEl.setAttribute('src', eventImageURLAPI);
        titleDiv.classList.add("uk-card-body", "uk-margin-left")
        h3Div.classList.add("uk-card-title")
        h3Div.textContent = eventTitleAPI;
        pEl.textContent = currencyAPI + eventCostAPI;

        // Append To The Page
        oneEventDiv.appendChild(imageEl)
        oneEventDiv.appendChild(canvasEl)
        titleDiv.appendChild(h3Div)
        titleDiv.appendChild(pEl)
        containerDiv.appendChild(oneEventDiv)
        containerDiv.appendChild(titleDiv)
        divLink.appendChild(containerDiv)
        Parent.prepend(divLink);
    }
}

searchButtonEl.addEventListener("click", event => {
    event.preventDefault()
    getEvents()
});

searchHistoryButton.addEventListener("click", event => {
    event.preventDefault()
    let cityName = event.target.innerText
    getEvents(cityName)
})
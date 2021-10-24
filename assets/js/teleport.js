// creating gloval variables to use in function calls
let geoId = "";
let scoreFetchURL = "";
let isHistoryActive = false;

// Grabbed HTML elements
let body = document.querySelector("body")
let selectedCity = document.querySelector("input")
let searchButton = document.querySelector(".uk-button-default")
let scoresCityName = document.getElementById("scoresCityName")
let cityScoresDisplay = document.querySelector(".cityScores")
let searchHistoryContainer = document.getElementById("search-history-container")
let searchBar = document.getElementById("searchBar")
let searchForm = document.querySelector("form")
let historyCloseButton = document.getElementById("close-button")

// Created HTML elements
let containerEl = document.createElement("div");
let historyContainerEl = document.createElement("div")

// get items from localStorage, if there are none then create an empy array for future use
let cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];



// the first Fetch call to grab the Most Popular city related to the search
let intialCall = (event) => {
    event.preventDefault()
    containerEl.innerHTML = ""
    let searchedCity = selectedCity.value;

    // quick error handling for if they have nothing entered
    if (searchedCity === "") {
        scoresCityName.textContent = "Please enter a city"
        return
    }
    fetch(`https://api.teleport.org/api/cities/?search=${searchedCity}`).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // Should this continue?
                let shouldContinue = data._embedded["city:search-results"].length
                if (shouldContinue > 0) {
                    scoresCityName.textContent = data._embedded["city:search-results"][0].matching_full_name
                    geoId = data._embedded["city:search-results"][0]._links["city:item"].href
                    secondaryCall(geoId)
                } else {
                    scoresCityName.textContent = "We do not yet have information on this city"
                }
            })
        } else {
            scoresCityName.textContent = "We do not yet have information on this city"
        }
    })
        .catch(function (error) {
            console.log(error);
            alert("Unable to connect to Teleport API")
        })
}

// Second fetch using the previously fetched URL to get the next step. Getting url for Scores
let secondaryCall = () => {
    fetch(geoId).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // Should this continue? 
                let shouldContinue = data._links["city:urban_area"] !== undefined
                if (shouldContinue) {
                    scoreFetchURL = data._links["city:urban_area"].href + "scores/"
                    finalCall()
                } else {
                    scoresCityName.textContent = "We do not yet have information on this city"
                }
            })
        } else {
            scoresCityName.textContent = "We do not yet have information on this city"
        }
    })
        .catch(function (error) {
            console.log(error);
            alert("Unable to connect to Teleport API")
        })
}

// The last Fetch for Teleport API that will filter information, save to localStorage, and give fetched information to the displayData function
let finalCall = () => {
    fetch(scoreFetchURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                let information = data.categories

                // Filtering unwanted information from array returned
                let unWantedInformation = [2, 3, 4, 6, 11, 12, 13, 15, 16]

                // storing the wanted information in a new array
                let wantedInformation = information.filter(function (value, index) {
                    return unWantedInformation.indexOf(index) == -1
                })

                // adding the selected city to the history if it made it through all the errors
                cityHistory.push(selectedCity.value)
                saveSearch()
                displayData(wantedInformation)
            })
        } else {
            scoresCityName.textContent = "We do not yet have information on this city"
        }
    })
        .catch(function (error) {
            console.log(error);
            alert("Unable to connect to Teleport API")
        })
}

// Displaying all the data collected from the last fetch to the DOM
let displayData = (informationArr) => {
    containerEl.innerHTML = ""

    for (let i = 0; i < informationArr.length; i++) {
        // locally created elements
        let internalDiv = document.createElement("div")
        let nameEl = document.createElement("h5")
        let scoreEl = document.createElement("p")
        let scoreSpan = document.createElement("span")
        let scoreBar = document.createElement("progress")
        let dividerIcon = document.createElement("hr")

        // rounds the score to the nearest whole value
        let scoreRounded = Math.round(informationArr[i].score_out_of_10)

        // Modifing all the elements with classes/textContent
        dividerIcon.classList.add("uk-divider-small")
        nameEl.textContent = informationArr[i].name;
        scoreEl.textContent = "Score: ";
        scoreSpan.textContent = scoreRounded
        scoreBar.setAttribute("value", scoreRounded)
        scoreBar.setAttribute("max", 10)
        internalDiv.classList.add("uk-background-primary", "uk-light", "uk-padding", "uk-panel", "uk-margin-top", "uk-border-pill")
        containerEl.classList.add("uk-text-center")

        // logic for changing the color of the Score
        if (scoreRounded < 4) {
            scoreSpan.style.cssText = "color: red;"
        } else if (scoreRounded >= 4 && scoreRounded < 7) {
            scoreSpan.style.cssText = "color: orange;"
        } else {
            scoreSpan.style.cssText = "color: #65FF00;"
        }

        // appending all the elements to the DOM
        scoreEl.appendChild(scoreSpan)
        internalDiv.appendChild(nameEl)
        internalDiv.appendChild(scoreEl)
        internalDiv.appendChild(scoreBar)
        containerEl.appendChild(internalDiv)
        containerEl.appendChild(dividerIcon)
        cityScoresDisplay.appendChild(containerEl)
    }
}

// This saves our searched city to the DOM
let saveSearch = () => {
    localStorage.setItem("cityHistory", JSON.stringify(cityHistory))
    loadHistory();
}

// This loads the history if present and creates buttons for easier data grabbing for revisits
let loadHistory = () => {
    // Gathering all classes with a remove-me attribute to determine if the buttons already exists (helps with duplication)
    let doesExist = document.getElementsByClassName("remove-me")

    // if there is nothing in localStorage then just return out of this function
    if (cityHistory.length === 0) {
        return
    }

    // if there are already buttons created, reset them and build them again to prevent duplication
    if (doesExist.length > 0) {
        historyContainerEl.innerHTML = ""
    }

    // Checks if localStorage is greater then 5. If it is then remove the first index, and then reload to save the new one
    if (cityHistory.length > 5) {
        cityHistory.shift()
        saveSearch()
        return
    }

    // Loops through the less than 6 localStorage array and creates buttons
    for (let i = 0; i < cityHistory.length; i++) {
        // Create Elements
        let containerEl = document.createElement("div")
        let containerTitleEl = document.createElement("h3")
        let containerAEl = document.createElement("a")

        // Modify Elements
        containerEl.classList.add("remove-me", "uk-flex", "uk-flex-row", "uk-flex-between")
        containerTitleEl.classList.add("uk-card-title")
        containerAEl.setAttribute("uk-search-icon", "")
        containerTitleEl.textContent = cityHistory[i]

        // Append Elements
        containerEl.appendChild(containerTitleEl)
        containerEl.appendChild(containerAEl)
        historyContainerEl.prepend(containerEl)
        searchHistoryContainer.appendChild(historyContainerEl)
    }

}

let toggleHistoryShow = () => {
    searchBar.classList.remove("toggle-hide")
}

let toggleHistoryHide = () => {
    searchBar.classList.add("toggle-hide")
}


searchForm.addEventListener("click", toggleHistoryShow)
historyCloseButton.addEventListener("click", toggleHistoryHide)


// This starts the fetch calls for when the search button is clicked
searchButton.addEventListener("click", intialCall)

// Display buttons on page upon load if there is localStorage present
loadHistory()
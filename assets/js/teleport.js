let geoId = "";
let scoreFetchURL = "";
let body = document.querySelector("body")
let selectedCity = document.querySelector("input")
let searchButton = document.querySelector(".uk-button-default")
let scoresCityName = document.getElementById("scoresCityName")
let cityScoresDisplay = document.querySelector(".cityScores")

let containerEl = document.createElement("div");


let intialCall = (event) => {
    event.preventDefault()
    containerEl.innerHTML = ""
    let searchedCity = selectedCity.value;
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
                    alert("We do not yet have information on this city. Please check back later")
                }
            })
        } else {
            alert("Error: Please ensure your spelling is correct or select another city")
        }
    })
    .catch(function (error) {
        console.log(error);
        alert("Unable to connect to Teleport API")
    })
}

let secondaryCall = () => {
    fetch(geoId).then(function(response) {
        if(response.ok) {
            response.json().then(function (data) {
                // Should this continue? 
                let shouldContinue = data._links["city:urban_area"] !== undefined
                if (shouldContinue) {
                    scoreFetchURL = data._links["city:urban_area"].href + "scores/"
                    finalCall()
                } else {
                    scoresCityName.textContent = "We do not yet have information on this city"
                    alert("We do not yet have information on this city. Please check back later")
                }
            })
        } else {
            alert("Error: Please ensure your spelling is correct or select another city")
        }
    })
    .catch(function (error) {
        console.log(error);
        alert("Unable to connect to Teleport API")
    })
}


let finalCall = () => {
    fetch(scoreFetchURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data)
                let information = data.categories
                // Filtering unwanted information from array returned
                let unWantedInformation = [2,3,4,6,11,12,13,15,16]
                let wantedInformation = information.filter(function(value, index) {
                    return unWantedInformation.indexOf(index) == -1
                })
                displayData(wantedInformation)
            })
        } else {
            scoresCityName.textContent = "We do not yet have information on this city"
            alert("Error: Please ensure your spelling is correct or select another city")
        }
    })
    .catch(function (error) {
        console.log(error);
        alert("Unable to connect to Teleport API")
    })
}

let displayData = (informationArr) => {
    containerEl.innerHTML = ""

    for (let i = 0; i < informationArr.length; i++) {
        let internalDiv = document.createElement("div")
        let nameEl = document.createElement("h5")
        let scoreEl = document.createElement("p")
        let scoreSpan = document.createElement("span")
        let scoreBar = document.createElement("progress")
        let scoreRounded = Math.round(informationArr[i].score_out_of_10)
        let dividerIcon  = document.createElement("hr")
        
        dividerIcon.classList.add("uk-divider-small")
        nameEl.textContent = informationArr[i].name;
        scoreEl.textContent = "Score: ";
        scoreSpan.textContent = scoreRounded
        scoreBar.setAttribute("value", scoreRounded)
        scoreBar.setAttribute("max", 10)
        internalDiv.classList.add("uk-background-primary", "uk-light", "uk-padding", "uk-panel", "uk-margin-top", "uk-border-pill")
        containerEl.classList.add("uk-text-center")
        if (scoreRounded < 4) {
            scoreSpan.style.cssText = "color: red;"
        } else if (scoreRounded > 4 && scoreRounded < 7) {
            scoreSpan.style.cssText = "color: orange;"
        } else {
            scoreSpan.style.cssText = "color: #65FF00;"
        }
        

        scoreEl.appendChild(scoreSpan)
        
        internalDiv.appendChild(nameEl)
        internalDiv.appendChild(scoreEl)
        internalDiv.appendChild(scoreBar)
        
        containerEl.appendChild(internalDiv)
        containerEl.appendChild(dividerIcon)
        cityScoresDisplay.appendChild(containerEl)
    }
}




searchButton.addEventListener("click", intialCall)

let geoId = "";
let scoreFetchURL = "";
let body = document.querySelector("body")
let selectedCity = document.querySelector("input")
let searchButton = document.getElementById("city-search-button")

let containerEl = document.createElement("div");


let intialCall = (event) => {
    event.preventDefault()
    let searchedCity = selectedCity.value;
    fetch(`https://api.teleport.org/api/cities/?search=${searchedCity}`).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data)
                geoId = data._embedded["city:search-results"][0]._links["city:item"].href
                secondaryCall(geoId)
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
                let shouldContinue = data._links["city:urban_area"] !== undefined
                console.log(data._links["city:urban_area"] !== undefined)
                if (shouldContinue) {
                    scoreFetchURL = data._links["city:urban_area"].href + "scores/"
                    finalCall()
                } else {
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
                let information = data.categories
                // Filtering unwanted information from array returned
                let unWantedInformation = [2,3,4,6,11,12,13,15,16]
                let wantedInformation = information.filter(function(value, index) {
                    return unWantedInformation.indexOf(index) == -1
                })
                displayData(wantedInformation)
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

let displayData = (informationArr) => {
    containerEl.innerHTML = ""

    for (let i = 0; i < informationArr.length; i++) {
        let nameEl = document.createElement("h1")
        let scoreEl = document.createElement("p")
        let scoreSpan = document.createElement("span")
        let scoreBar = document.createElement("progress")
        let scoreRounded = Math.round(informationArr[i].score_out_of_10)
        console.log(scoreRounded)
        
        nameEl.textContent = informationArr[i].name;
        scoreEl.textContent = "Score: ";
        scoreSpan.textContent = scoreRounded
        scoreBar.setAttribute("value", scoreRounded)
        scoreBar.setAttribute("max", 10)

        scoreSpan.style.cssText = "color: " + informationArr[i].color + ";"

        scoreEl.appendChild(scoreSpan)
        containerEl.appendChild(nameEl)
        containerEl.appendChild(scoreEl)
        containerEl.appendChild(scoreBar)

        body.appendChild(containerEl)
    }
}




searchButton.addEventListener("click", intialCall)

// scoresContainerEl

// HTML For This
/* <form>
<h2>Search for a city</h2>
<input placeholder="phoenix" type="text"></input>
<button id="city-search-button">Search</button>
</form> */
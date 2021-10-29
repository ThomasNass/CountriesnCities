const onDisplay = document.querySelector(".on-display");
const cities = document.querySelector(".cities");
const listCountries = document.querySelector(".countries");
const visitedCity = document.querySelector(".visited-city");
const cityDiv = document.querySelector(".city");
const infoDiv = document.querySelector(".display");
const visitedDiv = document.querySelector(".visited");
let visited = [];

//Declaring JSON-files as variables so that I can make a general function for fetching them
const stad = "stad.json";
const land = "land.json";

//The general function for fecthing JSON-data
const getData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

//Function that collects JSON-data and passes it onward to the renderVisitedPage- and renderCountryBtns functions
const renderAll = async () => {
    const data = await getData(land);
    const data2 = await sortTown();

    renderCountryBtns(data, data2);
    renderVisitedPage(data2);
}


//Function to render The countries as buttons, nothing fancy
const renderCountryBtns = (data, data2) => {
    for (i = 0; i < data.length; i++) {
        const liCountry = document.createElement("li");
        const countryButton = document.createElement("button");
        countryButton.id = `${data[i].id}`;
        countryButton.textContent = `${data[i].countryname}`;
        countryButton.addEventListener("click", () => {
            //Hides visited and info if they are visible
            //and displays the div containing relevant cities if 
            //a country button is pressed 
            //similar code will reocurr later on
            cityDiv.style.display = "block";
            infoDiv.style.display = "none";
            visitedDiv.style.display = "none";
            renderCityBtns(countryButton, data2);
        })
        listCountries.appendChild(liCountry);
        liCountry.appendChild(countryButton);

    }
}

//Function that renders are for visited cities, the possible total people met as well as a clear cities visited button
const renderVisitedPage = (data2) => {
    const visitedButton = document.createElement("button");
    visitedButton.id = "visitedButton";
    visitedButton.textContent = "Städer jag besökt";
    visitedButton.addEventListener("click", () => {
        visitedDiv.style.display = "block";
        cityDiv.style.display = "none";
        infoDiv.style.display = "none";
        //Checking if the desired array is in localStorage
        if (localStorage.getItem("visited")) {
            visited = JSON.parse(localStorage.getItem("visited"));
            erase(visitedCity, cities, onDisplay);
            const clearLSBtn = document.createElement("button");
            clearLSBtn.textContent = "Töm lista över besökta städer";
            clearLSBtn.addEventListener("click", () => {
                localStorage.removeItem("visited");
                visited = [];
                erase(visitedCity);
                notVisited();
            })

            //declaring array for use in coming for loops
            let peopleMet = [];
            //nested for loops that check the data2 id for matches with the array from localStorage
            //and adds the population to the peopleMet array
            //as well as adds the visited city to the page
            for (i = 0; i < data2.length; i++) {
                for (j = 0; j < visited.length; j++) {
                    if (data2[i].id == visited[j]) {
                        peopleMet.push(data2[i].population);
                        const li = document.createElement("li");
                        li.textContent = `Du har besökt ${data2[i].stadname}`;
                        visitedCity.appendChild(li);
                    }
                }
            }
            //function that adds elements together
            const totalPeople = (a, b) => a + b;
            const p = document.createElement("p");
            p.textContent = `Antalet människor som du teoretiskt skulle ha kunnat komma i kontakt med genom dina resor är: ${peopleMet.reduce(totalPeople)}`;
            visitedCity.appendChild(p);
            visitedCity.appendChild(clearLSBtn);
        }
        else notVisited();
    })
    listCountries.appendChild(visitedButton);
}

//Function that renders the cities as buttons
const renderCityBtns = (countryButton, data2) => {
    erase(cities, onDisplay, visitedCity);
    for (i = 0; i < data2.length; i++) {
        if (countryButton.id == data2[i].countryid) {
            const liCity = document.createElement("li");
            const cityButton = document.createElement("button");
            cityButton.id = `${data2[i].stadname}`;
            cityButton.textContent = `${data2[i].stadname}`;
            cityButton.addEventListener("click", () => {
                infoDiv.style.display = "block";
                renderCityInfo(cityButton, data2);
            })
            cities.appendChild(liCity);
            liCity.appendChild(cityButton);
        }
    }
}

//Function that renders the information of the city you clicked on
///as well as a button to store the city as visited
const renderCityInfo = (cityButton, data2) => {
    erase(onDisplay);
    for (i = 0; i < data2.length; i++) {
        if (cityButton.id == data2[i].stadname) {
            const p = document.createElement("p");
            const storeCityButton = document.createElement("button");
            storeCityButton.id = `${data2[i].stadname}${data2[i].id}`
            storeCityButton.textContent = "Lägg till stad som besökt";
            p.textContent = `Antalet invånare i ${data2[i].stadname} är : ${data2[i].population} `;
            storeCityButton.addEventListener("click", () => {
                storeInLS(storeCityButton, data2);
            })
            onDisplay.appendChild(p);
            onDisplay.appendChild(storeCityButton);
        }
    }
}

//Function that grabs the array from LS if there is any
//then pushes the ID to the array
//It then removes duplicates and send the array to localStorage
const storeInLS = (storeCityButton, data2) => {
    for (i = 0; i < data2.length; i++) {
        if (storeCityButton.id == `${data2[i].stadname}${data2[i].id}`) {
            if (localStorage.getItem("visited")) {
                visited = JSON.parse(localStorage.getItem("visited"));
            }
            visited.push(data2[i].id);
            const distinctVisited = [...new Set(visited)];
            localStorage.setItem("visited", JSON.stringify(distinctVisited));
        }
    }
}

// sorts towns based on population
const sortTown = async () => {
    const data = await getData(stad);
    const sorted = data.sort((a, b) => b.population - a.population);
    return sorted;

}

// function to append reoccuring paragraph when the user has not visited any cities
const notVisited = () => {
    const p = document.createElement("p");
    p.textContent = "Du har inte besökt några städer";
    visitedCity.appendChild(p);
}

//function to erase content of lists. Uses magical shorthand called rest parameters that allows an indefinite number of arguments as an array. Magic.
const erase = (...args) => {

    for (let i = 0; i < args.length; i++) {
        while (args[i].firstChild) {
            args[i].firstChild.remove();
        }
    }
}

renderAll();
sortTown();

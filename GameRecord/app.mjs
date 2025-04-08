import Game from "./modules/game.mjs";


const FILE_INPUT_ELEMENT = document.querySelector("input#fileUploader");
const INDEX_DISPLAY_ELEMENT = document.querySelector("span#indexPosition");
const OUTPUT_ELEMENT = document.querySelector("div#display");
const SORT_ELEMENT = document.querySelector("select#sortOptions");
let games = [];

const STORAGE_NAME = "GameStorage";


if(localStorage[STORAGE_NAME]) {
    processFileContents(localStorage[STORAGE_NAME]);
}


    
function getData() {
    return parseJson(localStorage.getItem(STORAGE_NAME));
}

function saveData(data) {
    localStorage.setItem(STORAGE_NAME, serializeJson(data));
}

function serializeJson(value) {
    try {
        return JSON.stringify(value);;
    } catch {
        return null;
    }
}

function parseJson(value) {
    
    try {
        return JSON.parse(value);
    } catch {
        return value;
    }
}
    
function readFile(file, callBackFunction) {
    const reader = new FileReader();
    reader.onload = (evt) => {
        callBackFunction.call(this, evt.target.result);
    };
    reader.readAsText(file);
}

FILE_INPUT_ELEMENT.addEventListener("change", function() {
    if(localStorage.length>0) {
        localStorage.clear();
    }
    readFile(this.files[0], processFileContents);
    this.value = "";
});

function processFileContents(fileData) {
    let jsonObjectOfContentsFromExampleDotJson = JSON.parse(fileData);
    saveData(jsonObjectOfContentsFromExampleDotJson );

    games = [];

    for( let i = 0; i < jsonObjectOfContentsFromExampleDotJson.length; i++){
        let col = jsonObjectOfContentsFromExampleDotJson[i];
        games.push(new Game(col.title, col.designer, col.artist, col.publisher, col.year, col.players, col.time, col.difficulty, col.url, col.playCount, col.personalRating))
    }
    console.log(games);

    saveData(games);

    display();
}

function createEntry(index, propertyName, propertyValue) {
    let brandElement = document.createElement("label");
    brandElement.textContent = propertyName;
    let containerElement = document.createElement("div");
    containerElement.appendChild(brandElement);


    let inputTextElement = document.createElement("input");
        inputTextElement.setAttribute("index", index);
        inputTextElement.setAttribute("propertyName", propertyName);
        inputTextElement.value = propertyValue;
        inputTextElement.addEventListener("change", function(){
            games[this.getAttribute("index")][this.getAttribute("propertyName")] = this.value;
            saveData(games);
        });

     if(propertyName==="personalRating") {
        let inputRangeSlider = document.createElement("input");
        inputRangeSlider.type = "range";
        inputRangeSlider.setAttribute("index", index);
        inputRangeSlider.setAttribute("propertyName", propertyName);
        inputRangeSlider.value = propertyValue;
        inputRangeSlider.addEventListener("change", function() {
            games[this.getAttribute("index")][this.getAttribute("propertyName")] = this.value;
            saveData(games);
        });
        inputRangeSlider.min = 0;
        inputRangeSlider.max = 10;
        containerElement.appendChild(inputRangeSlider);
     } else if(propertyName==="playCount") {
        let playCountButton = document.createElement("button");
        playCountButton.textContent = "∆";
        playCountButton.setAttribute("index", index);
        playCountButton.setAttribute("propertyName", propertyName);
        playCountButton.addEventListener("click", function() {
            games[this.getAttribute("index")][this.getAttribute("propertyName")] ++;
            this.parentElement.querySelector("input[index][propertyName]").value = games[this.getAttribute("index")][this.getAttribute("propertyName")];
        });
        containerElement.appendChild(inputTextElement);
        containerElement.appendChild(playCountButton);
     } else {
        containerElement.appendChild(inputTextElement);
     }

     return containerElement;
}

document.querySelector("button#add").addEventListener("click", function() {
    let title = document.getElementById("newTitle").value;
    let designer = document.getElementById("newDesigner").value;
    let artist = document.getElementById("newArtist").value;
    let publisher = document.getElementById("newPublisher").value;
    let year = document.getElementById("newYear").value;
    let player = document.getElementById("newPlayer").value;
    let time = document.getElementById("newTime").value;
    let difficulty = document.getElementById("newDifficulty").value;
    let url = document.getElementById("newURL").value;
    let playCount = document.getElementById("newPlayCount").value;
    let rating = document.getElementById("newRating").value;
    games.push(new Game(title, designer, artist, publisher, year, player, time, difficulty, url, playCount, rating));
    saveData(games);
    display();
});

function display() {
    OUTPUT_ELEMENT.innerHTML = "";
    for(let i = 0; i < games.length; i++) {
        let containerElement = document.createElement("div");
        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("index", i);
        deleteButton.addEventListener("click", function() {
            let res = [];
            for (let j = 0; j < games.length; j++) {
                if(this.getAttribute("index")!=j) {
                    res.push(games[j]);
                }
            }
            games = res;
            display();
        });
        containerElement.className = "game-entry";
        const keys = Object.keys(games[i]);
        for(let j = 0; j < keys.length; j++) {
            containerElement.appendChild(createEntry(i, keys[j], games[i][keys[j]]));
        }
        containerElement.appendChild(deleteButton);
        OUTPUT_ELEMENT.appendChild(containerElement);
    }
}

SORT_ELEMENT.addEventListener("change", function(){
    sortBy(games, this.value);
    display();
})

function sortBy(array, propertyName) {
    array.sort(function(a, b) {
        if(a[propertyName]<b[propertyName])
            return -1;
        else
            return 1;
    });
}
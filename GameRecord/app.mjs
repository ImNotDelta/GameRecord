import Game from "./modules/game.mjs";


const FILE_INPUT_ELEMENT = document.querySelector("input#fileUploader");
const INDEX_DISPLAY_ELEMENT = document.querySelector("span#indexPosition");
const FILE_INDEXER_ELEMENT = document.querySelector("input[type=\"range\"]#inputSource");
//const OUTPUT_ELEMENT = document.querySelector("div#output");
//const SHOW_ALL_BUTTON = document.querySelector("button#showAllBtn");
//const ADD_NEW_GAME_BUTTON = document.querySelector("button#newGameFormAddButton");
//let newGameFormElements = document.querySelector("#newGameFormTable").querySelectorAll("input, select, span");
let games = [];

const STORAGE_NAME = "GameStorage";

    
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
    FILE_INDEXER_ELEMENT.max = jsonObjectOfContentsFromExampleDotJson .length-1;
    FILE_INDEXER_ELEMENT.value = 0;
    saveData(jsonObjectOfContentsFromExampleDotJson );
    games = jsonObjectOfContentsFromExampleDotJson ;
    console.log(games);
    //updateDataFields(0);
    //displayInfo();
}
var dirHistory = [];
var tableRowsStrings = [];
var tableRowsJSON = {};
var headers = ["filename", "type", "size", "atime", "mtime", "ctime", "birthtime"];
var sorts = [];
var onDesc = false;

makeRequest("/");
getDirName();
getHostName();


function getDirName(){
    fetch("api/getDirName").
    then(res => res.text()).
    then(res => document.getElementById("dirName").innerHTML = res).
    then(res => document.getElementById("dirNameGreen").innerHTML = res).
    then(res => dirHistory[0] = res)

}


function getHostName(){
    fetch("api/getHostName").
    then(res => res.json()).
    then(res => document.getElementById("hostname").innerHTML = res["hostname"])
}

function makeRequest(dir){

    if(dir != "/"){
        if(dirHistory[dirHistory.length -1] != dir){
            dir = dirHistory[dirHistory.length - 1] + dir;
        
            dirHistory[dirHistory.length] = dir;
        }
        
        document.getElementById("dirName").innerHTML = dir;
        document.getElementById("dirNameGreen").innerHTML = dir;
    }

    const body = {
        request: "dirinfo",
        dirpath: dir
    };

    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    }



    fetch("api", request).
        then(res => res.json()).
        then(res => {


            let tableStrVar ="<div id =\"dirTable\">";

            for(let i = 0; i < 7; i++){
                sorts[i] = "sortAsc";
            }

            tableStrVar += generateTableHeader();

            let allFiles = res.info.files;
            tableRowsJSON = allFiles;

            tableRowsStrings = [];  

	        for(let file in allFiles){

                let directory = false;

                if(allFiles[file]["type"] === "directory")
                    directory = true;
                

                let strVar = "";
		        strVar += "<file>";
		
		        for(var key in allFiles[file]){
                    let value = allFiles[file][key];
                    
                    
                    if(key === "filename" && directory === true){
                        value = "<directory><label id=\"dirButton\" onclick=\"newDir('"+value+"')\" >" + value + "<\/label><\/directory>";
                    }
                    
                
			        strVar += "<"+key+">" + value + "<\/"+key+">";
		        }

                strVar += "<\/file>";
            
                tableRowsStrings[tableRowsStrings.length] = strVar;
                tableStrVar += strVar;
            }

            tableStrVar += "<\/div>";

	        document.getElementById("dirTable").outerHTML = tableStrVar;
    
        });

}

function newDir(dir){
    makeRequest("/" + dir);
}

function prevDir(){
    let len = dirHistory.length;

    if(len === 1){
        dirHistory = [];
        makeRequest("/");
        getDirName();

    } else{

        dirHistory.pop();

        makeRequest(dirHistory[dirHistory.length - 1]);
    }
}

function generateTableHeader(){
    let strVar = "";
        
    strVar += "<file>";
        for(let i = 0; i < headers.length; i++){
            strVar += "<"+headers[i]+" class=\"heading\" onclick='"+sorts[i]+"(\""+headers[i]+"\")'>"+headers[i]+"<\/"+headers[i]+">";
        }
    strVar += "<\/file>";

    return strVar;
}

function handleClick(checked, name) {
    var column = document.getElementsByTagName(name);   
    
    if(checked){
        
        for(let i = 0; i < column.length; i++){
            column[i].style.display = "";
        }

    
    } else{

       
        for(let i = 0; i < column.length; i++){
            column[i].style.display = "none";
        }
    }
}

function sortAsc(heading){

    for(let i = 0; i < sorts.length; i++){
        sorts[i] = "sortAsc" ;
    }

    if(onDesc){
        onDesc = false;
        makeRequest(dirHistory[dirHistory.length-1]);

    } else{
        onDesc = true;
  
        let index = headers.indexOf(heading);
        sorts[index] = "sortDesc";

        console.log(tableRowsJSON);

        let values = getValues(heading);

        bubbleSort(values);
       
        refreshTable();
    }
}

function sortDesc(){
        
    for(let i = 0; i < sorts.length; i++){
        sorts[i] = "sortAsc" ;
    }

    tableRowsStrings.reverse();

    refreshTable();

}

function getValues(heading){
    let values = [];
    let c = 0;
    for(let file in tableRowsJSON){
        values[c] = tableRowsJSON[file][heading];
        c++;
    }
    return values;
}


function refreshTable(){
    let strTableVar = "";
    strTableVar = "<div id =\"dirTable\">";

    strTableVar += generateTableHeader();

    for(let i = 0; i < tableRowsStrings.length; i++){
        strTableVar += tableRowsStrings[i];
    }


    strTableVar += "<\/div>";

    document.getElementById("dirTable").outerHTML = strTableVar;

}

//https://stackoverflow.com/questions/7502489/bubble-sort-algorithm-javascript
function bubbleSort(values){

    var swapped;
    do {
        swapped = false;
        for (var i=0; i < values.length-1; i++) {
            if (values[i] > values[i+1]) {
                swap(i, values);
                swap(i, tableRowsStrings);
                swapped = true;
            }
        }
    } while (swapped);

}


function swap(i, array){
    var temp = array[i];
    array[i] = array[i+1];
    array[i+1] = temp;
}


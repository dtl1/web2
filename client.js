
fetch("api/getHostName").
    then(res => res.json()).
    then(res => document.getElementById("hostname").innerHTML = res["hostname"])

fetch("api/getDirName").
    then(res => res.text()).
    then(res => document.getElementById("dirName").innerHTML = res)


makeRequest("/")

function makeRequest(dir){

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

            let strVar = "";
            let allFiles = res.info.files;

	        for(let file in allFiles){

                let directory = false;

                if(allFiles[file]["type"] === "directory")
                    directory = true;
                
	
		        strVar += "<file>";
		
		        for(var key in allFiles[file]){
                    let value = allFiles[file][key];
                    
                    
                    if(key === "filename" && directory === true){
                        value = "<label id=\"dirButton\" onclick=\"newDir("+value+")\" >" + value + "<\/label>";
                    }
                    
                
			        strVar += "<"+key+">" + value + "<\/"+key+">";
		        }

		        strVar += "<\/file>";

	        }

	        document.getElementById("dirTable").outerHTML = strVar;
    


        });

}




function newDir(dir){
    

}












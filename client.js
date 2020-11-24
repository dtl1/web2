
fetch("api/getHostName").
    then(res => res.json()).
    then(res => document.getElementById("hostname").innerHTML = res["hostname"])


makeRequest("/");
getDirName();


function getDirName(){
    fetch("api/getDirName").
    then(res => res.text()).
    then(res => document.getElementById("dirName").innerHTML = res)
}




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


            let strVar ="<div id =\"dirTable\">";

            strVar += generateTableHeader();
            let allFiles = res.info.files;

	        for(let file in allFiles){

                let directory = false;

                if(allFiles[file]["type"] === "directory")
                    directory = true;
                
	
		        strVar += "<file>";
		
		        for(var key in allFiles[file]){
                    let value = allFiles[file][key];
                    
                    
                    if(key === "filename" && directory === true){
                        //value = "<label id=\"dirButton\" onclick=\"newDir("+value+")\" >" + value + "<\/label>";
                        value = "<label id=\"dirButton\" onclick=\"newDir('"+value+"')\" >" + value + "<\/label>";
                    }
                    
                
			        strVar += "<"+key+">" + value + "<\/"+key+">";
		        }

                strVar += "<\/file>";
            

            }

            strVar += "<\/div>";

	        document.getElementById("dirTable").outerHTML = strVar;
    
        });

}




function newDir(dir){
    makeRequest("/" + dir);
    getDirName();
}


function generateTableHeader(){
    let strVar = "";
        
    strVar += "<file>";
        strVar += "<filename class=\"heading\">filename<\/filename>";
        strVar += "<type class=\"heading\">type<\/type>";
        strVar += "<size class=\"heading\">size (bytes)<\/size>";
        strVar += "<atime class=\"heading\">atime<\/atime>";
        strVar += "<mtime class=\"heading\">mtime<\/mtime>";
        strVar += "<ctime class=\"heading\">ctime<\/ctime>";
        strVar += "<birthtime class=\"heading\">birthtime<\/birthtime>";
    strVar += "<\/file>";

    return strVar;
}











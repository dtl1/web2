const express = require("express");
const app = express();
app.use(express.json());

const os = require("os");
const fs = require('fs');
const path = require("path");
const { dirname } = require("path");
const port = process.getuid();


const page_css_file = "page.css";
const page_html_file = "page.html";
const script_file = "client.js";

const dir_parent_path = "/cs/home/dtl1/nginx_default/";

var current_dir_path = dir_parent_path;
var current_dir = "";


//process command line argument
const root = process.argv.slice(2, 3)[0];
console.log("root path: " + root);



//if user hasn't provided a root path
if(root == undefined){
		console.log("Please provide root directory");
		throw new Error("expected command line argument");
}



app.listen(port, () => console.log("Listening at port: " + port));


///////////////////////////////// get handlers ///////////////////////////////// 

//load page
app.get("/", (req, res) => {
	console.log("Received request for page load");
	res.sendFile(__dirname + "/" + page_html_file);
})

//load script file
app.get("/client.js", (req, res) => {
	console.log("Received request for script file");
	res.sendFile(__dirname + "/" + script_file);
})

//load page CSS
app.get("/page.css", (req, res) => {
	console.log("Recieved request for CSS file");
	res.sendFile(__dirname + "/" + page_css_file);
})


app.get("/api/getHostname", (req, res) => {
	res.send(JSON.stringify({ 'hostname': os.hostname() }))
})


app.get("/api/getDirName", (req, res) => {
	res.send(current_dir);
})

//////////////////////////////////////////////////////////////////////// 
 

app.post("/api", (req, res) => {
	console.log("Recieved post request from client");

	var dir = req.body.dirpath;

	if(dir === "/")
	dir = root;

	if(!(current_dir_path.endsWith(dir))){
		current_dir_path = current_dir_path + dir;
		current_dir = current_dir + dir;
	}
	
	const response = {
		response: "dirinfo",
		info: {
			server: "TODO",
			directoryname: dir,
			files: {}
		}

	}

		
	fs.readdirSync(current_dir_path).forEach(file => {
		let fileInfo = getFileInfo(current_dir_path, file);
		response["info"]["files"][file] = fileInfo;
	});



	res.send(response);

})




//////////////////////////////////////////////////////////////////////// 


function getFileInfo(directoryname, filename) {
    const fileInfo_keys = ["size", "atime", "mtime", "ctime", "birthtime"]
    let filePath = path.join(directoryname, filename);
    let fs_stats = fs.statSync(filePath);

    let fileInfo = {}

	fileInfo["filename"] = filename;

    let type = "unknown";
    if      (fs_stats.isFile())            { type = "file" }
    else if (fs_stats.isDirectory())       { type = "directory" }
    else if (fs_stats.isBlockDevice())     { type = "block" }
    else if (fs_stats.isCharacterDevice()) { type = "character" }
    else if (fs_stats.isFIFO())            { type = "fifo" }
    else if (fs_stats.isSocket())          { type = "socket" }
    fileInfo["type"] = type


    fileInfo_keys.forEach(k => {
        fileInfo[k] = fs_stats[k]
        if (k.includes("time")) {
            fileInfo[k] = fileInfo[k].toLocaleString("en-GB")
        }
	})
	


    return fileInfo
}




const ND_DEV_ID=process.env.ND_DEV_ID;
const ND_DEV_SECRET=process.env.ND_DEV_SECRET;
const ND_API_VER=process.env.ND_API_VER;
const ND_SERVICE_URL=process.env.ND_SERVICE_URL;
const CUSTOM_APP = btoa(ND_SERVICE_URL + "/" + ND_API_VER + "/custom/app.js"); 
// use ("/"+ND_API_VER+"B") in below to avoid redirect in nd webapp from https to http
const ND_WFE_VIEWER_URL=ND_SERVICE_URL+("/"+ND_API_VER+"B")+"/editService/" +CUSTOM_APP + "?nid=";

function uploadDocument(file:File) {
    const wfe=document.getElementById("wfe") as HTMLScriptElement;
    wfe.style.display="none";
    wfe.src="about:blank";
    const error=document.getElementById("error") as HTMLDivElement;
    error.style.display=null;
    error.innerText="Uploading...";
    const sessionURL=ND_SERVICE_URL+"/v1/"+ND_API_VER+ND_DEV_ID+"00000000000000000000000000"+"00000000000000000000000000"+"0000";
    var xhr = new XMLHttpRequest();
    xhr.withCredentials=false;
    xhr.open("POST", sessionURL + "/upload", true);
    xhr.setRequestHeader("Content-type", file.type);
    if (ND_DEV_SECRET && ND_DEV_SECRET.length>0) {
        xhr.setRequestHeader("X-ND-DEV-SECRET", ND_DEV_SECRET);
    }
    xhr.setRequestHeader("X-ND-AUTHOR", JSON.stringify({name: "WordFileEditor Demo"}));
    xhr.upload.onprogress=(progress)=>{
        error.innerText="Uploaded "+progress.loaded+ " bytes...";
    };
    xhr.onreadystatechange = function () {//Call a function when the state changes.
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (200===xhr.status) {
                const error=document.getElementById("error") as HTMLDivElement;
                error.style.display="none";
                var response=xhr.response;
                if (typeof(response)==="string") {
                    response=JSON.parse(response);
                }
                if (response.nid) {
                    const wfe=document.getElementById("wfe") as HTMLScriptElement;
                    wfe.style.display=null; // make visible
                    wfe.src=ND_WFE_VIEWER_URL+response.nid;
                }
            } else {
                const error=document.getElementById("error") as HTMLDivElement;
                error.style.display=null;
                error.innerText="Error "+xhr.status+" "+xhr.statusText;
            }
        }
    }
    xhr.responseType="json";
    xhr.send(file);
}

window.addEventListener("dragover", function(e) {
    e.preventDefault();    
});
window.addEventListener("drop", function(e) {
    try {
        var dt = e.dataTransfer;
        if (dt && dt.items && dt.items.length > 0) {
            if (dt.files && dt.files.length > 0) {
                uploadDocument(dt.files[0]);
            }
        }
    } finally {
        e.preventDefault();
    }

});

window.addEventListener("load", function() {
    const upload=document.getElementById("upload") as HTMLInputElement;
    upload.onchange=function(e) {
        const target=e.target as HTMLInputElement;
        const files=target.files;
        if (files && files.length>0) {
            if (files.length>0) {
                uploadDocument(files[0]);
            }
        }
    }

});

var fileImage;

document.getElementById("imageFace").addEventListener("change", (e) => {
    fileImage = e.target.files[0];
    const src = URL.createObjectURL(fileImage);
    document.getElementById("image").src = src;
})
document.getElementById("btnDetectLabel").addEventListener("click", (e) => {
    e.preventDefault();
    // let file = document.getElementsByTagName("input")[0].files[0];
    const fd = new FormData();

    fd.append("image", fileImage);
    axios({
        url: "/detectLabel",
        method: "post",
        headers: {
            'content-type': 'multipart/form-data'
        },
        data: fd,
    }).then(res => {
        //console.log(res.data.data.Labels);
        var result = res.data.data.Labels;
        var data = document.getElementById("data");
        data.innerHTML = ""
        for (let i = 0; i < result.length; i++) {
            data.innerHTML += `<span> Confidence: ${result[i].Confidence} </span><br>
                                <span> Name: ${result[i].Name}</span>`
            if (result[i].Parents.length != 0) {
                data.innerHTML += `<br><span> Parents: </span>`
            }
            for (let j = 0; j < result[i].Parents.length; j++) {
                data.innerHTML += `<span>${result[i].Parents[j].Name} , </span> `
            }
            data.innerHTML += `<br><br>`
        }
    });
})

document.getElementById("btnDetectFaces").addEventListener("click", (e) => {
    e.preventDefault();
    // let file = docsument.getElementsByTagName("input")[0].files[0];
    const fd = new FormData();

    fd.append("image", fileImage);
    axios({
        url: "/detectFace",
        method: "post",
        headers: {
            'content-type': 'multipart/form-data'
        },
        data: fd,
    }).then(res => {

        const result = res.data.data.FaceDetails;
        var image = document.getElementById("image")
        var boudiry = document.getElementById("image-container");

        data.innerHTML = ""
        for (let i = 0; i < result.length; i++) {
            var box = result[i].BoundingBox;
            var image = document.getElementById("image")
            boudiry.innerHTML += `<div class="boudiry" style="display: block;
                                                            height:${box.Height * image.height}px; 
                                                            width: ${box.Width * image.width}px;
                                                            top: ${box.Top * image.height}px; 
                                                            left: ${box.Left * image.width}px;
                                                            border: 2px solid green"> </div> `
        }
    });
})

document.getElementById("btnDetectText").addEventListener("click", (e) => {
    e.preventDefault();
    // let file = docsument.getElementsByTagName("input")[0].files[0];
    const fd = new FormData();

    fd.append("image", fileImage);
    axios({
        url: "/detectText",
        method: "post",
        headers: {
            'content-type': 'multipart/form-data'
        },
        data: fd,
    }).then(res => {
        var result = res.data.data.TextDetections;
        var data = document.getElementById("data");
        var boudiry = document.getElementById("image-container");
        data.innerHTML = ""
        for (let i = 0; i < result.length; i++) {
            var geometry = result[i].Geometry.BoundingBox;
            data.innerHTML += `<span> DetectText: ${result[i].DetectedText} </span><br>
                                <span> Type: ${result[i].Type}</span>`
            data.innerHTML += `<br><br>`
            var image = document.getElementById("image")
            boudiry.innerHTML += `<div class="boudiry" style="display: block;
                                                            height:${geometry.Height * image.height}px; 
                                                            width: ${geometry.Width * image.width}px;
                                                            top: ${geometry.Top * image.height}px; 
                                                            left: ${geometry.Left * image.width}px;"> </div> `
        }
    });
})
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
document.getElementById("btnRekogCeleb").addEventListener("click", (e) => {
    e.preventDefault();
    // let file = docsument.getElementsByTagName("input")[0].files[0];
    const fd = new FormData();

    fd.append("image", fileImage);
    axios({
        url: "/rekogCeleb",
        method: "post",
        headers: {
            'content-type': 'multipart/form-data'
        },
        data: fd,
    }).then(res => {
        celesDraw(res.data.data);
        
    });
})

document.getElementById("btnTest").addEventListener("click", (e) => {
    e.preventDefault();
    // let file = document.getElementsByTagName("input")[0].files[0];
    const fd = new FormData();

    fd.append("image", fileImage);
    axios({
        url: "/detectTest",
        method: "post",
        headers: {
        },
        data: fd,
    }).then(res => {
        console.log(res.data);
        if(res.data.data.celebrities != null){
            celesDraw(res.data.data.celebrities);
        }
        if (res.data.data.text != null) {
            textDraw(res.data.data.text);
        }
    });
})
function celesDraw(result) {
    var result01 = result.CelebrityFaces;
        var result02 = result.UnrecognizedFaces;
        var data = document.getElementById("data");
        var boudiry = document.getElementById("image-container");
        data.innerHTML = ""
        //CelebrityFaces
        for (let i = 0; i < result01.length; i++) {
            //get color
            var color = {
                red: getRandomInt(255),
                green: getRandomInt(255),
                blue: getRandomInt(255)
            }
            console.log(color);
            var face = result01[i].Face.BoundingBox;
            //print name face
            data.innerHTML += `<span style = "color: rgb(${color.red}, ${color.blue}, ${color.green})"> Name: ${result01[i].Name} </span>`

            //print Bio Link
            data.innerHTML += `<br>`
            var urls = result01[i].Urls
            
            data.innerHTML += `<span style = "color: rgb(${color.red}, ${color.blue}, ${color.green})"> Urls: <br>`
            for (let k = 0; k < urls.length; k++) {
                data.innerHTML += `<span style = "color: rgb(${color.red}, ${color.blue}, ${color.green})">${urls[k]}</span><br>`
            }
            data.innerHTML += `<br>`
            //draw box
            var image = document.getElementById("image")
            boudiry.innerHTML += `<div class="boudiry" style="display: block;
                                                            height:${face.Height * image.height}px; 
                                                            width: ${face.Width * image.width}px;
                                                            top: ${face.Top * image.height}px; 
                                                            left: ${face.Left * image.width}px;
                                                            border: 2px solid rgb(${color.red}, ${color.blue}, ${color.green})"> </div> `
           
        }
        //UnrecognizedFaces
        for (let i = 0; i < result02.length; i++) {
            //get color
            var color = {
                red: getRandomInt(255),
                green: getRandomInt(255),
                blue: getRandomInt(255)
            }
            var box = result02[i].BoundingBox;
            data.innerHTML += `<span style = "color: rgb(${color.red}, ${color.blue}, ${color.green})"> Name:  UnrecognizedFacesCeleb </span>`

            data.innerHTML += `<br>`

            //draw box
            var image = document.getElementById("image")
            boudiry.innerHTML += `<div class="boudiry" style="display: block;
                                                            height:${box.Height * image.height}px; 
                                                            width: ${box.Width * image.width}px;
                                                            top: ${box.Top * image.height}px; 
                                                            left: ${box.Left * image.width}px;
                                                            border: 2px solid rgb(${color.red}, ${color.blue}, ${color.green})"> </div> `
        }
}
function textDraw(kq){
    var result = kq.TextDetections;
    var data = document.getElementById("data");
    var boudiry = document.getElementById("image-container");
    data.innerHTML += `<br><br>Text Detections: <br>`
    for (let i = 0; i < result.length; i++) {
        var geometry = result[i].Geometry.BoundingBox;
        data.innerHTML += `<span> DetectText: ${result[i].DetectedText} </span><br>
                            <span> Type: ${result[i].Type}</span>`
        data.innerHTML += `<br><br>`
        var image = document.getElementById("image")
        boudiry.innerHTML += `<div class="boudiry" style="display: block;
                                                        height:${geometry.Height * image.height}px; 
                                                        width: ${geometry.Width * image.width}px;
                                                        top: ${geometry.Top * image.height}px; 
                                                        left: ${geometry.Left * image.width}px;
                                                        border: 2px solid white"> </div> `
    }
}

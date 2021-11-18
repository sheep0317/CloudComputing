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
        console.log(result);
        var data = document.getElementById("data");
        data.innerHTML = ""
        for(let i =0 ; i< result.length; i++){
            data.innerHTML += `<span> Confidence: ${result[i].Confidence} </span><br>
                                <span> Name: ${result[i].Name}</span>`
            if(result[i].Parents.length != 0){
                data.innerHTML += `<br><span> Parents: </span>`
            }
            for(let j = 0 ; j<result[i].Parents.length; j++){
                data.innerHTML += `<span>${result[i].Parents[j].Name} , </span> `
            }
            data.innerHTML += `<br><br>`
        }
    });
})

document.getElementById("btnDetect").addEventListener("click", (e) => {
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
        console.log(res.data.data.FaceDetails[0].BoundingBox);
        const boudingbox = res.data.data.FaceDetails[0].BoundingBox;
        var image = document.getElementById("image")
        document.getElementById("boudiry").style.display = "block"
        document.getElementById("boudiry").style.width = boudingbox.Width  * image.width + 'px';
        document.getElementById("boudiry").style.height = boudingbox.Height * image.height + 'px';
        document.getElementById("boudiry").style.top = boudingbox.Top * image.height + 'px';
        document.getElementById("boudiry").style.left = boudingbox.Left * image.width + 'px';
    });
})

// var image = document.getElementById("image")

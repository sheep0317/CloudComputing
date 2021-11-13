document.getElementById("imageInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    const src = URL.createObjectURL(file);
    document.getElementById("image").src=src;
})
document.getElementsByTagName("form")[0].addEventListener("submit", (e) => {
    e.preventDefault();
    let file = document.getElementsByTagName("input")[0].files[0];
    const fd = new FormData();

    fd.append("image", file);
    axios({
        url: "/save-image",
        method: "post",
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
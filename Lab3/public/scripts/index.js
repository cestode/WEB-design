let res = document.getElementById('resultLink');
let input = document.getElementById('originalLink');
document.getElementById('shortenButton').addEventListener('click',(ev)=>{
    if(input.value !== "") {
        axios.post('/createShort',{ link: input.value })
        .then((response)=>{
            console.log(response.data);
            res.innerText = window.location.host + '/' + response.data.short_link;
        })
    }
})
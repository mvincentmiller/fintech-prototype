// import JSONFormatter from 'json-formatter-js'
// window.JSONFormatter = JSONFormatter;
// console.log(JSONFormatter);

var socket = io()


socket.on('push', (data) => {
  console.log(data);
  var h = document.createElement("h1");
          h.innerHTML = data;
          document.body.appendChild(h);
});

function reqListener () {
  console.log(this.responseText);
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "/cattleData");
oReq.send();

// import JSONFormatter from 'json-formatter-js'
// window.JSONFormatter = JSONFormatter;
// console.log(JSONFormatter);

var socket = io()


socket.on('push', (data) => {
  console.log(data);
  var p = document.createElement("p");
          p.innerHTML = data;
          document.body.appendChild(p);
});

function reqListener () {
  console.log(this.responseText);
}

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "/cattleData");
oReq.send();

// import JSONFormatter from 'json-formatter-js'
// window.JSONFormatter = JSONFormatter;
// console.log(JSONFormatter);

var socket = io()


socket.on('push', (data) => {
  console.log(data);

  var h = document.getElementById("msg-area");
          $(h).fadeOut(300);
          $(h).fadeIn(600);
          $('.section').fadeOut(600);
          $(h).html('NOTIFICATION<hr><p>' + data.name + '</p><p>' + data.value + '</p>');
          setTimeout(function () {
            $(h).fadeOut(1500), $('.section').fadeIn(1500);
          }, 4000);

});
$('#msg-area').click(function(){
  $(this).fadeOut(1500);
  $('.section').fadeIn(1500);
});

$('#search').click(function (){
  console.log('search');
  var d = {
  name: 'Bob: ',
  value: $('#searchbar').val()
  }
  socket.emit('join', d)
})

//
// function reqListener () {
//   console.log(this.responseText);
// }
//
// var oReq = new XMLHttpRequest();
// oReq.addEventListener("load", reqListener);
// oReq.open("GET", "/cattleData");
// oReq.send();

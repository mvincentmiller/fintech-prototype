var React = require('react');
var ReactDOM = require('react-dom');
 var socket = io()
//var $ = require('jquery');

//import React from 'react';
//var ReactHtmlParser = require('react-html-parser');

// class HtmlComponent extends React.Component {
//   render() {
//     const html = '<div>Example HTML string</div>';
//     return <div>{ ReactHtmlParser(html) }</div>;
//   }
// }

console.log('main2.js');
//
//
//var ReactDOMServer = require('react-dom/server');
// var HtmlToReactParser = require('html-to-react');
//
// var htmlInput = '<div><h1>Title</h1><p>A paragraph</p></div>';
// var htmlToReactParser = new HtmlToReactParser();
// var reactElement = htmlToReactParser.parse(htmlInput);
// var reactHtml = ReactDOMServer.renderToStaticMarkup(reactElement);
//
// assert.equal(reactHtml, htmlInput); // true



function RenderView () {
let element = <div id="reactBox"></div>;
  ReactDOM.render(element,document.getElementById('root'));
}

function RenderButton () {
let element = <button href="#" onClick={handleClick}>Click me</button>;
  ReactDOM.render(element,document.getElementById('reactBox'));
}

function handleClick (e) {
  console.log(e);
   socket.emit('join', '<em>foo</em>');
}

RenderView();
RenderButton();

socket.on('push', (data) => {
  console.log(data);
let reactComponent =  <div dangerouslySetInnerHTML={{__html: data}} />
ReactDOM.render(reactComponent,document.getElementById('reactBox'))
});



// var socket = io()
//
//
// socket.on('push', (data) => {
//   console.log(data);
//
//   var h = document.getElementById("msg-area");
//           $(h).fadeOut(300);
//           $(h).fadeIn(600);
//           $('.section').fadeOut(600);
//           $(h).html('NOTIFICATION<hr><p>' + data.name + '</p><p>' + data.value + '</p>');
//           setTimeout(function () {
//             $(h).fadeOut(1500), $('.section').fadeIn(1500);
//           }, 4000);
//
// });
//
//
//
//
//
//
// $('#msg-area').click(function(){
//   $(this).fadeOut(1500);
//   $('.section').fadeIn(1500);
// });
//
// $('#search').click(function (){
//   console.log('search');
//   var d = {
//   name: 'Bob: ',
//   value: $('#searchbar').val()
//   }
//   socket.emit('join', d)
// })

//
// function reqListener () {
//   console.log(this.responseText);
// }
//
// var oReq = new XMLHttpRequest();
// oReq.addEventListener("load", reqListener);
// oReq.open("GET", "/cattleData");
// oReq.send();

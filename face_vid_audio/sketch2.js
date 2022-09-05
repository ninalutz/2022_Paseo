var vid0;
var vid1;
var vid2;
var videos = [];
var vid;
var playing = false;
var audio;
var max_i =1;

let recording; 

function setup() {
  //set up the worker to listen 
  registerServiceWorker('service-worker.js');
  listenMessage(function(incomingData){
  recording = incomingData.message;
  console.log(recording);
  });

  // vid0 = createVideo('/Downloads/AlexSample.webm');
  audio = loadSound('/Downloads/AlexSample.wav');
  // videos = [vid0]

  createCanvas(windowWidth, windowHeight);
}


function draw(){ 

  // if(recording == 'recording'){
  //   audio.play();
  //   playing = false;
  // }

  // if(playing){
  //   let img = vid.get();
  //   image(img, 0, 0, width, height); // redraws the video frame by frame in   
  //   playNextVideo();
  // }

}

// function keyPressed(){
// 	playing = true;
// }

function playNextVideo() {
  // var randomInt = Math.floor(Math.random() * videos.length);
  // vid =  videos[randomInt];
  
  // vid.play();
  // audio.play();
  // vid.hide();
  
  // vid.onended(function() {
  //     playNextVideo();
  //            });  

}      
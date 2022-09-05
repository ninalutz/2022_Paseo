var videos = [];
var audios = [];
var max_i =1;
var maxIndex = 10;
let recording; 
var playing_video;
var playing_audio;
var currentInt = 0;
var playing = false;

function preload(){
    for(var i = 1; i<maxIndex; i+=2){
    var video = createVideo('/Downloads/video_' + i.toString() + '.webm');
    video.hide();
    videos.push(video);
    var audio = loadSound('/Downloads/audio_'+i.toString() + '.wav') ;
    audios.push(audio)
  }
}

function setup() {
  //set up the worker to listen 
  registerServiceWorker('service-worker.js');
  listenMessage(function(incomingData){
  recording = incomingData.message;
  console.log(recording);
  });

  createCanvas(windowWidth, windowHeight);

}


function draw(){ 

  if(!recording){
    // background(0, 0, 255);
  }
  if(recording == 'recording'){
    // background(255, 0, 0);
    playing = false;
  }
  if(recording == 'not_recording'){
    // background(0, 255, 0);
    playing = true;
    console.log("HELLO")
  }

  if(playing){
  let img = playing_video.get();
  image(img, 0, 0, width, height); // redraws the video frame by frame in   
  }

}

function keyPressed(){
  playing = true;
  playNext();
}



function playNext() {
  if(playing_audio){
    playing_audio.stop();
  }
  // var randomInt = Math.floor(Math.random() * videos.length);
  playing_video =  videos[currentInt];
  playing_audio = audios[currentInt]
  
  playing_video.play();
  playing_audio.play();
  
  playing_video.onended(function() {playNext();});  


  currentInt += 1;
  if(currentInt == maxIndex/2){
    currentInt = 0;
  }

}  
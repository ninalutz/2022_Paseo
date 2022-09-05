var videos = [];
var audios = [];
var max_i =1;
var maxIndex = 10;
let recording; 
var playing_video;
var playing_audio;
var currentInt = 0;
var playing = false;
var not_init = true;

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
    playing = false;
    console.log("Not recording -- should stop")
    playing_audio.stop();
    playing_video.stop();
    fill(0, 0, 0);
    rect(0, 0, width, height);
    fill(255, 0, 0);
    textAlign(CENTER)
    textSize(100);
    text("Recording in progress", width/2, height/2);
  }

  if(recording == 'not_recording'){
    playing = true;
    console.log("Not recording -- should play")
    if(playing_audio && playing_video){
      // playing_audio.play();
      // playing_video.play();
    }
  }

  if(playing && playing_video){
  let img = playing_video.get();
  image(img, 0, 0, width, height); // redraws the video frame by frame in   
  }

}

function keyPressed(){
  if(not_init){
    playing = true;
    playNext();
    not_init = false;
  }
}


function playNext() {
  console.log("Playing next!")
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
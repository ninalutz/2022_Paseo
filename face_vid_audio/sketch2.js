var videos = [];
var audios = [];
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


function addVideo(index){
  return new Promise((resolve, reject)=>{
    try{
      //we want to wait for these to be loaded
      var video = createVideo('/Downloads/video_' + index.toString() + '.webm');
      video.hide();
      videos.push(video);
      var audio = loadSound('/Downloads/audio_'+index.toString() + '.wav') ;
      audios.push(audio);
      //we want to wait for these to be loaded
      if(video.elt.readyState == 4 && audio.isLoaded()){
        console.log("READY LOADED");
      }
    }
    catch(error){
      console.log(error);
      console.log("Not Added Correctly");
      //load in audio again 
    }
    //no matter what -- trigger play next and increment max index
    //TODO -- make index diff if totally fails? 
    maxIndex +=2;
    currentInt = videos.length-1;
    resolve('resolved')
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


async function draw(){ 

  if(recording == 'recording'){
    playing = false;
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
    console.log("HELLO")
    playing = true;
    //check if actually playing 
    if(playing_video.elt.paused == true && playing_audio.isPlaying() == false){
      playing_video.play();
      playing_audio.play();
    }
  }

  if(playing && playing_video){
  let img = playing_video.get();
  image(img, 0, 0, width, height); // redraws the video frame by frame in   
  }

  if(recording){
    if(recording[0] == 'a'){
      console.log("a detected");
      //was already defined, so add new video
      if(playing_audio && playing_video){
        //prevent multiple adds
        if(parseInt(recording.split('_')[1]) > maxIndex){
          console.log("adding");
          var result = await addVideo(maxIndex+1);
          playNext();
          playing = true;
        }
      }
    }
  }

}

function keyPressed(){
  if(not_init){
    playing = true;
    playNext();
    not_init = false;
  }
}

//playing_video.elt.readyState
function playNext() {
  console.log("Playing next!")

  //if it is defined and still playing -- needs to stop
  if(playing_audio){
    playing_audio.stop();
  }
  if(playing_video){
    playing_video.stop();
  }

  playing_video =  videos[currentInt];
  playing_audio = audios[currentInt];

  //make sure that the files both exist/are buffered before they are played
  if(playing_video.elt.readyState == 4 && playing_audio.isLoaded() == true){
    playing_video.play();
    playing_audio.play();
  }
  
  else{
    //call function again at next index until it works out
    currentInt += 1;
    if(currentInt == maxIndex/2){
     currentInt = 0;
    }
    playNext();
  }
  
  playing_video.onended(function() {playNext();});  

  //loop to start at end of array
  currentInt += 1;
  if(currentInt == maxIndex/2){
    currentInt = 0;
  }

}  
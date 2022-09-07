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
    try{
      var video = createVideo('/Downloads/video_' + index.toString() + '.webm');
      video.hide();
      videos.push(video);
      var audio = loadSound('/Downloads/audio_'+index.toString() + '.wav') ;
      audios.push(audio);
      if(video.elt.readyState == 4){
        // currentInt = videos.length-1;
        console.log("ready");
      }
      else{
        console.log("Not ready");
        // currentInt = videos.length-2;
      }
    }
    catch(error){
      console.log(error);
      console.log("Not Added Correctly");
      //load in audio again 
    }
    //no matter what -- trigger play next and increment max index
    maxIndex +=2;
    //testing
    currentInt = videos.length-2;
    playNext();
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
    playing = true;
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
          addVideo(maxIndex+1);
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
  playing_audio = audios[currentInt]
  
  playing_video.play();
  playing_audio.play();
  
  playing_video.onended(function() {playNext();});  

  //loop to start at end of array
  currentInt += 1;
  if(currentInt == maxIndex/2){
    currentInt = 0;
  }

}  
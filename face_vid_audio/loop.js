var videos = [];
var audios = [];
var maxIndex = 10;
let recording; 
var playing_video;
var playing_audio;
var currentInt = 0;
var playing = false;
var not_init = true;
let video_being_loaded;
let audio_being_loaded;
var not_adding = true;

function preload(){
    for(var i = 1; i<maxIndex; i+=2){
    var video = createVideo('/Downloads/video_' + i.toString() + '.webm');
    video.hide();
    videos.push(video);
    var audio = loadSound('/Downloads/audio_'+i.toString() + '.wav') ;
    audios.push(audio)
  }
}


function addAudio(index){
    return new Promise(async (resolve, reject)=>{
      console.log('creating audio');
      let audio_path = '/Downloads/audio_'+index.toString() + '.wav'

      const audio_successfully_loaded = (audio_file) => {
        audios.push(audio_file);
        resolve("audio loaded");
      }

      loadSound(audio_path, audio_successfully_loaded, () => reject("failed to load audio"));

    })
}

function addVideo(index){
    console.log('creating video');
    return new Promise(async (resolve, reject)=>{
 
      let video_path = `/Downloads/video_${index}.webm`
      let video_being_created;

      const audio_successfully_loaded = () => {
        console.log({video_being_created})
        videos.push(video_being_created);
        resolve("video loaded");

      }
      video_being_created = createVideo(video_path, audio_successfully_loaded);

    })
}

function addMedia(index){
  // return new Promise(async (resolve, reject)=>{
  return Promise.all([addVideo(index), addAudio(index)]).then((values) => {
    console.log({values});
    console.log("Add media completed promises things")
    maxIndex += 2;
    currentInt = videos.length-1;
    console.log("Add media assigned things")  
    sendMessage('all_good');
    not_adding = true;
  });  
}

function setup() {
  //set up the worker to listen 
  registerServiceWorker('service-worker.js');

  listenMessage(function(incomingData){
  recording = incomingData.message;
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
    playing = true;
    //check if actually playing 
    if(playing_video.elt.paused == true && playing_audio.isPlaying() == false){
      playing_video.play();
    }
  }

  if(playing && playing_video){
  let img = playing_video.get();
  image(img, 0, 0, width, height); // redraws the video frame by frame in   
  }

if (recording) {
    if (recording.startsWith("a")){
      //test sending a message the other way 
      sendMessage('a detected');

      //was already defined, so add new video
      if (playing_audio && playing_video) {
        //prevent multiple adds
        if (parseInt(recording.split('_')[1]) > maxIndex && not_adding) {
          not_adding = false;
          console.log("queueing add media: " + recording.split('_')[1]);
          await addMedia(maxIndex + 1)
          console.log("Add media has completed execution and trigger play next");
          playNext();
          playing = true;
        }
      }
    }
  }

//add prompt to top of playback recordings 
if(recording != 'recording'){
  fill(0, 0, 0)
  rect(0, 0, width, 200);
  fill(0, 255, 255);
  textAlign(CENTER)
  textSize(90);
  text("How have you transformed since 2020?", width/2, 150);
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
  console.log("Playing next: " + currentInt.toString())

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
    // console.log("PLAYING")
  }
  
  else{
    console.log("Wasn't ready")
    console.log({currentInt});
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
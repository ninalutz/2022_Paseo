var videos = [];
var audios = [];
var maxIndex = 38;
let recording; 
var playing_video;
var playing_audio;
var currentInt = 0;
var playing = false;
var not_init = true;
let video_being_loaded;
let audio_being_loaded;
let index_to_be_added = 0;
let adding_file = false;


function preload(){
  for(var i = 1; i<maxIndex; i+=2){
    var video = createVideo('/Downloads/video_' + i.toString() + '.webm');
    video.hide();
    videos.push(video);
    var audio = loadSound('/Downloads/audio_'+i.toString() + '.wav') ;
    audios.push(audio)
  }
  console.log("Loaded")
}

function checkLoad(audio_file){
  console.log(audio_file.isLoaded())
  return audio_file.isLoaded();
}

function addAudio(index){
    return new Promise(async (resolve, reject)=>{

      console.log('creating audio');
      let audio_path = '/Downloads/audio_'+index.toString() + '.wav'

      const audio_successfully_loaded = (audio_file) => {
        if(audios.length <= (index_to_be_added-1)/2){
          audios.push(audio_file);
        }
        resolve("audio loaded");
      }

      if(audios.length <= (index_to_be_added-1)/2){
         loadSound(audio_path, audio_successfully_loaded, () => reject(defunc()), track());
      }

     // if(audios.length <= (index_to_be_added-1)/2){
     //    try{ 
     //       audio_being_loaded = loadSound(audio_path, checkLoad, () => reject(defunc()), track());
     //     }
     //     catch(error){
     //      console.log(error);
     //     }
     // }
     //  else{
     //    resolve("audio loaded"); //don't want to add too many 
     //  }

    })
}

function track(){
  console.log("LOADING")
}

function defunc(){
  console.log("Didn't add files!")
}

function addVideo(index){
    console.log('creating video');
    return new Promise(async (resolve, reject)=>{
 
      let video_path = `/Downloads/video_${index}.webm`
      let video_being_created;

      const audio_successfully_loaded = () => {
        // console.log({video_being_created})
        if(videos.length <= (index_to_be_added-1)/2){
          videos.push(video_being_created);
        }
        video_being_created.hide();
        resolve("video loaded");
      }

      if(videos.length <= (index_to_be_added-1)/2){
        video_being_created = createVideo(video_path, audio_successfully_loaded);
      }
      else{
        resolve("video loaded"); //don't want to add too many 
      }
    })
  }


function cleanArrays(){
  // console.log("Cleaning arrays")
  // if(audios.length > 10){
  //   audios = [];
  // }
  // if(videos.length > 10){
  //   for (var i = 0; i<videos.length; i++){
  //     videos[i].remove();
  //   }
  //   videos = []
  // }
  //make new arrays
}

function addMedia(index){
  // return new Promise(async (resolve, reject)=>{
  return Promise.all([cleanArrays(), addAudio(index), addVideo(index)]).then((values) => {
    console.log({values});
    console.log("Add media completed promises things")
    maxIndex = index_to_be_added + 1;
    currentInt = videos.length-1;
    console.log("Add media assigned things") 
    adding_file = false;
    playing = true;
  });  
}

function setup() {
  //set up the worker to listen 
  registerServiceWorker('service-worker.js');

  listenMessage(function(incomingData){
  recording = incomingData.message;
  });

  createCanvas(windowWidth, windowHeight);

  sendMessage("1");
}


async function draw(){ 

  if(recording == 'recording'){
    playing = false;
    adding_file = false;
    if(playing_audio && playing_video){
      playing_audio.stop();
      playing_video.stop();
    }
    fill(0, 0, 0);
    rect(0, 0, width, height);
    fill(255, 0, 0);
    textAlign(CENTER)
    textSize(100);
    text("Recording in progress", width/2, height/2);
  }


  if(recording == 'not_recording'){
    playing = true;
    //check if actually playing and might have to queue up 
    if(playing_video.elt.paused == true && playing_audio.isPlaying() == false){
      console.log("Had to manually play up videos");
      console.log({adding_file})
      playing_video.play();
      playing_audio.play();
    }

  }

  if(playing && playing_video){
    let img = playing_video.get();
    image(img, 0, 0, width, height); // redraws the video frame by frame in   
  }


if (recording) {
    if (recording.startsWith("a")){
      index_to_be_added = parseInt(recording.split('_')[1]);
      //test sending a message the other way 
      sendMessage(recording);
      console.log("detected a: " + recording.split('_')[1]);
      //only call this once
      if (index_to_be_added > maxIndex && !adding_file) {
        adding_file = true;  
        console.log("queueing add media: " + index_to_be_added.toString());
        await addMedia(maxIndex + 1);
        console.log("Add media has completed execution and trigger play next");
        playNext();
        playing = true;
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
  console.log("Playing: " + currentInt.toString() +  " out of " + videos.length.toString())

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
  try{
    if(playing_video.elt.readyState == 4 && playing_audio.isLoaded() == true){
      playing_video.play();
      playing_audio.play();
    }
  
    else{
      console.log("Wasn't ready: " + currentInt.toString() + playing_audio.isLoaded() + playing_video.elt.readyState)
      //grab another random and call the function again
      currentInt = parseInt(random(0, videos.length));
      playNext();
    }
    
    //make sure playing video always gets the playNext
    playing_video.onended(function() {playNext();});  

    //select random for next integer 
    currentInt = parseInt(random(0, videos.length));

    // if(currentInt == maxIndex/2){
    //   currentInt = 0;
    // }
  }

  catch(error){
    console.log(error);
    currentInt = parseInt(random(0, videos.length));
    playNext();
  }

}  
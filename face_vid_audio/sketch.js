//Config for video
var VTX = outer_mouth_landmarks;

var facemeshModel = null; // this will be loaded with the facemesh model
                          // WARNING: do NOT call it 'model', because p5 already has something called 'model'

var videoDataLoaded = false; // is webcam capture ready?

var statusText = "Loading facemesh model...";

var myFaces = []; // faces detected in this browser
                  // currently facemesh only supports single face, so this will be either empty or singleton
var capture; // webcam capture, managed by p5.js

//scale fro drawing the dots in the bounds
var scale_factor = 3;
var margin_factor = 8;

var min_x, max_x, min_y, max_y; 

// Load the MediaPipe facemesh model assets.
facemesh.load().then(function(_model){
  statusText = "Model loaded."
  facemeshModel = _model;
})

//Config for recording
var btn = document.querySelector('button');
var  chunks = [];
let mic, soundRecorder, soundFile;
var videoRecordIndex = 0;
var recording = false;

function setup() {
  configSound();
  btn = document.querySelector('button');
  btn.onclick = recordVideo;

  createCanvas(960, 800);

  min_x = width/margin_factor;
  max_x = (margin_factor-1)*width/margin_factor;
  min_y = height/margin_factor;
  max_y = ((margin_factor-1)*height)/margin_factor;

  capture = createCapture(VIDEO);
  
  // capture = createVideo("test.mov");

  // this is to make sure the capture is loaded before asking facemesh to take a look
  // otherwise facemesh will be very unhappy
  capture.elt.onloadeddata = function(){
    // console.log("video initialized");
    videoDataLoaded = true;
  }
  
  capture.hide();
  background(0);
}


function draw() {
  strokeJoin(ROUND); //otherwise super gnarly
  
  if (facemeshModel && videoDataLoaded){ // model and video both loaded, 
    
    facemeshModel.estimateFaces(capture.elt).then(function(_faces){
      // we're faceling an async promise
      // best to avoid drawing something here! it might produce weird results due to racing
      
      myFaces = _faces.map(x=>packFace(x,VTX)); // update the global myFaces object with the detected faces

      // console.log(myFaces);
      if (!myFaces.length){
        // haven't found any faces
        statusText = "Show some faces!"
      }else{
        // display the confidence, to 3 decimal places
        statusText = "Confidence: "+ (Math.round(_faces[0].faceInViewConfidence*1000)/1000) + "   Frame Rate: " + int(frameRate());
      }
      
    })
  }
  
  background(0);
  


  noFill();
  stroke(255, 0, 0);
  strokeWeight(10);
  rect(min_x, min_y, max_x - min_x, max_y-min_y);
  
  push();
  // scale(scale_factor);
  // translate(-width/(2*scale_factor), -height/(2*scale_factor));
  stroke(255, 0, 255);
  rect(min_x, min_y, max_x - min_x, max_y-min_y);
  drawFaces(myFaces);
  pop();

  strokeWeight(1);
  fill(0, 255, 0);
  textSize(20);
  text(statusText,20,30);
  text('Video/audio clip: ' + videoRecordIndex.toString() + '    Recording: ' + recording,20, 60);

}


// draw a face object returned by facemesh
function drawFaces(faces,filled){

  for (var i = 0; i < faces.length; i++){
    const keypoints = faces[i].scaledMesh;

    for (var j = 0; j < keypoints.length; j++) {
      const [x, y, z] = keypoints[j];
      // fill(255);
      noStroke();
      var mapped_x = map(x, 0, 640, min_x, max_x, true);
      var mapped_y = map(y, 0, 320, min_y, max_y, true);
      fill(0, 255, 255);
      circle(mapped_x, mapped_y, 5);

    }
  }
}

// reduces the number of keypoints to the desired set 
function packFace(face,set){
  var ret = {
    scaledMesh:[],
  }
  for (var i = 0; i < set.length; i++){
    var j = set[i];
    ret.scaledMesh[i] = [
      face.scaledMesh[j][0],
      face.scaledMesh[j][1],
      face.scaledMesh[j][2],
    ]
  }
  return ret;
}




function recordVideo() {
  // console.log("RECORDING")
  chunks.length = 0;
  chunks = []
  let stream = document.querySelector('canvas').captureStream(30),
  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = e => {
    if (e.data.size) {
      chunks.push(e.data);
    }
  };
  recorder.onstop = exportVideo;
  btn.onclick = e => {
    recorder.stop();
    soundRecorder.stop();
    btn.textContent = 'start recording';
    recording = false;
    btn.onclick = recordVideo;
    videoRecordIndex += 1;
  };
  recorder.start();
  soundRecorder.record(soundFile);
  btn.textContent = 'stop recording';
  recording = true;
}


function downloadVideo() {
  save(soundFile, 'audio_' + (videoRecordIndex-1).toString() +'.wav');

  var xhr = new XMLHttpRequest();
  var vid_link =  document.querySelector('myvideo' + videoRecordIndex.toString()).src;
  xhr.open('GET', vid_link, true);
  xhr.responseType = 'blob';
  xhr.onload = function() {
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(this.response);
    var tag = document.createElement('a');
    tag.href = imageUrl;
    tag.target = '_blank';
    tag.download = 'video_' + videoRecordIndex.toString() + '.webm';
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
  };
  xhr.onerror = err => {
    alert('Failed to download picture');
  };
  xhr.send();
}

function exportVideo(e) {
  var blob = new Blob(chunks);
  var vid = document.createElement('myvideo' + videoRecordIndex.toString());
  vid.id = 'recorded'
  vid.controls = true;
  vid.src = URL.createObjectURL(blob);
  document.body.appendChild(vid);
  // vid.play();
  downloadVideo();
}


function configSound(){

  userStartAudio();

  // create an audio in
  mic = new p5.AudioIn();

  // prompts user to enable their browser mic
  mic.start();

  // create a sound recorder
  soundRecorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  soundRecorder.setInput(mic);

  // this sound file will be used to
  // playback & save the recording
  soundFile = new p5.SoundFile();

  userStartAudio();
}


function keyPressed(){
  if(keyCode == 50){
      btn.click();
  }
}
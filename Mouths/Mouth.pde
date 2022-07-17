class Mouth{
  ArrayList<PVector> points = new ArrayList<PVector>();
  
   Mouth (ArrayList<PVector> _points) {  
     points = _points;
   } 
  
  void drawMouth(color c){
    //for(int i =0; i<points.size(); i++){
    //  fill(((i+1)*10), 0, 255);
    //  noStroke();
    noFill();
    stroke(0);
      //ellipse(points.get(0).x,points.get(0).y, 10, 10);
    //}

    for(int i =0; i<points.size()-1; i++){
       stroke(c);
      //line(points.get(i).x, points.get(i).y, points.get(i+1).x, points.get(i+1).y);
    }
  }
}


class Mover{
  ArrayList<Mouth> mouths = new ArrayList<Mouth>();
   PVector v;
  
  // defines the speed of the circle
   float speed = 0.25;
   int nextTarget = 1;


  Mover(ArrayList<Mouth> _mouths){
    mouths = _mouths;
    v = new PVector(mouths.get(0).points.get(0).x, mouths.get(0).points.get(0).y);
  }
  
  
  
  void move(){

    int i = 0;
    
    float cur_mouth_x =  mouths.get(nextTarget -1).points.get(i).x;
    float cur_mouth_y =  mouths.get(nextTarget -1).points.get(i).y;

    float next_mouth_x = mouths.get(nextTarget).points.get(i).x;
    float next_mouth_y =  mouths.get(nextTarget).points.get(i).y;
    
    //test targets
    fill(0, 255, 0);
    ellipse(cur_mouth_x, cur_mouth_y, 10, 10);
    ellipse(next_mouth_x, next_mouth_y, 10, 10);


    //compute moving angle for each point between two mouths
    float diffX = next_mouth_x - cur_mouth_x;
    float diffY = next_mouth_y - cur_mouth_y;
    float angle = atan2(diffX, diffY);

    // compute new position of v
    v = new PVector(v.x + sin(angle)*speed, v.y + cos(angle)*speed);
    fill(0);
    stroke(0);
    //println(v);
    ellipse(v.x, v.y, 5, 5);
    
    if(v.x == next_mouth_x){
        println("HELLO");
    }
    
    if (dist(v.x, v.y, next_mouth_x, next_mouth_y)< 1 && nextTarget < mouths.size() - 1) {
        nextTarget++;
        println(nextTarget);
    }
  }
}


void keyReleased() {
  if (key == ENTER) {
    animate = !animate;
    //println("animation: "+ animate);
  }
}

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
    strokeWeight(0.5);
      //ellipse(points.get(0).x,points.get(0).y, 10, 10);
    //}

    for(int i =0; i<points.size()-1; i++){
       stroke(c);
       strokeWeight(2);
      line(points.get(i).x, points.get(i).y, points.get(i+1).x, points.get(i+1).y);
    }
          line(points.get(0).x, points.get(0).y, points.get(points.size()-1).x, points.get(points.size()-1).y);

  }
}


class Mover{
  ArrayList<Mouth> mouths = new ArrayList<Mouth>();
   PVector v;
  
  // defines the speed of the circle
  float speed = 0.25;
  int index;
  
  int nextTarget = 1;
  
  Mover(ArrayList<Mouth> _mouths, int _index){
    mouths = _mouths;
    index = _index;
    v = new PVector(mouths.get(0).points.get(index).x, mouths.get(0).points.get(index).y);
  }
  
  
  
  void move(color c){
    //println("Mouth: " + str(nextTarget) + " " + "Index: " + str(index));
    
    float cur_mouth_x =  mouths.get(nextTarget -1).points.get(index).x;
    float cur_mouth_y =  mouths.get(nextTarget -1).points.get(index).y;

    float next_mouth_x = mouths.get(nextTarget).points.get(index).x;
    float next_mouth_y =  mouths.get(nextTarget).points.get(index).y;
    
    //test targets
    //fill(0, 0, 255);
    //noStroke();
    //ellipse(cur_mouth_x, cur_mouth_y, 10, 10);
    //ellipse(next_mouth_x, next_mouth_y, 10, 10);


    //compute moving angle for each point between two mouths
    float diffX = next_mouth_x - cur_mouth_x;
    float diffY = next_mouth_y - cur_mouth_y;
    float angle = atan2(diffX, diffY);

    // compute new position of v
    v = new PVector(v.x + sin(angle)*speed, v.y + cos(angle)*speed);
    fill(0, 0, 255);
    //ellipse(v.x, v.y, 10, 10);
    
    if (dist(v.x, v.y, next_mouth_x, next_mouth_y)< 1 && nextTarget < mouths.size() - 1) {
        nextTarget++;
        strokeWeight(20);
        mouths.get(nextTarget).drawMouth(color(0, 0, 255));
        println(nextTarget);
    }

  }
}

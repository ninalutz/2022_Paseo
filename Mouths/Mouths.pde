Table outer_table;
int out_number = 20;
int whole_number = 78;
int num_mouths = 0;
boolean animate = false; // true means, the circles moves

ArrayList<Mouth> mouths = new ArrayList<Mouth>();
  ArrayList<PVector> pts = new ArrayList<PVector>();
Mover mover;

void setup() {
  size(1280, 720);
  background(255);

  int j = 0;
  outer_table = loadTable("outer.csv", "header");
  println(outer_table.getRowCount() + " total rows in table");
  num_mouths = outer_table.getRowCount()/out_number;

  for(int i = 0; i<outer_table.getRowCount(); i++){
    Float x = outer_table.getRow(i).getFloat("x");
    Float y = outer_table.getRow(i).getFloat("y");
    
    j+=1;
    PVector v = new PVector(x, y);
    pts.add(v);
    
    if(j >= 20){
      //create a new mouth with the points just collected
      Mouth m = new Mouth(pts);
      mouths.add(m);
      pts = new ArrayList<PVector>();
      j = 0;
    }
  }
  
    //construct movers
    mover = new Mover(mouths);

    
}

void draw(){
  
    background(255);

  for(int i = 0; i<mouths.size(); i++){
    mouths.get(i).drawMouth(color(i*2, 0, 0));
  }
  
  
    if (animate) {
      mover.move();
    }

}

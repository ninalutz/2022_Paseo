Table outer_table, whole_table;
int out_number = 52;
int whole_number = 78;
int num_mouths = 0;
boolean animate = false; // true means, the circles moves

ArrayList<Mouth> outer_mouths = new ArrayList<Mouth>();
ArrayList<PVector> outer_pts = new ArrayList<PVector>();
ArrayList<Mover> outer_movers = new ArrayList<Mover>();

ArrayList<Mouth> whole_mouths = new ArrayList<Mouth>();
ArrayList<PVector> whole_pts = new ArrayList<PVector>();
ArrayList<Mover> whole_movers = new ArrayList<Mover>();

void setup() {
  size(1280, 720);
  background(0);
  
  initOuter();
  
  colorMode(HSB);
  
  background(0);

}

void draw(){
  //fill(0, 1);
  //rect(0, 0, width, height);
  
    background(0);

  scale(2.5);
  translate(-350, -210);


  for(int i =0; i<outer_mouths.size(); i++){
    outer_mouths.get(i).drawMouth(color(2*i, 360, 360));
    //fill(0, 1);
    //rect(0, 0, width, height);
  }
  
  for(int i = 0; i<outer_mouths.get(0).points.size(); i++){
    outer_movers.get(i).move(255);
  }  
}

void initOuter(){
  int j = 0;
  outer_table = loadTable("outer.csv", "header");
  println(outer_table.getRowCount() + " total rows in table");
  num_mouths = outer_table.getRowCount()/out_number;

  for(int i = 0; i<outer_table.getRowCount(); i++){
    Float x = outer_table.getRow(i).getFloat("x");
    Float y = outer_table.getRow(i).getFloat("y");
    
    j+=1;
    PVector v = new PVector(x, y);
    outer_pts.add(v);
    
    if(j >= out_number){
      //create a new mouth with the points just collected
      Mouth m = new Mouth(outer_pts);
      outer_mouths.add(m);
      outer_pts = new ArrayList<PVector>();
      j = 0;
    }
  }
  
  //construct movers
  for(int i = 0; i<outer_mouths.get(0).points.size(); i++){
    Mover mover = new Mover(outer_mouths, i);
    outer_movers.add(mover);
  }
}

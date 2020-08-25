   /* Initialization */

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var log = "";

//import:
//const fs = require('fs');   // <- save to file / load from file   
//const fs = require(‘fs’);

// Shift of Canvas from left top point.
var decX = 00;
var decY = 00;


//global variables;
var clickPosX;
var clickPosY;
var curPosX;
var curPosY;
var movement = false;

	/* CLASS PersonManager */

class PersonTree {

  //Lists:
  persons;
  weddings;

  //ScreenPosition:
  x = 0;
  y = -50;

  //Global Params:
  static distW = 100; 	// X axis distance between frames
  static distH = 80; 	// Y axis distance between frames (generations)
  
  //for backgrounds:
  static bgclr1 = "#EEEEFF";
  
  //States:: Bool
  stAddPers;	       // Add new Person in visual mode;
  stMoveBoard;	
  stAutoCorrection;    // use `div` to set Frames.
  stBackground;
  stMoveFrames;

  /*Methods*/

  constructor(persons,weddings) {
    this.persons  = persons;
    this.weddings = weddings;

    this.stAddPers          = false;
    //this.stKillPers       = false;	      
    this.stMoveBoard        = false;
    this.stAutoCorrection   = false; 
    this.stBackground       = true;
    this.stSetWedding       = false;
    this.stSetFamily        = false;
    this.stMoveFrames       = false;
  }
  
/*
  from(json_persons, json_weddings) {
    //load lists from jsons.
  }
*/

  from(jsonTree) {
   var prototype = JSON.parse(jsonTree);

    this.persons  = prototype.persons;
    this.weddings = prototype.weddings;

    //technical parameters...
    
  }




  //Move Every Active Frame;
  moveFrames(event) {
    if (this.stMoveFrames) {
       for (var i=0; i<this.persons.length; i++) {
           this.persons[i].onMove(event); 
       }
    }
  };

  //When click deactivates all Frames and stMoveFrames = false;
  stopMoveFrames(event) {
    this.deactivateAllFrames();
    this.stMoveFrames = false;
    //erase shift-vector;
     curPosX = 0;
     curPosY = 0;
  }

  deactivateAllFrames() {
    for (var i=0; i<this.persons.length; i++) {
         if (this.persons[i].active) { 
            this.persons[i].active = false; 
            this.persons[i].setNewCoord()
         }
    }
  }



  drawBackGround() {
    if (this.stBackground) {
      ctx.beginPath();       
      var h = PersonFrame.h;
      var hh = PersonTree.distH;
      var color1 = PersonTree.bgclr1;
      
      for ( var i = 0; i<=3; i++) {
          ctx.fillStyle = color1;
          ctx.fillRect(0,this.y+hh+i*(h+hh),1000,h,PersonTree.bgclr1);
      }
     ctx.stroke()
    }      
  }

  //Draw Every Person;
  drawPersons() {
        for (var i=0; i<this.persons.length; i++) {
             this.persons[i].draw();    
        }
  }

  //Draw Every Wedding;
  drawWeddings() {
        for (var i=0; i<this.weddings.length; i++) {
             this.weddings[i].draw();    
        }  
  }

  //Draw Everything;
  draw() { //Perhaps, a lot of time for assigment.
    this.drawPersons();
    this.drawWeddings();
  };


  //choose multiple Forms with Boxing:
  multiBox(event) {
    //
  }

  //Private :: i-person emerges.
  onTop(i) {
    var x = this.persons[i];
    this.persons.splice(i,1);
    this.persons.push(x);
  }


  //On Click - Add Unknown person.
  addPers(e,p) {
    log+= " addPers: "+p.toString();
    this.stAddPers = !this.stAddPers;
    p.setFrame(e.clientX-PersonFrame.w/2,e.clientY-PersonFrame.h/2,
               false,false,false);

    this.persons.push(p);
  }

  //On "delete" remove ALL activated persons.
  killPersons() {
    for (var i=0; i<this.persons.length; i++) {
         if (this.persons[i].active) {
             this.persons.splice(i,1);
         }
    }     
  }

  //Private clickPersons
  clickPersons(event) {
    var l = this.persons.length;
    for (var i=l-1; i>=0; i--) {
        if (this.persons[i].isInside(event.clientX,event.clientY)) {
            this.onTop(i);
            this.persons[l-1].onClick(event);
        break;
        }
    }
  };

  //Private clickWeddings;
  clickWeddings(event) {
    var l = this.weddings.length;
    for (var i=l-1; i>=0; i--) {
        if (this.weddings[i].isInside(event.clientX,event.clientY)) {
           this.weddings[i].onClick(event);            
        break;
        }
    }
  };

  //the top-Person is clicked.
  /*static*/ click(event) {
    this.clickPersons(event);
    this.clickWeddings(event);
    reDraw();
  };

  //every movable Person moves.
  /*static*/ move(event) {
    var l = this.persons.length;
    for (var i=l-1; i>=0; i--) {
        this.persons[i].onMove(event);
    }
  }; 

} // END OF CLASS;



	/* CLASS WEDDING */



class Wedding {

 /* List of Chidren
  * methods:
  * Draw: "==" and all children.
  *
  */

  constructor(husband,wife) {
     this.husband = husband;
     this.wife    = wife;
     this.active  = false;
   }

 from(json) {
   var prototype = JSON.parse(json);

   this.name = prototype.name;
   this.surname = prototype.surname;
   this.gender = prototype.gender;
   this.birth = prototype.birth;
   this.death = prototype.death;
 
   this.x = prototype.x;
   this.y = prototype.y;
   this.active = prototype.active;
   this.hiden = prototype.hiden;
   this.move = prototype.move;
   this.family = prototype.family;          // <- need check.
  }

  //getter of length between spouses.
  getL() {
     return (this.wife.getX() - this.husband.getX() - PersonFrame.w); 
  } 

  //getters of MiddlePoint and Edges;
  getMiddleX() {
     return (this.wife.getX() - this.getL()/2);
  }
  getMiddleY() {
     return (this.wife.getY() + this.husband.getY() + PersonFrame.h)/2;
  }
  getLeft() {
     return (this.husband.getX() + PersonFrame.w);
  }
  getRight() {
     return this.wife.getX();
  }


 // Draw Marriage.
 draw() {
   var y  = this.getMiddleY();
   var xL = this.getLeft();
   var xR = this.getRight();
   var d = 2;

  ctx.beginPath();
  
  if (this.active) {
    ctx.lineWidth = "8";
    d = 5;
  } else { 
    ctx.lineWidth = "1";
    d = 2;
  }

  ctx.moveTo( xL , y - d);
  ctx.lineTo( xR , y - d);

  ctx.moveTo( xL , y + d);
  ctx.lineTo( xR , y + d);


  //WriteLength;
    ctx.fillStyle = "#000000";
    ctx.font = "normal " +12 + "px Verdana";
    ctx.fillText(this.getL(),this.getMiddleX()-10,y-2*d);

  ctx.stroke();
 }


  //Check if our coursor is close to WedLock.
  isInside(i,j) {
    var res = false;
    if ( this.getLeft() < i && i < this.getRight()) 
       if ( this.getMiddleY() - 15 < j && j < this.getMiddleY() + 15)
          res = true; 
    return res;
  }
  

  //OnClick Event:
  onClick(event) {
    if (this.isInside(event.clientX,event.clientY)) {
	   log+= "Wedding is Clicked.";
       this.active = !this.active;
    }
  }    


} //END OF CLASS;


	/* CLASS PersonFrame */

class PersonFrame {

  //FrameSize:
  static w = 128+32;
  static h = 64;

  //Indents:
  static indL = 4;  		// indent from Left
  static indT = 4;  		// indent from Top
  static font = 16;  		// standart font Size;
  static thrS = 18;		// threshold between Strings;

  //Colours:
  static femclr = "#FF8888";	//  female colour
  static manclr = "#8888FF";	//    male colour
  static uknclr = "#BBBBCC";	// unknown colour

  //Constructor
  constructor() {
    //Unknown-Person Constructor:
    this.setPerson("","",'U',"","");
    this.family = null;
    this.gender  = 'U';
  }

  //Constructor from json
  from(json) {
   var prototype = JSON.parse(json);

   this.name = prototype.name;
   this.surname = prototype.surname;
   this.gender = prototype.gender;
   this.birth = prototype.birth;
   this.death = prototype.death;
 
   this.x = prototype.x;
   this.y = prototype.y;
   this.active = prototype.active;
   this.hiden = prototype.hiden;
   this.move = prototype.move;
   this.family = prototype.family;          // <- need check.
  }

  //[+]Set Technical parameters for Frame
  setFrame(x,y,active,hiden,move) {
    this.x = x;
    this.y = y;
    this.active = active;
    this.hiden = hiden;
    this.move  = move;
  }

  //[+]Set Person's data
  setPerson(name,surname,gender,birth,death) {
    this.name 	 = name;
    this.surname = surname;
    this.gender  = gender;
    this.birth   = birth;
    this.death   = death;
  }


  //Load PersonFrame from file:
  load(adress) {
 
    //fs.readFile(adress, 'utf8', (err, jsonString) => {} )
  }


//var person3 = new PersonFrame();
//person3.load('/newton.json')










  //[-] <- there is a threshold between Canvas and Page that is not admited.
  isInside(i,j) {
    var result = false;
    if (this.getX() < i && i < this.getX() + PersonFrame.w)
       if (this.getY() < j && j < this.getY() + PersonFrame.h)
          result = true;
    return result;
  }

  //getters
  getX() {
    var result;
  //  if (this.move) {result = this.x + curPosX;}
    if (this.active && tree.stMoveFrames) {result = this.x + curPosX;}
    else {result = this.x;}
  return result;
  }

  getY() {
    var result;
    if (this.active && tree.stMoveFrames) {result = this.y + curPosY;}
    else {result = this.y;}
  return result;
  }

  setNewCoord() {
     this.x = this.x + curPosX;
     this.y = this.y + curPosY;
     //curPosX = 0;
     //curPosY = 0;
  }


  //Main OnClick-Function;
  onClick(event) {

    // <$>

     if (!tree.stMoveFrames) {

        if (this.isInside(event.clientX,event.clientY)) {
	       log = log + this.name + " is Clicked.";
           this.active = !(this.active);
     } else {
         
     }

        // When Move Frame:
        if (this.active && tree.stMoveFrames) {	// <!>
         this.x = this.x + curPosX;
         this.y = this.y + curPosY;
         curPosX = 0;
         curPosY = 0;
        }

        this.move = !(this.move);

//        this.x = this.x + 50;
//	if (this.gender == 'M') {this.gender = 'F'}
//           else {this.gender = 'M'}

        reDraw();	// <- canvas-invalidation;
     }
  }

  //Move event for this PersonFrame:
  onMove(event) {
     if (this.active) { //<!>
         curPosX = (event.clientX - clickPosX);
         curPosY = (event.clientY - clickPosY);
         reDraw();
     }
//        this.clickPosX = event.
  }


  //Event in case of isInside:
  onMouseDown() {
    //what happens, if you click inside PersonFrame;
  }  

  onMouseUp() {
    //
  }

  //[+] Draw Current Person (frame + data + umbilic)
  draw() {
    this.drawRect();
    this.writeInfo();
    this.drawUmbilic();
  }

  //[+] Fill Frame with Data;
  writeInfo() {
    var fnt  = PersonFrame.font;
    var dl   = PersonFrame.indL;
    var dh   = PersonFrame.indT + fnt;
    var left = this.getX() + dl;
    var top  = this.getY() + dh;

    if (this.gender != 'U') { // <- if Known
       var life = this.birth + " - " + this.death;
       PersonFrame.writeStr( left, top      , this.name, fnt )
       PersonFrame.writeStr( left, top + dh , this.surname, fnt )
       PersonFrame.writeStr( left, top + 7*dh/4 , life, fnt*2/3 )
    } else { //<- if Unknown
       PersonFrame.writeStr( left + 3*dl, top + dh , "Unknown", 3*fnt/2 )
    }
  }

  /// Private:

  //[+] Gender -> Color;
  getColor() {
    var color;
    if (this.gender == 'F') {color = PersonFrame.femclr;}
    else if (this.gender == 'M') {color = PersonFrame.manclr;}
         else {color = PersonFrame.uknclr;}
    return color;
  }

  //[+] Draw Form;
  drawRect() {
    var color = this.getColor()
//    var xx = this.x+curPosX;
//    var yy = this.y+curPosY;
    ctx.beginPath();
    if (this.active) {var l = "4"}
       else {var l = "2"}
    ctx.lineWidth = l;
    ctx.fillStyle = color;
	//coloring:
        ctx.fillStyle = color;
        ctx.fillRect(this.getX(),this.getY(),PersonFrame.w,PersonFrame.h,color);
  ctx.rect(this.getX(),this.getY(),PersonFrame.w,PersonFrame.h);
  ctx.stroke();
  }

  //[+] Write String with (x,y) - left bottom position of the string;
  static writeStr(x,y,str,size) {
    ctx.fillStyle = "#000000";
    ctx.font = "normal " + size + "px Verdana";
    ctx.fillText(str,x,y);
  }

  // ~ toString();
  info() {
    var str = this.name + ", " + this.surname + "; "
    return str;
  }

    // PERSONFRAME :: HEIRS

  //Set Parent Family for current Person.
  setParentFamily(family) {
    this.family = family;
  }

  //Draw zig-zag line from Person to his Alma Mather.
  drawUmbilic() {
    if (this.family != null) {
      var dH = this.getY() - this.family.getMiddleY(); // <- height between this PersonFrame and Wedding. 
      var vidX = this.family.getMiddleX();
      var vidY = this.family.getMiddleY();

      ctx.beginPath();
      ctx.lineWidth = "1";

      ctx.moveTo( vidX , vidY );		    // <- point A
      ctx.lineTo( vidX , vidY + dH/2 );	// <- Zig-point

      ctx.lineTo( this.getX() + PersonFrame.w/2 , vidY + dH/2 );
      ctx.lineTo( this.getX() + PersonFrame.w/2 , vidY + dH );

      ctx.stroke();
    }  
  }

/*
function drawHeir(father,mother,child) {

  // distance down
  var dH = child.getY() - (father.getY() + mother.getY())/2;	
  var vidX = (father.getX() + mother.getX())/2 + PersonFrame.w/2;
  var vidY = (father.getY() + mother.getY())/2 + PersonFrame.h/2;

  ctx.beginPath();

  ctx.moveTo( vidX , vidY );		// <- point A
  ctx.lineTo( vidX , vidY + dH/2 );	//

  ctx.lineTo( child.getX() + PersonFrame.w/2 , vidY + dH/2 );
  ctx.lineTo( child.getX() + PersonFrame.w/2 , vidY + dH - PersonFrame.h/2 );

  ctx.lineWidth = "1";
  ctx.fillStyle = "#00FF00";
  ctx.stroke();
}
*/




} //<- END of CLASS;


	/* Common functions */

function drawWedLock(p1,p2) {

  var y = ( p1.getY() + p2.getY() + PersonFrame.h ) / 2;

  // when X1 < X2:
  var xL = ( p1.getX() + PersonFrame.w );
  var xR = p2.getX();

  ctx.beginPath();

  ctx.moveTo( xL , y - 2);
  ctx.lineTo( xR , y - 2);

  ctx.moveTo( xL , y + 2);
  ctx.lineTo( xR , y + 2);

  ctx.lineWidth = "1";
  ctx.fillStyle = "#00FF00";
  ctx.stroke();

}


function drawHeir(father,mother,child) {

  // distance down
  var dH = child.getY() - (father.getY() + mother.getY())/2;	
  var vidX = (father.getX() + mother.getX())/2 + PersonFrame.w/2;
  var vidY = (father.getY() + mother.getY())/2 + PersonFrame.h/2;

  ctx.beginPath();
  ctx.lineWidth = "1";

  ctx.moveTo( vidX , vidY );		// <- point A
  ctx.lineTo( vidX , vidY + dH/2 );	//

  ctx.lineTo( child.getX() + PersonFrame.w/2 , vidY + dH/2 );
  ctx.lineTo( child.getX() + PersonFrame.w/2 , vidY + dH - PersonFrame.h/2 );

  ctx.stroke();

}



//Draw Marriage double-line:
// y is common for both;
// x1 & x2 - x-coordinates of both frames;
function drawMarriage(x1,x2,y) {

  ctx.beginPath();

  ctx.moveTo( x1 + w , y + h/2 - 2);
  ctx.lineTo( x2 , y + h/2 - 2);

  ctx.moveTo( x1 + w , y + h/2 + 2);
  ctx.lineTo( x2 , y + h/2 + 2);

  ctx.lineWidth = "1";
  ctx.fillStyle = "#00FF00";
  ctx.stroke();

}

//Draw Heir:
// y is common for both;
// x1 & x2 - x-coordinates of both frames;
/*
function drawHeir(fx,fy,mx,my,chx,chy) {

  var dH = chy - (fy + my)/2;	// distance down
  var vidX = (fx + mx)/2 + w/2;
  var vidY = (fy + my)/2 + h/2;

  ctx.beginPath();

  ctx.moveTo( vidX , vidY );		// <- point A
  ctx.lineTo( vidX , vidY + dH/2 );	//

  ctx.lineTo( chx + w/2 , vidY + dH/2 );
  ctx.lineTo( chx + w/2 , vidY + dH - h/2 );

  ctx.lineWidth = "1";
  ctx.fillStyle = "#00FF00";
  ctx.stroke();

}
*/






 /* PERSON INITIALIZATION */

//CREATE PERSON FROM CLASS::


/*
var person1 = new PersonFrame();
person1.setPerson("Alexander","Pushkin",'M',"26.05.1799","29.01.1837");
person1.setFrame(10,10,false,false,false);
////
var person2 = new PersonFrame();
person2.setPerson("Alexandra","Pushkina",'F',"","");
person2.setFrame(10,110,false,false,false);
////
var person3 = new PersonFrame();
person3.setPerson("","",'U',"","");
person3.setFrame(10,210,false,false,false);
////
*/

/* BasicFamily */
var grandfatherF = new PersonFrame();
grandfatherF.setPerson("GrandFather","",'M',"","");
grandfatherF.setFrame(50,50,false,false,false);
////
var grandmotherF = new PersonFrame();
grandmotherF.setPerson("GrandMother","",'F',"","");
grandmotherF.setFrame(250,50,false,false,false);
////
var grandfatherM = new PersonFrame();
grandfatherM.setPerson("GrandFather","",'M',"","");
grandfatherM.setFrame(550,50,false,false,false);
////
var grandmotherM = new PersonFrame();
grandmotherM.setPerson("GrandMother","",'F',"","");
grandmotherM.setFrame(750,50,false,false,false);
////
var father = new PersonFrame();
father.setPerson("Father","",'M',"","");
father.setFrame(250,200,false,false,false);
////
var mother = new PersonFrame();
mother.setPerson("Mother","",'F',"","");
mother.setFrame(450,200,false,false,false);
////
var uncle = new PersonFrame();
uncle.setPerson("Uncle","",'M',"","");
uncle.setFrame(650,200,false,false,false);
////
var son1 = new PersonFrame();
son1.setPerson("The First Son","",'M',"","");
son1.setFrame(600,350,false,false,false);
////
var son2 = new PersonFrame();
son2.setPerson("The Second Son","",'M',"","");
son2.setFrame(800,350,false,false,false);
////
var daughter = new PersonFrame();
daughter.setPerson("Daughter","",'F',"","");
daughter.setFrame(210,350,false,false,false);
////
var someone = new PersonFrame();
someone.setPerson("","",'U',"","");
someone.setFrame(410,350,false,false,false);
////
var grandson = new PersonFrame();
grandson.setPerson("Grandson","",'M',"","");
grandson.setFrame(310,450,false,false,false);

// Add Family into PersonTree::
var list = [grandfatherF,grandmotherF, new PersonFrame(),
	        grandfatherM,grandmotherM,
	        father, mother, uncle,
	        son1, son2, daughter, someone, grandson];

var jsonPersons = JSON.stringify(list); 


//add Pushkin
var person1 = new PersonFrame();
person1.setPerson("Alexander","Pushkin",'M',"26.05.1799","29.01.1837");
person1.setFrame(10,460,false,false,false);
//tree.persons.push(person1);

var json1 = JSON.stringify(person1);

var json2 = `{"name":"Peter the Great",
			 "surname":"Romanov",
             "gender":"M",
             "birth":"09.06.1672",
             "death":"08.02.1725",
             "x":110,
             "y":460,
             "active":false,
             "hiden":false,
             "move":false}`;
             
var person2 = new PersonFrame();
person2.from(json2);
//tree.persons.push(person2);

var someone2 = new PersonFrame();
someone2.setPerson("","",'U',"","");
someone2.setFrame(10,350,false,false,false);
//tree.persons.push(someone2);

var person3 = new PersonFrame();
person3.load('/newton.json')

    /* WEDDING INITIALIZATION */

var w1 = new Wedding(father,mother);
//w1.active = true;
var w2 = new Wedding(grandfatherF,grandmotherF);
var w3 = new Wedding(grandfatherM,grandmotherM);
var w4 = new Wedding(daughter,someone);
var w5 = new Wedding(someone2,daughter);

var ws = [w1, w2, w3, w4, w5];

var jsonFamilies = JSON.stringify(ws); 


    /* INITIALIZATION OF DESCENDANTS*/

son1.setParentFamily(w1);
son2.setParentFamily(w1);
daughter.setParentFamily(w1);
mother.setParentFamily(w3);
uncle.setParentFamily(w3);
father.setParentFamily(w2);
grandson.setParentFamily(w4);



var jsonW1 = JSON.stringify(w1);

var json3 = JSON.stringify(father);


    /* TREE INITIALIZATION */

//Create Tree <- list, ws
var tree = new PersonTree(list,ws);
tree.persons.push(person2);
tree.persons.push(person1);
tree.persons.push(someone2);

var jsonTree = JSON.stringify(tree);


	/* CANVAS EVENTS */

document.addEventListener('mousemove', logKey); // <- log;

// write clickPos:
document.addEventListener('click', e => {clickPosX = e.clientX; 
				                         clickPosY = e.clientY;});

// OnClick: stDefault & stAddPers
document.addEventListener("click", e => 
                            {
                              if (tree.stAddPers) {
                                  log+= "Add ";
                                  tree.addPers(e,new PersonFrame())
                              } else {
                                if (tree.stMoveFrames) {log+= "Stop move "; 
                                                        tree.stopMoveFrames(e)}
                                else {tree.click(e);
                                      log+= "click ";
                                };
                              }
                              reDraw();
                            });                         

//document.addEventListener("click", e => {PersonTree.click(e)}); //<-static

//Family //"mousemove"
document.addEventListener("mousemove", e => {tree.move(e)});


//document.addEventListener("mousemove", e => {
//                                            if (e.shiftKey) {tree.move(e)}
//                                            });


document.addEventListener("keydown", e => { if (e.ctrlKey) 
                                                tree.stAddPers = true;
                                            if (e.shiftKey) 
                                                if (!tree.stMoveFrames) {tree.stMoveFrames=true}
                                                   else tree.stopMoveFrames(e)
                                            if (e.metaKey)
                                                tree.stSetWedding = true;
                                            reDraw();
                                          });



	/* DRAW */

function clearCanvas() {
  ctx.beginPath();
  ctx.clearRect(0,0,1000,800);
  ctx.stroke();
}

// Draws ALL on the Canvas.
function reDraw() {

  clearCanvas();

  tree.drawBackGround();

/*  //Heirs:
//  drawHeir(father,mother,son1);
//  drawHeir(father,mother,son2);
//  drawHeir(father,mother,daughter);
  drawHeir(grandfatherM,grandmotherM,mother);
  drawHeir(grandfatherM,grandmotherM,unkle);
  drawHeir(grandfatherF,grandmotherF,father);
  drawHeir(someone,daughter,grandson);
*/
  //Family
  tree.draw(); //<- not static
  //PersonTree.draw();

}

// OTHER: LOG-BAR::

screenLog = document.querySelector('#screen-log');

function logKey(e) {
  screenLog.innerText = `
    Screen X/Y: ${e.screenX}, ${e.screenY}
    Client X/Y: ${e.clientX}, ${e.clientY}
    ClickPos X/Y: ${clickPosX}, ${clickPosY}
    Tree: ${tree.persons.toString()}
    Tree.AddState: ${tree.stAddPers}
    Tree.MoveState: ${tree.stMoveBoard}
    Tree.AutoCorrection: ${tree.stAutoCorrection}
    Tree.Background: ${tree.stBackground}
    Tree.SetWeeding: ${tree.stSetWedding}
    Tree.SetFamily: ${tree.stSetFamily}
    Tree.MoveFrames: ${tree.stMoveFrames}

    Pushkin-json: ${json1}
    Father-json: ${json3}
    Family-json: ${jsonW1}



    Log: ${log}`;

//  ${tree.persons[1].info()}
//    List[1]: ${list[1].toString()}, ${list[1].info()} 
/*
    Tree-json: ${jsonTree}
    Tree.Persons-json: ${jsonPersons}
    Tree.Families-json: ${jsonFamilies}
*/
}

    /* UPLOADING PART */

document.getElementById('jsonFile').addEventListener( 
  'change',  
  changeEvent => { 
    changeEvent.stopPropagation(); 
    changeEvent.preventDefault(); 
    readJsonFile(changeEvent.target.files[0]); // <- Load Person
    //readJsonTree(changeEvent.target.files[0]); 
  }, 
  false 
); 

// Load Single Person;
function readJsonFile(jsonFile) { 
  var reader = new FileReader(); 
  reader.addEventListener('load', (loadEvent) => { 
    try { 
     // json = JSON.parse(loadEvent.target.result); 
      log+= "\n[Added]: "+loadEvent.target.result;
      var person = new PersonFrame();
          person.from(loadEvent.target.result);
          log+= "Name: "+person.name;

          tree.persons.push(person);
          reDraw();
    } catch (error) { 
      log+= "\n[Error]: "+error; 
    } 
  }); 
  reader.readAsText(jsonFile);  // <- it's necessary.
} 

//Load Tree:
function readJsonTree(jsonTree) { 
  var reader = new FileReader(); 
  reader.addEventListener('load', (loadEvent) => { 
    try { 
     // json = JSON.parse(loadEvent.target.result); 
      log+= "\n[Added]: "+loadEvent.target.result;
      var newTree = new PersonTree([],[]);
          newTree.from(loadEvent.target.result);
          log+= "Name: "+newTree;
          tree = newTree;
          reDraw();
    } catch (error) { 
      log+= "\n[Error]: "+error; 
    } 
  }); 
  reader.readAsText(jsonFile); 
} 







	 /* RUN */

reDraw();










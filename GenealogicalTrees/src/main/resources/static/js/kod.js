   /* Initialization */

//set margins:
document.getElementById("myDiv").style.margin = "-10px -10px -10px -24px";
// top,right,

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var log = "";

//Set Canvas Size:  <- call it OnResize!
var csW;
var csH;

function setCS() {
    csW = window.innerWidth-24;
    csH = window.innerHeight-48;
    ctx.canvas.width  = csW; 
    ctx.canvas.height = csH;
}

setCS();


// Shift of Canvas from left top point.
var decX = 00;
var decY = 00;


//global variables;
var clickPosX;
var clickPosY;
var curPosX;
var curPosY;
var movement = false;

//for movingLines;
var coursorX;
var coursorY;
 

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

  //[+] This method removes all active objects. 
  deleteActive() {
    
    //lists of objects to remove
    var persToRemove = this.persons.filter( pers => (pers.active == true) );
    var wedsToRemove = this.weddings.filter( wed => (wed.active == true) );
    
    //add Weddings with deleted person to the list to be removed.
    wedsToRemove = wedsToRemove.concat(this.weddings.filter( wed => 
        (persToRemove.includes(wed.husband) || persToRemove.includes(wed.wife) ) ) );

    this.persons = this.persons.map( pers => {
                        if (wedsToRemove.includes(pers.family)) {
                           pers.family = null;
                           //pers.gender = !pers.gender;
                        };
                        return pers;
                    //    }
                   } );

    //clean children links:


    this.persons = this.persons.filter( pers => (!persToRemove.includes(pers)) );
    this.weddings = this.weddings.filter( wed => (!wedsToRemove.includes(wed)) );

  }

  // Draw Wedding Lines from Active Persons to Current Coursor Position
  coursorLine() {
  
      //Set Wedding.
      if (this.stSetWedding)
          for (var i=0; i<this.persons.length; i++) {
              if (this.persons[i].active) {
                  var pcX = this.persons[i].x + PersonFrame.w/2;
                  var pcY = this.persons[i].y + PersonFrame.h/2;
                  var d = 4;

                  ctx.beginPath();
                  ctx.lineWidth = "1";

                  ctx.moveTo( pcX - d , pcY - d);
                  //ctx.moveTo( pcX - 1, pcY - 1);
                  ctx.lineTo( event.clientX - d, event.clientY - d);

                  log+= "A!";
                  ctx.fillStyle = "#000000";

                  ctx.moveTo( pcX + d , pcY + d);
                  ctx.lineTo( event.clientX + d , event.clientY + d);

                  ctx.stroke();

              } 
          }
      
      //Set Family.
      if (this.stSetFamily)
          for (var i=0; i<this.persons.length; i++) {
              if (this.persons[i].active) {
                // Drawing using virtual Parents.
                var virtualParent = new PersonFrame();
                    virtualParent.setFrame(coursorX - PersonFrame.w/2,coursorY- PersonFrame.h/2,false,true,true)
                var virtualMarriage = new Wedding(virtualParent,virtualParent); 
                this.persons[i].family = virtualMarriage;               
                //
                // <&>
                //
                //
              }
          }

  };

  
  // Set new marriage between victim and active persons.
  setMarriages(victim) {
      //log+= victim.info();
      for (var i=0; i<this.persons.length; i++) {
          if (this.persons[i].active && this.persons[i] != victim) {
             this.persons[i].active = false;

             //add wedding [no check if there is that wedding already ]
             var wedding = new Wedding(this.persons[i],victim);
             this.weddings.push(wedding);

             //set positions
             //...
          } 
      }         
  }








  drawBackGround() {
    if (this.stBackground) {
      ctx.beginPath();       
      var h = PersonFrame.h;
      var hh = PersonTree.distH;
      var color1 = PersonTree.bgclr1;
      
      for ( var i = 0; i<= (csH / (h+hh)) ; i++) {
          ctx.fillStyle = color1;
          ctx.fillRect(0,this.y+hh+i*(h+hh), csW ,h,PersonTree.bgclr1);
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

  //Private clickPersons
  clickPersons(event) {
    var l = this.persons.length;
    for (var i=l-1; i>=0; i--) {
        if (this.persons[i].isInside(event.clientX,event.clientY)) {
            if (!this.stSetWedding) {
                this.onTop(i);
                this.persons[l-1].onClick(event);
            } else { // if SetWedding:
                this.stSetWedding = false;
                this.setMarriages(this.persons[i]);
                reDraw();
            }
        break;
        }
    }
  };

  //Private clickWeddings;
  clickWeddings(event) {
    var l = this.weddings.length;
    for (var i=l-1; i>=0; i--) {
        if (this.weddings[i].isInside(event.clientX,event.clientY)) {
            if (!this.stSetFamily) {
                this.weddings[i].onClick(event);            
                break;
            } else { // if stSetFamily == true;
                for (var j=0; j<this.persons.length; j++) {
                    if (this.persons[j].active) {
                        this.persons[j].family = this.weddings[i];
                        this.persons[j].active = false;
                    }    
                    this.stSetFamily = false;      
                }
            }     
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

  json() {
    return JSON.stringify(this);
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

} //<- END of CLASS;


	/* Common functions */
	    /* CASTS*/
	
	
  //CastPersonFrame
  function castPersonFrame(object) {
    var res = new PersonFrame();
        
        res.name = object.name;
        res.surname = object.surname;
        res.gender = object.gender;
        res.birth = object.birth;
        res.death = object.death;
        
        res.x = object.x;
        res.y = object.y;
        res.active = object.active;
        res.hiden = object.hiden;

        res.family = object.family;

    return res;
  }
  
  
  // need check;
  function castWedding(object) {
    var res = new Wedding();
    
    var husband = new PersonFrame();
    res.husband = castPersonFrame(object.husband)
    
    var wife = new PersonFrame();
    res.wife = castPersonFrame(object.husband)
    
    res.active = object.active;
  
    return res;
  }

/*
  function castPersonTree(object) {
  
  }
*/

 /* PERSON INITIALIZATION */

//CREATE PERSON FROM CLASS::

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

var ps = [person1, person2];
var jsonps = JSON.stringify(ps);

    /* WEDDING INITIALIZATION */

var w1 = new Wedding(father,mother);
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


//----------------------------------------------------------------------------------------------------------------------------------------


//load persons from jpersons from persons.js
// jperson -> [persons]

var person7 = `{"id":"0",
                "name":"person1",
                "surname":"",
                "gender":"M",
                "birth":"",
                "death":"",
                "family":null,
                "x":100,
                "y":100,
                "active":false,
                "hiden":false,
                "move":false}`; 

/* IT WORKS!!!! YEEEEE!!! WORKS!!!! */
function loadPersons2() {
    var result = [];
    
//    JSON.stringify(jpersons);
    
    
    var x = JSON.parse(jpersons);
    
    for (var k in x) {
         log+="\n element: \t "+k+"\t"+JSON.stringify(x[k]);
         result.push(castPersonFrame(x[k]));
    }
return result;
};

//---------------------------------------
// WORKS!! (for single person)
var x = JSON.parse(person7);
//tree.persons.push(castPersonFrame(x));        
//---------------------------------------

//<<*
// INTERCEPTION!!!
tree.persons = loadPersons2();
tree.weddings= [];


//NEWTON::
//does not work	        
//tree.persons.push( CastPersonFrame(newton1) );

// Load from another js. - file;

// <! T_T !>

//var newton1 = '{"name":"Sir Isaac","surname":"Newton","gender":"M","birth":"25.12.1642","death":"20.05.1726","family":null,"x":800,"y":460,"active":false,"hiden":false,"move":false}';
//var frida1 = '{"name":"Frida","surname":"Kahlo","gender":"F","birth":"06.07.1907","death":"13.07.1954","family":null,"x":30,"y":200,"active":false,"hiden":false,"move":false}';


/* // Works: load persons from external file
var personX = new PersonFrame();
    personX.from(darwin4);
    
tree.persons.push(personX);    
*/  



    /* NEW FROM HERE:: LOAD JSON [PerosonFrame]*/



// JSON [Person] -> [Person]
function jsonToPersonList(json) {
    log+= "\n get json: " + json;
    var res = [];
    var x = JSON.parse(json);
    log+= "\n parse: " + x;
    for (var k in x) {
        log+= "\n iterator k: " + k;
        log+= "\n object x[k]: " + x[k];                
        log+= "\n json x[k]: " + x[k].json;             // <- undefined
        
        var t = JSON.stringify(x[k])
        
        log+= "\n json x[k]: " + t;                     // <- work!
        
        log+= "\n parsed json x[k]: " + JSON.parse(t);      // <- do not work!
        
        
        if (true) { //(x[k] instanceof PersonFrame) {
            //var p = new PersonFrame();
        //    p.from(JSON.stringify(x[k]));
            log+= "\n true; obj: " + x[k];
            log+= "\n it's json: " + JSON.stringify(x[k]);
            //tree.persons.push(x[k])
            res.push(castPersonFrame(x[k]));            
        } else {
            log+= "\n false; "+x[k].json;
        }
    } 
    return res;    
};


jsontest = '[{"name":"Alexander","surname":"Griboedov","gender":"M","birth":"15.01.1795","death":"11.02.1829","family":null,"x":10,"y":460,"active":false,"hiden":false,"move":false}, {"name":"Peter","surname":"Kropotkin","gender":"M","birth":"09.12.1842","death":"08.02.1921","x":410,"y":560,"active":false,"hiden":false,"move":false}, {"name":"Karl","surname":"Marx","gender":"M","birth":"05.05.1818","death":"14.04.1883","x":210,"y":260,"active":false,"hiden":false,"move":false}]';

//Persons:


//works
var xs = jsonToPersonList(jsontest);
//tree2 = new PersonTree(xs,[]);



// INTERCEPTION!
//tree = new PersonTree(xs,[]);


//tree.persons = tree.persons.concat(x);  



    /* json-requests */

/* example that works: */

var requestURL = 'https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json';

var request = new XMLHttpRequest();

request.open('GET', requestURL);
request.responseType = 'text'; // now we're getting a string!
// = 'json';
request.send();
log+= "request1: "+JSON.stringify(request);

request.onload = function() {
  var superHeroesText = request.response; // get the string from the response
  var superHeroes = JSON.parse(superHeroesText); // convert it to an object
  log+= "\n superHeroes: formed"+superHeroes.formed;
}

/* my variant: */

log+= "\n<Bunin test>"

var myURL = 'http://www.999.id.lv:8080/Bunin.json';

var request2 = new XMLHttpRequest();

request2.open('GET', myURL);
request2.responseType = 'text'; // now we're getting a string!
// = 'json';
request2.send();
log+= "2request2: "+JSON.stringify(request2);

request2.onload = function() {
  var json = request.response; // get the string from the response
      log+= "\n json request: "+json;
  var obj = JSON.parse(superHeroesText);
  var pers = castPersonFrame(obj);
      tree = new PersonTree([pers],[]);
      log+= "\n Loaded Person: "+pers.info;
}

log+= "</Bunin test>"









//----------------------------------------------------------------------------------------------------------------------------------------



	/* CANVAS EVENTS */

document.addEventListener('resize', setCS() ); // <- log;


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

document.addEventListener("mousemove", e => {tree.move(e); 
                                            coursorX=e.clientX;
                                            coursorY = e.clientY
                                            reDraw()});

document.addEventListener("keydown", e => { if (e.ctrlKey) 
                                                tree.stAddPers = true;
                                            if (e.shiftKey) 
                                                if (!tree.stMoveFrames) {tree.stMoveFrames=true}
                                                   else tree.stopMoveFrames(e)                            
                                            //if (e.metaKey)
                                            //    tree.stSetWedding = true;
                                            reDraw();
                                          });                                          

document.addEventListener('keydown', 
    (event) => {
        if (event.key == "w") {tree.stSetWedding = !tree.stSetWedding} 
        if (event.key == "d") {tree.deleteActive()} 
        if (event.key == "t") {tree.stSetFamily = !tree.stSetFamily}
        else {log+= event.key;} 
        reDraw();
    });



	/* DRAW */

function clearCanvas() {
  ctx.beginPath();
  ctx.clearRect(0,0,csW,csH);
  ctx.stroke();
}

// Draws ALL on the Canvas.
function reDraw() {

  clearCanvas();

  tree.drawBackGround();

  tree.coursorLine();

  tree.draw(); 
  
 // tree2.draw();


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
    Pushkin2-json: ${person1.json()}
    
    [Persons]-json: ${jsonps}
    
    wedding-json: ${JSON.stringify(w1)}
    
    Father-json: ${json3}
    Family-json: ${jsonW1}
    
    ${jsonps}
    
    Azathoth: ${azathoth}
    Log: ${log}`;

}

    /* UPLOADING PART */

document.getElementById('jsonFile').addEventListener( 
  'change',  
  changeEvent => { 
    changeEvent.stopPropagation(); 
    changeEvent.preventDefault(); 
    readJsonFile(changeEvent.target.files[0]); // <- Load Person
    readJsonPersonList(changeEvent.target.files[0]); // <- Load Person
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


//UnPack [Persons]::
function loadPersons(json) {
   var list = JSON.parse(json);
   log+= "\n"+list;
   var res = [];
   for (var i=0; i<list.length; i++) {
       var person = new PersonFrame();
           log+= "\n"+i+":\t"+list[i].json;
           person.from(list[i].json)
           res.push(person);
   }
   log+= "\n result: \t"+res;
   return res;
  }




// readJsonPersonList
function readJsonPersonList(jsonFile) { 
  var reader = new FileReader(); 
  reader.addEventListener('load', (loadEvent) => { 
    try { 
     // json = JSON.parse(loadEvent.target.result); 
      log+= "\n[Added]: "+loadEvent.target.result;
      var list = loadPersons(loadEvent.target.result);
          tree.persons = tree.persons.concat(list);
          reDraw();
    } catch (error) { 
      log+= "\n[Error]: "+error; 
    } 
  }); 
  reader.readAsText(jsonFile);  // <- it's necessary.
} 



//*** IT DOES NOT WORK>>>
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

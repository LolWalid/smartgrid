var taille = 15;
var default_url = "img/grass.png";

function add(name, i, top, left, url, zindex) {
  $("#map")
  .append('<img \
    src="' + url + '"\
    id= "' + name + i + '"\
    class= ""\
    style="top : '+ top +'px; \
    left : '+ left +'px; \
    z-index :' + zindex + ';\
    "/>');
}

function add_tree(i,j) {
  add("tree", i, (i + j) * 25, (i - j) * 50, "img/aap/arbre.png", 1) ;
  //add("tree", , (i  j) * 25, (i - j) * 50, "img/aap/maisons.png") ;
}


function add_road() {
  for (var j=0; j < taille; j++) {
    if (j != 3 && j !=4 && j!=5)
      $("#i_" + 2 +"-j_" + j).attr('src', "img/roadEast.png");
  }
}

function add_tile(i,j,url,offset) {
  $("#i_" + i +"-j_" + j).attr('src', url);
  $("#i_" + i +"-j_" + j).css({
    'top': parseInt($("#i_" + i +"-j_" + j).css('top')) + offset,
  })
}

var moveOffLeft = -2;
var moveOffTop = 1;

function move(elem) {

  var left = 110;
  var top = 24;

  function frame() {

    left += moveOffLeft;  // update parameters
    top += moveOffTop;

    elem.css({
      'left' : left + 'px', // show frame
      'top' : top + 'px'
    })

    if (left < -380 && top < 280)  // check finish condition
    {
      moveOffLeft = 2;
      moveOffTop = 1;
      elem.attr('src',"img/vehicules/bus_face.png")
    }
    if (left > 230 && top > 500 && top != 60)
      {  // check finish condition
        elem.attr('src',"img/vehicules/bus_cote.png")
        //elem.hide();
        left = 110;
        top = 24;
        elem.css({
          'left' : left + 'px', // show frame
          'top' : top + 'px'
        });
        moveOffLeft = -2;
        moveOffTop = 1;
        play();
        clearInterval(id);
      }
    }

  var id = setInterval(frame, 10) // draw every 10ms
}

function play() {
    setTimeout(function(){
      move ($('#bus'));
    }, Math.random() * 5000);
}


ready = $(function() {
  $("#map").css({
    'position': 'relative',
    'margin-left': 50*taille + "px"
  });

  for (var i=0; i < taille; i++) {
    for (var j=0; j < taille; j++) {
      $("#map")
      .append('<img \
        src=' + default_url + ' \
        id= "i_'+ i + "-j_" + j +'" \
        class="tile" \
        style="top : '+ (i + j) * 25 +'px; \
        left : '+ (i-j) * 50 +'px; \
        "/>');
    }
    $("#map")
    .append("<br />");
  }


  for (var i=0; i<taille; i++)
    add_tile(i,4,"img/water/riverBankedWaterfallS.png",0);

  for (i=3;i<taille;i++) {
    add_tree(i, 10.1);
    add_tree(i, 2.7);
    add_tree(i, 3.7);
  }

  // add road
  add_road();
  for (var i= 3; i<taille; i++)
    add_tile(i, 10,"img/roadNorth.png", 0);

  for (var i = 3; i<taille; i++)
    add_tile(i, 2,"img/roadNorth.png", 0);

  //add bridge
  add_tile(3, 5,"img/hillCornerEast.png", -15);
  add_tile(1, 5,"img/hillCornerSE.png", 0);
  add_tile(3, 3,"img/hillCornerNW.png", 0);
  add_tile(1, 3,"img/hillCornerWest.png", 0);
  add_tile(2,5,"img/hillRoadEast.png",-15);
  add_tile(2,3,"img/hillRoadWest.png",0);
  add_tile(2,4,"img/water/bridgeHighBankedEW.png",-12);

  add_tile(2, 2,"img/roadTSouth.png", 0);
  add_tile(2, 10,"img/roadTSouth.png", 0);

  add("house", 0, -20, 63, "img/aap/maisons.png", 3);
  add("house", 0, 272, -150, "img/aap/maisons.png", 2);
  add("house", 0, 150, 400, "img/aap/maisons.png", 3);
  add("house", 0, 100, -500, "img/aap/maisons_side.png", 2);
  add("eolienne", 0, 390, 275, "img/aap/eolienne2.png", 2);
  add("eolienne", 0, 300, 175, "img/aap/eolienne.png", 2);
  add("eolienne", 0, 290, 75, "img/aap/eolienne2.png", 2);
  add("eolienne", 0, 200, -25, "img/aap/eolienne.png", 1);
  add("eolienne", 0, 170, -155, "img/aap/eolienne2.png", 3);

  add("bus","", 24, 110, "img/vehicules/bus_cote.png", 2);
  //add("mac_do", 0, 272, -150,"img/macdo.png");
  //add("appart", 0, 80, 400, "img/building2.png");
    play();
});

$(document).ready(ready);


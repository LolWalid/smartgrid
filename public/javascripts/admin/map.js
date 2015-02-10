var taille = 15;
var default_url = "/img/grass.png";

function add(name, i, top, left, url, zindex) {
  $("#map")
  .append('<img \
    src="' + url + '"\
    class= "' + name + '"\
    class= ""\
    style="top : '+ top/2 +'px; \
    left : '+ left/2 +'px; \
    z-index :' + zindex + ';\
    "/>');
}

function add_tree(i,j) {
  add("tree", i, (i + j) * 25, (i - j) * 50, "/img/aap/arbre.png", 3) ;
}


function add_road() {
  for (var j=0; j < taille; j++) {
    if (j != 3 && j !=4 && j!=5)
      $("#i_" + 2 +"-j_" + j).attr('src', "/img/roadEast.png");
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

  var left = 57;
  var top = 6;

  function frame() {

    left += moveOffLeft/2;  // update parameters
    top += moveOffTop/2;

    elem.css({
      'left' : left + 'px', // show frame
      'top' : top + 'px'
    })

    if (left < -190 && top < 140)  // check finish condition
    {
      moveOffLeft = 2;
      moveOffTop = 1;
      elem.attr('src',"/img/vehicules/bus_face.png")
    }
    if (left > 115 && top > 250 && top != 30)
      {  // check finish condition
        elem.attr('src',"/img/vehicules/bus_cote.png")
        //elem.hide();
        left = 57;
        top = 6;
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
    move ($('.bus'));
  }, Math.random() * 5000);
}


ready = $(function() {
  $("#map").css({
    'position': 'relative',
    'margin-left': '50%',
    'margin-top': '10%'
  });

  for (var i=0; i < taille; i++) {
    for (var j=0; j < taille; j++) {
      $("#map")
      .append('<img \
        src=' + default_url + ' \
        id= "i_'+ i + "-j_" + j +'" \
        class="tile" \
        style="top : '+ (i + j) * 25/2 +'px; \
        left : '+ (i-j) * 50/2 +'px; \
        "/>');
    }
    $("#map")
    .append("<br />");
  }


  for (var i=0; i<taille; i++)
    add_tile(i,4,"/img/water/riverBankedWaterfallS.png",0);

  for (i=3;i<taille-1;i++) {
    add_tree(i, 9.4);
    add_tree(i, 2.1);
    add_tree(i, 3.1);
  }

  // add road
  add_road();
  for (var i= 3; i<taille; i++)
    add_tile(i, 10,"/img/roadNorth.png", 0);

  for (var i = 3; i<taille; i++)
    add_tile(i, 2,"/img/roadNorth.png", 0);

  //add bridge
  add_tile(3, 5,"/img/hillCornerEast.png", -7);
  add_tile(1, 5,"/img/hillCornerSE.png", 0);
  add_tile(3, 3,"/img/hillCornerNW.png", 0);
  add_tile(1, 3,"/img/hillCornerWest.png", 0);
  add_tile(2,5,"/img/hillRoadEast.png",-7);
  add_tile(2,3,"/img/hillRoadWest.png",0);
  add_tile(2,4,"/img/water/bridgeHighBankedEW.png",-6);

  add_tile(2, 2,"/img/roadTSouth.png", 0);
  add_tile(2, 10,"/img/roadTSouth.png", 0);

  add("house", 0, -30, 63, "/img/aap/maisons.png", 3);
  add("house", 0, 265, -150, "/img/aap/maisons.png", 2);
  add("house", 0, 140, 400, "/img/aap/maisons.png", 3);
  add("house", 0, 80, -500, "/img/aap/maisons_side.png", 2);

});

$(document).ready(ready);


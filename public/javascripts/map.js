var taille = 15;
var default_url = "img/grass.png";


function add_tree(i,j) {
  $("#map")
  .append('<img \
    src="img/treeConiferTall.png"\
    id= "tree_'+ i + '_' + j + '"\
    class= "tree"\
    style="top : '+ (i + j) * 25 +'px; \
    left : '+ (i-j) * 50 +'px; \
    "/>');
}

function add_road() {
  for (var j=0; j < taille; j++)
    if (j != 3 && j !=4 && j!=5)
      $("#i_" + 1 +"-j_" + j).attr('src', "img/roadEast.png");
  }

  function add(i,j,url,offset) {
    $("#i_" + i +"-j_" + j).attr('src', url);
    $("#i_" + i +"-j_" + j).css({
      'top': parseInt($("#i_" + i +"-j_" + j).css('top')) + offset,
    })
  }

  function ajout(url, i, j, size,offset) {
    var id = "#i_" + i +"-j_" + j;

    $(id).attr('src', url);

    var z_index = parseInt($(id).css('z-index')) + 1;
    $(id).css({
      'top' : parseInt($(id).css('top')) + offset,
      'width': size * 100,
      'left': parseInt($(id).css('left')) - (size-1) * 50,
      'z-index': z_index
    });

/*  for (k=i; k < taille;k++) {
    for (n=j+size; n < taille; n++)
      $("#i_" + k +"-j_" + n).css("z-index",z_index);
  }
  for (k=i+size; k < taille;k++) {
    for (n=j; n < taille; n++)
      $("#i_" + k +"-j_" + n).css("z-index",z_index);
  }
  */
};

function remove(i, j, size) {
  var id = "#i_" + i +"-j_" + j;
  var z_index = parseInt($(id).css('z-index'));

  $(id).attr('src', default_url);
  $(id).css({
    'width': 100,
    'left': parseInt($(id).css('left')) + (size-1) * 50,
    'z-index': z_index
  });

  for (var k=0; k < size; k++){
    for (var n=0; n < size; n++){
      if (!(k==0 && n==0))
        $("#i_" + (i+k) +"-j_" + (j+n)).css("z-index", z_index);
    }
  }
};

var moveOffLeft = -2;
var moveOffTop = 1;
function move(elem) {

  var left = -30;
  var top = 47;

  function frame() {

    left += moveOffLeft;  // update parameters
    top += moveOffTop;

    elem.css({
      'left' : left + 'px', // show frame
      'top' : top + 'px'
    })

    if (left < -430 && top < 275)  // check finish condition
    {
      moveOffLeft = 2;
      moveOffTop = 1;
      elem.attr('src',"img/vehicules/bus_face.png")
     // clearInterval(id);
   }
    if (left > 200 )  // check finish condition
      clearInterval(id);

  }

  var id = setInterval(frame, 10) // draw every 10ms
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
    add(i,4,"img/water/riverBankedWaterfallS.png",0);


  add(1,5,"img/hillRoadEast.png",-15);

  add(1,3,"img/hillRoadWest.png",0)
  add(1,4,"img/water/bridgeHighBankedEW.png",-12)

  for (i=2;i<taille;i++) {
    x = (Math.random() * (taille-1));
    y = (Math.random() * (taille-1));
    add_tree(i,10.1);
    add_tree(i,2.7);
    add_tree(i,3.7);
  }
  add_road();

  add(2,5,"img/hillCornerEast.png",-15);
  add(0,5,"img/hillCornerSE.png",0);
  add(2,3,"img/hillCornerNW.png",0);
  add(0,3,"img/hillCornerWest.png",0);
  ajout("img/house.png",3,0,2,-50);

  ajout("img/macdo.png",6,6,4,-28);
  ajout("img/building2.png",9,0,2,-145);

  add(1,2,"img/roadTSouth.png",0);
  add(1,10,"img/roadTSouth.png",0);

  for (var i= 2; i<taille; i++)
    add(i,10,"img/roadNorth.png",0);

  add(6,10,"img/roadTEast.png",0);
  add(9,10,"img/roadTEast.png",0);

  for (var i= 2; i<taille; i++)
    add(i,2,"img/roadNorth.png",0);

  add(3,2,"img/roadTEast.png",0);
  add(4,2,"img/roadTEast.png",0);

  $("#map")
  .append('<img \
    src="img/vehicules/bus_cote.png" \
    id= "bus" \
    class="" \
    style="top : '+ 47 +'px; left : '+ -30 +'px; z-index: 3; \
    "/>');

  move ($('#bus'));
/*  ajout('img/gros.png',2,2,2);
  ajout('img/gros.png',1,1,1);
  ajout('img/gros.png',4,4,4);
  */
  //remove(4,4,4);

});

$(document).ready(ready);


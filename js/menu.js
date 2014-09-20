/*  Menu functions
 *  fade in, menu slider
 * */

var $submenu = jQuery('.submenu');
var left


/**
 *   slideMenu
 *   slide level menu items on arrow push
 **/
 function slideMenu (direction){
    console.log("to the " + direction);

    if(direction === "left"){
        // TODO active Element verschieben
        // TODO prüfen ob first/ last element active
        $submenu.animate({left: "-=116px"}, 300 );
    }else{ //right
        $submenu.animate({left: "+=116px"}, 300 );
    }

}

/**
 *   appendArrows
 *   fade in effect background and footer
 **/
function appendArrows(){

   console.log(jQuery('nav>ul').offset());
   var activePosition = jQuery('.submenu li.active div').offset();
    console.log(activePosition);

}

/**
 *   initMenu
 *   appends level submenu to menu
 *   fade in effect background and footer
 **/
function initMenu(){
    //TODO level Menu aus array erstellen je nach Anzahl, dann Pfeile dran :D
    appendArrows();

    //TODO set .active depending on User progress Save

    //TODO fade in animation

}

/*---  function calls ---*/
initMenu();



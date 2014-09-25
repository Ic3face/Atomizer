/*  Menu functions
 *  fade in, menu slider
 * */

var $submenu = jQuery('.submenu');
var left;

//// getting all levels existing from backend ??"?"
//var allLevel = [
//    {"stage11":"done", "stage12":"done", "stage13":"done"},
//    {"stage11":"John", "stage12":"Doe", "stage13":"Doe"},
//    {"stage11":"John", "stage12":"Doe", "stage13":"Doe"},
//    {"stage11":"John", "stage12":"Doe", "stage13":"Doe"}
//];
//
//// getting data about user progress separately --> less data per user
//var userLevel = [
//    {"stage11":"done", "stage12":"done", "stage13":"done"},
//    {"stage21":"done", "stage22":"", "stage23":""}
//];

/**
 *   initMenu
 *   fly in effects
 *   append level menu to html
 **/
function initMenu (){
        // TODO
}


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

/**
 *   setActive
 *   adds active class to sub-menu
 **/
function setActive (el){
    jQuery('nav#level li').removeClass('active');
    el.parent().addClass('active');
}

/*---  function calls ---*/
initMenu();
jQuery('nav#level a[href="#"]').on('click', function(event){
    event.preventDefault();
    setActive(jQuery(this));
});





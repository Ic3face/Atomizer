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
    var $pseWrapper = jQuery('#pse');
    var atomArray = [];
    // create atoms and fill atomArray
    for(var i = 0; i < 83; i++) {
        var atom = document.createElement("div");
        var atomStyle = 'background-position: ' + i*-45 + 'px 0;';// opacity: 0';
        atom.setAttribute('style', atomStyle);
        atom.setAttribute('class', 'atom');
        atom.setAttribute('title', "PSE Nr: "+(i+1));

        atomArray.push(atom);
    }

    // add atoms
    // table width = 1200px, margin = 5px, max 18 atoms per row
    var atomWidth = 45;//px
    var spacer;
    for(var i = 0; i < atomArray.length; i++) {
        spacer = 5;
        if (i === 1){ // atom n-1
            spacer = ((atomWidth+10)*16)+5; // (atomWidth + 2*margin)*spaces + margin-left
        }else if(i === 4 || i === 12){
            spacer = ((atomWidth+10)*10)+5;
        }
        jQuery(atomArray[i]).css({"margin-left": spacer + "px"}).appendTo($pseWrapper);
    }


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

   //console.log(jQuery('nav>ul').offset());
   var activePosition = jQuery('.submenu li.active div').offset();
   // console.log(activePosition);

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





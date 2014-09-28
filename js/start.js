/* Start Screen functions
*  generating Elements, fade in, fade out page transition
* */

// set global elements
var $atom, $overlay = jQuery('div.overlay');
var VecX,VecY;
var clickSound = new Audio('resources/sounds/click.mp3');

/**
 *   normalizeVector
 *   shortens Vector to normal length 1
 **/
function normalizeVector (){
    var lengthVec = Math.sqrt((VecX*VecX+VecY*VecY));
    VecX = VecX/lengthVec;
    VecY = VecY/lengthVec;
}

/**
 *   shuffles Array
 **/
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

/**
 *   initStart
 *   appends .atom elements into .start
 *   calculates margin between atoms
 *   fade in effects
 **/
function initStart(){
    var $start = jQuery('.start');
    var atomArray = [];
    var arrayLength;

    // create atoms and fill atomArray
    for(var i = 0; i < 83; i++) {
        var atom = document.createElement("div");
        var atomStyle = 'background-position: ' + i*-45 + 'px 0; opacity: 0';
        atom.setAttribute('class', 'atom');
        atom.setAttribute('style', atomStyle);

        atomArray.push(atom);
    }

    // shuffle Array
    arrayLength = atomArray.length;
    var shuffledArray = shuffle(atomArray);

    // add randomized atoms with anima[i] class
    for(var i = 0; i < arrayLength; i++) {
        var randDuration = Math.floor((Math.random() * 8) + 5);
        var randDelay = Math.floor((Math.random() * 10) + 0);

        var cssArray = { animation: "floating " + randDuration + "s linear -"+ randDelay +"s infinite",
               "-webkit-animation": "floating " + randDuration + "s linear -"+ randDelay +"s infinite" };
        jQuery(shuffledArray[i]).css(cssArray).appendTo($start);
    }

    // fade in elements
    $atom = jQuery('.atom');
    $atom.delay(1000).animate({opacity: 1 }, 500);
    $overlay.delay(1500).animate({ opacity: 1}, 500);
    jQuery('img.logo').delay(1500).animate({
        top: "40%"
        }, 500, function(){
            jQuery('span.button').delay(200).animate({
                opacity: 1
            }, 300);
    });


    // set margin to fit area size
    var area = $start.height()*1200;
    var areaAtoms = 45*45*arrayLength;

    var diff = (area-areaAtoms)/arrayLength;
    var atomMargin = Math.sqrt(diff)/3.5;

    $atom.css('margin',atomMargin);

}

/**
 *   pageTransition
 *   fly out effects for .atom elements and redirect to #/menu
**/
function pageTransition(){
    // Problem: css animationen nicht stapelbar (Plugin: http://labs.bigroomstudios.com/libraries/animo-js )
    // animation: none --> elemets jump back to start

    var atomOffset;
    var $wrapper = jQuery('.wrapper');
    var wrapperWidth = ($wrapper.width()/2) + $wrapper.offset().left; // calculate center of wrapper pane
    var wrapperHeight= $wrapper.height()/2;

    $overlay.animate({ opacity: 0}, 500);
    jQuery('img.logo, span.button').animate({
        height: ($(this).height()*0),
        width: ($(this).width()*0),
        "font-size": 0,
        opacity: 0
    }, 500, function(){
        $atom.each(function(){
            atomOffset = jQuery(this).offset();

            // calculate vector
            VecX = wrapperWidth - atomOffset.left;
            VecY = wrapperHeight - atomOffset.top;

            normalizeVector();

            jQuery(this).animate({
                position: "relative",
                top:   1000*-VecY,
                left:  1000*-VecX
                }, 1000, function(){
                window.location = '#/menu';
            });
     });

    });

}

/*---  function calls ---*/
initStart();

jQuery('a').on("click", function( event ) {
    event.preventDefault();
    clickSound.play();
    pageTransition();
});

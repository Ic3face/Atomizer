/*
* shuffle Array
 */
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

/*
* adds elements to start
*/
function initStart(){
    var $start = jQuery('.start');
    var atomArray = [];
    var arrayLength;

    // create atoms and fill atomArray
        for(var i = 0; i < 20; i++) { // vom Dudemeister!!
        var atom = document.createElement("div");
        var atomStyle = 'background-position: ' + i*-45 + 'px 0;';
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

    // set margin to fit area
    var area = $start.height()*1200;
    var areaAtoms = 45*45*arrayLength;

    var diff = (area-areaAtoms)/arrayLength;
    var atomMargin = Math.sqrt(diff)/2.8;

    jQuery('.atom').css('margin',atomMargin);

    

}


initStart();
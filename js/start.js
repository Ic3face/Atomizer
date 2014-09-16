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
    var atomArray = [];
    var $start = jQuery('.start');

    // fill atomArray with atoms
        for(var i = 0; i < 20; i++) { // vom Dudemeister!!
        var atom = document.createElement("div");
        var atomStyle = 'background-position: ' + i*-45 + 'px 0;';
        atom.setAttribute('class', 'atom');
        atom.setAttribute('style', atomStyle);

        atomArray.push(atom);
    }

    var shuffledArray = shuffle(atomArray);

    // add atoms in random Order
    for(var i = 0; i < shuffledArray.length; i++) {
        // absolut positionieren
        $start.append(shuffledArray[i]);
    }


    // spread evenly over screen max -width: 1200px

    

}


initStart();
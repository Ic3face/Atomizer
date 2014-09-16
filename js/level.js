var links = new Array();
var linkId = 0;
var firstAtom = '';
var secondAtom = '';
var winLinks = new Array();
var winAtoms = new Array();


function initPlayground() {
    var x = 34;
    var y = 15;
    var odd = true;
    var lineCounter = 0;
    for(var i = 1; i < 36; i++) {
        lineCounter++;
        var tile = document.createElement("div");
        var tileStyle = 'top:'+y+'px;left:'+x+'px;';
        var tileId = 'tile-'+i;
        tile.setAttribute('class', 'tile');
        tile.setAttribute('id', tileId);
        tile.setAttribute('style', tileStyle);
        tile.setAttribute('onclick', 'setElement(event)');
        jQuery('#playground').append(tile);

        if(lineCounter%4 == 0 && odd) {
            x = 144;
            y = y+ 65;
            lineCounter = 0;
            odd = false;
        }else if(lineCounter%3 == 0 && odd == false) {
            x = 34;
            y = y+ 65;
            lineCounter = 0;
            odd = true;
        }else {
            x = x + 220;
        }

    }
}

jQuery(document).bind('mousemove', function(e) {
    jQuery('#mousefollower').css({
        left: e.pageX+5,
        top: e.pageY+5
    });
});

function getElement(sign,free,color) {

    var newElement = '<div sign="'+sign+'" class="atom">';

    newElement += '<div style="background:#'+color+'" class="atomshape" onclick="initAtomMenu(event)">'+sign+'</div>';
    for(var i = 1; i <= free; i++) {
        newElement += '<div class="electron nr-'+i+' count-'+free+' free" onclick="buildLink(event)"></div>';
    }
    newElement += '</div>';
    jQuery('#mousefollower').html(newElement);
}

function setElement(e, element) {
    var atom = jQuery('#mousefollower').html();
    if(atom && jQuery(e.target).hasClass('tile')) {
        jQuery(e.target).html(atom);
        jQuery('#mousefollower').html('');
    }
}

function initAtomMenu(e) {
    jQuery('.atom .menu').remove();
    if(firstAtom == '') {
        var menu = '<ul class="menu"><li class="close" onclick="closeAtomMenu(event)" >X</li>';
        if(jQuery(e.target).parent().children('.free').length > 0) {
            menu += '<li onclick="initLink(event)">Verbindung von hier</li>';
        }
        menu += '<li onclick="deleteAtom(event)">Atom löschen</li>';
        menu += '</ul>';
        jQuery(e.target).parent().append(menu);
    }else {
        secondAtom = jQuery(e.target).parent();
        buildLink();

    }

}

function closeAtomMenu(e){
    jQuery(e.target).parent().remove();
}

function deleteAtom(e) {
    var effectedAtoms = new Array();
    var tile = jQuery(e.target).parent().parent().parent();
    var linkSelector;
    tile.html('');
    tile.removeClass('active');

    for(var i = 0; i < links.length; i++) {
        if(links[i][1] == tile.attr('id')) {
            linkSelector = '.link[linkId="'+links[i][3]+'"]';
            jQuery(linkSelector).remove();
            effectedAtoms.push(links[i][2]);
            links[i] = ['x','x','x','x'];
        } else if(links[i][2] == tile.attr('id')) {
            linkSelector = '.link[linkId="'+links[i][3]+'"]';
            jQuery(linkSelector).remove();
            effectedAtoms.push(links[i][1]);
            links[i] = ['x','x','x','x'];
        }
    }
    for(var j = 0; j < effectedAtoms.length; j++) {
        var effectedTile = jQuery('#'+effectedAtoms[j]);
        effectedTile.children('.atom').children('.used').first().removeClass('used').addClass('free');
        if(effectedTile.children('.atom').children('.used').length == 0) {
            effectedTile.removeClass('active');
        }

    }
    checkWin();
}

function initLink(e) {
    firstAtom = jQuery(e.target).parent().parent();
    jQuery(e.target).parent().parent().children('.free').first().removeClass('free').addClass('waiting');
    jQuery(e.target).parent('.menu').remove();
}

function buildLink() {
    var x1, x2, y1, y2;
    var linkChecker = 1;
    var firstTile = jQuery(firstAtom).parent();
    var secondTile = jQuery(secondAtom).parent();
    var firstLeft = firstTile.position().left;
    var firstTop = firstTile.position().top;
    var secondLeft = secondTile.position().left;
    var secondTop = secondTile.position().top;
    var distance = Math.sqrt((firstLeft-secondLeft)*(firstLeft-secondLeft)+(firstTop-secondTop)*(firstTop-secondTop));

    //Abfangen wenn eine Verbindung mit sich selbst gemacht werden soll
    if(firstTile.attr('id') == secondTile.attr('id')) {
        cancelLink("Verbinung mit sich selber derzeit nicht möglich");
        return;
    }

    //Abfangen wenn das 2. Atom keine Freien Elektronen mehr hat
    if(secondAtom.children('.free').length == 0) {
        cancelLink("Das Ziel Atom hat keine freien Elektronen mehr");
        return;
    }

    //Abfangen wenn die Atome zu weit auseinander liegen
    if(distance > 150) {
        cancelLink("Diese Atome sind zuweit voneinander entfernt");
        return;
    }

    //Check ob es schon eine Bindung zwischen den Atomen gibt
    for(var i = 0; i < links.length; i++) {
        if((links[i][1] == firstTile.attr('id') || links[i][2] == firstTile.attr('id')) && (links[i][1] == secondTile.attr('id') || links[i][2] == secondTile.attr('id'))) {
            linkChecker++;
        }
    }

    //Wenn schon mehr 2 Verbindungen bestehen brich ab
    if(linkChecker > 2) {
        cancelLink("Es sind schon 2 atomverbindungen zwischen den Atomen vorhanden");
        return;
    }

    if(linkChecker == 2) {
        buildDoppelLink();
        return;
    }

    //Setze die Tiles auf aktiv
    firstTile.addClass('active');
    secondTile.addClass('active');

    //Entferne Zwei Freie Elektronen
    jQuery(firstAtom).children('.waiting').removeClass('waiting').addClass('used');
    jQuery(secondAtom).children('.free').first().removeClass('free').addClass('used');

    //Position der Tiles zueinander bestimmen und dementsprechend die Werte für die Bindung bauen
    if(firstLeft > secondLeft && firstTop > secondTop ) {
        x1 = firstLeft+11;
        y1 = firstTop+19;
        x2 = secondLeft+87;
        y2 = secondTop+63;
    } else if(firstLeft == secondLeft && firstTop > secondTop) {
        x1 = firstLeft+47;
        y1 = firstTop-3;
        x2 = secondLeft+47;
        y2 = secondTop+87;
    } else if(firstLeft < secondLeft && firstTop > secondTop) {
        x1 = firstLeft+86;
        y1 = firstTop+20;
        x2 = secondLeft+11;
        y2 = secondTop+64;
    } else if(firstLeft < secondLeft && firstTop < secondTop) {
        x1 = firstLeft+87;
        y1 = firstTop+63;
        x2 = secondLeft+11;
        y2 = secondTop+19;
    } else if(firstLeft == secondLeft && firstTop < secondTop) {
        x1 = firstLeft+47;
        y1 = firstTop+87;
        x2 = secondLeft+47;
        y2 = secondTop-3;
    } else if(firstLeft > secondLeft && firstTop < secondTop) {
        x1 = firstLeft+11;
        y1 = firstTop+64;
        x2 = secondLeft+86;
        y2 = secondTop+20;
    }

    //Die neue Verbindung Zeichnen
    drawLink(x1,y1,x2,y2);

    //Verbindung in das Verbindungsarray Eintragen

    links.push([
        firstAtom.attr('sign')+secondAtom.attr('sign'),
        firstTile.attr('id'),
        secondTile.attr('id'),
        linkId
    ]);
    linkId++;
    checkWin();
    //Die Atome zurücksetzen
    firstAtom = '';
    secondAtom = '';
}

function buildDoppelLink() {
    var firstTile = jQuery(firstAtom).parent();
    var secondTile = jQuery(secondAtom).parent();
    var firstLeft = firstTile.position().left;
    var firstTop = firstTile.position().top;
    var secondLeft = secondTile.position().left;
    var secondTop = secondTile.position().top;

    //Hole die 1. Verbindung
    for(var i = 0; i < links.length; i++) {
        if((links[i][1] == firstTile.attr('id') || links[i][2] == firstTile.attr('id')) && (links[i][1] == secondTile.attr('id') || links[i][2] == secondTile.attr('id'))) {
            var linkSelector = '.link[linkId="'+links[i][3]+'"]';
            var firstLink = jQuery(linkSelector);
        }
    }

    //Entferne Zwei Freie Elektronen
    jQuery(firstAtom).children('.waiting').removeClass('waiting').addClass('used');
    jQuery(secondAtom).children('.free').first().removeClass('free').addClass('used');

    //Position der Tiles zueinander bestimmen und dementsprechend die Werte für die Bindung bauen
    if(firstLeft > secondLeft && firstTop > secondTop ) {
        firstLink.css('left', '+=11px');
        firstLink.css('top', '-=20px');
        x1 = firstLeft-2;
        y1 = firstTop+40;
        x2 = secondLeft+74;
        y2 = secondTop+84;
    } else if(firstLeft == secondLeft && firstTop > secondTop) {
        firstLink.css('left', '-=22px');
        x1 = firstLeft+71;
        y1 = firstTop-3;
        x2 = secondLeft+71;
        y2 = secondTop+87;
    } else if(firstLeft < secondLeft && firstTop > secondTop) {
        firstLink.css('left', '-=11px');
        firstLink.css('top', '-=21px');
        x1 = firstLeft+97;
        y1 = firstTop+40;
        x2 = secondLeft+22;
        y2 = secondTop+84;
    } else if(firstLeft < secondLeft && firstTop < secondTop) {
        firstLink.css('left', '-=12px');
        firstLink.css('top', '+=21px');
        x1 = firstLeft+97;
        y1 = firstTop+42;
        x2 = secondLeft+21;
        y2 = secondTop-2;
    } else if(firstLeft == secondLeft && firstTop < secondTop) {
        firstLink.css('left', '-=22px');
        x1 = firstLeft+71;
        y1 = firstTop+87;
        x2 = secondLeft+71;
        y2 = secondTop-3;
    } else if(firstLeft > secondLeft && firstTop < secondTop) {
        firstLink.css('left', '+=11px');
        firstLink.css('top', '+=19px');
        x1 = firstLeft;
        y1 = firstTop+42;
        x2 = secondLeft+75;
        y2 = secondTop-2;
    }

    //Die neue Verbindung Zeichnen
    drawLink(x1,y1,x2,y2);

    links.push([
        firstAtom.attr('sign')+secondAtom.attr('sign'),
        firstTile.attr('id'),
        secondTile.attr('id'),
        linkId
    ]);
    linkId++;
    checkWin();
    //Die Atome zurücksetzen
    firstAtom = '';
    secondAtom = '';

}

function cancelLink(error) {
    alert(error);
    jQuery('.atom .electron.waiting').removeClass('waiting').addClass('free');
    firstAtom = '';
    secondAtom = '';
}

function drawLink(x1, y1, x2, y2){

    if(y1 < y2){
        var pom = y1;
        y1 = y2;
        y2 = pom;
        pom = x1;
        x1 = x2;
        x2 = pom;
    }

    var a = Math.abs(x1-x2);
    var b = Math.abs(y1-y2);
    var c;
    var sx = (x1+x2)/2 ;
    var sy = (y1+y2)/2 ;
    var width = Math.sqrt(a*a + b*b ) ;
    var x = sx - width/2;
    var y = sy;

    a = width / 2;

    c = Math.abs(sx-x);

    b = Math.sqrt(Math.abs(x1-x)*Math.abs(x1-x)+Math.abs(y1-y)*Math.abs(y1-y) );

    var cosb = (b*b - a*a - c*c) / (2*a*c);
    var rad = Math.acos(cosb);
    var deg = (rad*180)/Math.PI

    div = document.createElement("div");
    div.setAttribute('style','width:'+width+'px;-moz-transform:rotate('+deg+'deg);-webkit-transform:rotate('+deg+'deg);top:'+y+'px;left:'+x+'px;');
    div.setAttribute('class','link');
    div.setAttribute('onclick','deleteLine(event)');
    div.setAttribute('linkId', linkId);

    document.getElementById("playground").appendChild(div);
}

function setWin(winstat) {
    winAtoms = winstat.atoms;
    winLinks = winstat.links;
}

function checkWin() {
    var currentAtoms = new Array();
    var currentLinks = new Array();
    var tempWinLinks = winLinks;

    jQuery('#playground .atom').each(function() {
       currentAtoms.push(jQuery(this).attr('sign'));
    });
    if(winAtoms.sort().toString() == currentAtoms.sort().toString()) {
        for(var i=0; i < links.length; i++){
            if(links[i].toString() != 'x,x,x,x'){
                currentLinks.push([
                    jQuery('#'+links[i][1]).children('.atom').attr('sign'),
                    jQuery('#'+links[i][2]).children('.atom').attr('sign')
                ]);
            }
        }
        if(currentLinks.length == tempWinLinks.length) {
            for(var j=0; j < currentLinks.length; j++) {
                currentLinks[j] = currentLinks[j].sort();
                tempWinLinks[j] = tempWinLinks[j].sort();
            }
            if(currentLinks.toString() == winLinks.toString()) {
                setTimeout(function() {
                    window.location = 'http://atomizer.reiche-online.com/#/win';
                },800);

            }
        }

    }
}

initPlayground();
/*  atomizer main
 *  angular routing, controller
 * */

var atomizerApp = angular.module('atomizerApp', ['ngRoute']);

atomizerApp.config(['$routeProvider', function(routeProvider) {
    routeProvider.
    when('/', {
        templateUrl: 'views/start.html',
        controller: 'StartCtrl'
    }).
    when('/menu', {
        templateUrl: 'views/menu.html',
        controller: 'MenuCtrl'
    }).
    when('/level', {
        templateUrl: 'views/level.html',
        controller: 'LevelCtrl'
    }).
    when('/win', {
        templateUrl: 'views/win.html',
        controller: 'WinCtrl'
    }).
    otherwise({
        redirectTo: '/menu'
    });
}]);

atomizerApp.controller('StartCtrl', ['$scope', function(scope) {
    jQuery('.start').append('<link rel="stylesheet" href="css/start.css" />');
    jQuery('.start').append('<script src="js/start.js"></script>');
}]);

atomizerApp.controller('MenuCtrl', ['$scope','$http', function(scope, http) {
    var $menu = jQuery('.menu');
    $menu.append('<link rel="stylesheet" href="css/menu.css" />');

    var levelCounter = 1;
    scope.level = new Array();


    ( function levelCall(){ // freakin' self executing function
        http({
            url: 'resources/level/level'+levelCounter+'.json',
            method: 'GET'
        }).success(function(data){
            scope.level[levelCounter-1] = [];
            scope.level[levelCounter-1].push(data.name); //array[0][0] = LevelName

            taskCall(levelCounter, 1);

            levelCounter++;
            levelCall(); // freakin' rekursion 'cause while+ajax is a hell
        });
    })();

    function taskCall(level, taskCounter){
        http({
            url: 'resources/level/'+level+'/task'+taskCounter+'.json',
            method: 'GET'
        }).success(function(data){
            scope.level[level-1].push(data.name); //array[0][>0] = TaskName
            console.log(scope.level[level-1]);

            taskCounter++;
            taskCall(level, taskCounter); // freakin' rekursion 'cause while+ajax is a hell
        });
    }

    $menu.append('<script src="js/menu.js"></script>');
}]);

atomizerApp.controller('LevelCtrl', ['$scope', '$routeParams', '$http', function(scope, routeParams, http) {
    scope.atoms = new Array();
    scope.levelnr = routeParams.level;
    scope.tasknr = routeParams.task;
    jQuery('.level').append('<link rel="stylesheet" href="css/level.css" />');
    jQuery('.level').append('<script src="js/level.js"></script>');
    http({
        url: 'resources/level/'+scope.levelnr+'/task'+scope.tasknr+'.json',
        method: 'GET'
    }).success(function(data){
        scope.task = data;
        scope.tempAtoms = scope.task.atoms;
        setWin(scope.task.winstate);
        for(var i=0; i < scope.tempAtoms.length; i++){
            http({
                url: 'resources/atoms/'+scope.tempAtoms[i]+'.json',
                method: 'GET'
            }).success(function(data) {
                scope.atoms.push(data);
            });
        }
    });

    scope.getElement = function(sign,free,color) {
        getElement(sign,free,color);
    }

    scope.win = function () {
        console.log("test");
    }

}]);

atomizerApp.controller('WinCtrl', ['$scope', '$routeParams', '$http', function(scope, routeParams, http) {
    scope.atoms = new Array();
    scope.levelnr = routeParams.level;
    scope.tasknr = routeParams.task;
    jQuery('.win').append('<link rel="stylesheet" href="css/win.css" />');
    jQuery('.win').append('<script src="js/win.js"></script>');
    http({
        url: 'resources/level/'+scope.levelnr+'/task'+scope.tasknr+'.json',
        method: 'GET'
    }).success(function(data){
        scope.task = data;
        scope.tempAtoms = scope.task.atoms;
        var j = 0;
        for(var i=0; i < scope.tempAtoms.length; i++){
            http({
                url: 'resources/atoms/'+scope.tempAtoms[i]+'.json',
                method: 'GET'
            }).success(function(data) {
                scope.atoms.push(data);
                j++;
                if(i == j) {
                    initThreeJs(scope.task,scope.atoms);
                }
            });
        }

    });

}]);
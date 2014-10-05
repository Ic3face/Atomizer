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
    // TODO level.done ermitteln!
    var $menu = jQuery('.menu');
    $menu.append('<link rel="stylesheet" href="css/menu.css" />');
    $menu.append('<script src="js/menu.js"></script>');

    var levelCounter = 1;
    scope.levels =[];


    ( function levelCall(){ // freakin' self executing function
        http({
            url: 'resources/level/level'+levelCounter+'.json',
            method: 'GET'
        }).success(function(data){
            scope.levels[levelCounter-1] ={name: data.name }; //array[0][0] = LevelName
            console.log("level name: " + scope.levels[levelCounter-1].name);
            taskCall(levelCounter, 1);

            levelCounter++;
            levelCall(); // freakin' rekursion 'cause while+ajax is a hell
        });
    })();

    function taskCall(level, taskCounter){
        if(scope.levels[level-1].tasks === undefined){
            scope.levels[level-1].tasks = [];
        }
        http({
            url: 'resources/level/'+level+'/task'+taskCounter+'.json',
            method: 'GET'
        }).success(function(data){
            console.log("task name: " + data.name);

            scope.levels[level-1].tasks.push(data.name); //array[0][>0] = TaskName
               console.log("Levels: " +  scope.levels);

            taskCounter++;
            taskCall(level, taskCounter); // freakin' rekursion 'cause while+ajax is a hell
        });
    }


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
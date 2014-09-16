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
        redirectTo: '/'
    });
}]);

atomizerApp.controller('StartCtrl', ['$scope', function(scope) {
    jQuery('.start').append('<link rel="stylesheet" href="css/start.css" />');
    jQuery('.start').append('<script src="js/start.js"></script>');
}]);

atomizerApp.controller('MenuCtrl', ['$scope', function(scope) {

}]);

atomizerApp.controller('LevelCtrl', ['$scope', '$routeParams', '$http', function(scope, routeParams, http) {
    scope.atoms = new Array();
    jQuery('.level').append('<link rel="stylesheet" href="css/level.css" />');
    jQuery('.level').append('<script src="js/level.js"></script>');
    http({
        url: 'resources/level/'+routeParams.level+'/task'+routeParams.task+'.json',
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

}]);

atomizerApp.controller('WinCtrl', ['$scope', function(scope) {

}]);
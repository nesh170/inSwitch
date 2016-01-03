/**
 * Created by Sivaneshwaran Loganathan on 1/2/2016.
 */
app = angular.module('inSwitchApp', ['ngMaterial']);
app.controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function () {
        return $mdSidenav('right').isOpen();
    };
    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
        var timer;
        return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function () {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
        return debounce(function () {
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                    $log.debug("toggle " + navID + " is done");
                });
        }, 200);
    }

    function buildToggler(navID) {
        return function () {
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                    $log.debug("toggle " + navID + " is done");
                });
        }
    }
})
app.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
        $mdSidenav('left').close()
            .then(function () {
                $log.debug("close LEFT is done");
            });
    };
});

app.controller('ListCtrl', function ($scope,$log,$rootScope) {
    $scope.switches = getListOfSwitches();

    $scope.toggleSwitch = function(changedSwitch){
        stateOfSwitch = changedSwitch.enabled;
        if(stateOfSwitch){
            $log.log('Switch Is On')
        }
        else{
            $log.log('Switch Is Off')
        }
    };

    $scope.navigateTo = function(id){
        $rootScope.currentSwitchID=id;
        $log.log($rootScope.currentSwitchID)
    };

    function getListOfSwitches(){
        listOfSwitch = [{name: 'Switch 1', id: '0001', enabled: true},
            {name: 'Switch 2', id: '4111', enabled: false}];
        return listOfSwitch;
    }

});
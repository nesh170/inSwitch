/**
 * Created by Sivaneshwaran Loganathan on 1/2/2016.
 */
app = angular.module('inSwitchApp', ['ngMaterial']);
app.controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log, $rootScope) {
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

    $scope.showSwitchInfo = false;
    //$rootScope.currentSwitchID=null;
    $rootScope.$watch('currentSwitchID', function (newValue, oldValue) {
        if (newValue != undefined) {
            $scope.showSwitchInfo = true;
        }
        $scope.currentSwitch = getSwitch(newValue);
    });

    function getSwitch(id) {
        //do a http get method here to get the current switch from the SQL table
        switchInfo = {
            name: 'Developer',
            id: id,
            state: 'ON',
            location: '3rd Switch in the Hall',
            notes: 'Loves kittens, snowboarding, and can type at 130 WPM.\n\nAnd rumor has it she bouldered up Castle Craig!',
            timestamp: id
        };
        return switchInfo;
    }


    $scope.states = ('ON OFF').split(' ').map(function (state) {
        return {abbrev: state};
    })


}).config(function ($mdThemingProvider) {
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('yellow')
        .dark();
});

app.controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
        $mdSidenav('left').close()
            .then(function () {
                $log.debug("close LEFT is done");
            });
    };
});




app.controller('ListCtrl', function ($scope, $log, $rootScope) {
    $scope.switches = getListOfSwitches();

    $scope.navigateTo = function (id) {
        $rootScope.currentSwitchID = id;
    };

    function getListOfSwitches() {
        //do a http get method here to get the list of switches from the server
        listOfSwitch = [{name: 'Switch 1', id: '0001', enabled: true},
            {name: 'Switch 2', id: '4111', enabled: false}];
        return listOfSwitch;
    }

});
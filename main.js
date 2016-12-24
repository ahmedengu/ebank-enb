var app = angular.module("ENBApp", ["ngRoute", 'ngSanitize']);

app.config(function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: 'views/indexContent.html',
        controller: 'indexCtrl'
    }).when("/accounts", {
        templateUrl: "views/accounts.html",
        controller: "accountsCtrl"
    }).when("/loans", {
        templateUrl: "views/loans.html",
        controller: "loansCtrl"
    }).when("/payments", {
        templateUrl: "views/payments.html",
        controller: "paymentsCtrl"
    }).when("/profile", {
        templateUrl: "views/profile.html",
        controller: "profileCtrl"
    }).when("/services", {
        templateUrl: "views/services.html",
        controller: "servicesCtrl"
    }).when("/transfers", {
        templateUrl: "views/transfers.html",
        controller: "transfersCtrl"
    }).when("/signup", {
        templateUrl: "views/signup.html",
        controller: "signupCtrl"
    }).when("/login", {
        templateUrl: "views/login.html",
        controller: "loginCtrl"
    }).otherwise({
        templateUrl: "views/404.html"
    });
});
app.run(function ($rootScope, $location) {
    Parse.initialize("Fb58iNlAeATKExIradyAJWVSBoL3mLRMQj4ub5Ld", "h1GnoGSjBenm2BQ2MtxYa4ZKROrA2CcCVhooFWW7");
    Parse.serverURL = 'https://parseapi.back4app.com';
    $rootScope.currentUser = Parse.User.current();
    $rootScope.logout = function () {
        showSpinner();
        Parse.User.logOut().then(function () {
            location.href = ".#/";
            location.reload();
        });
    };
});

app.controller('indexCtrl', function ($scope, $location, $rootScope, $routeParams) {
    if (!$rootScope.currentUser)
        $location.path('/login');
    hideSpinner();
});
app.controller('accountsCtrl', function ($scope, $location, $rootScope, $routeParams) {
    hideSpinner();
});
app.controller('loansCtrl', function ($scope, $location, $rootScope, $routeParams) {
    hideSpinner();
});
app.controller('paymentsCtrl', function ($scope, $location, $rootScope, $routeParams) {
    hideSpinner();
});
app.controller('profileCtrl', function ($scope, $location, $rootScope, $routeParams) {
    hideSpinner();
});
app.controller('servicesCtrl', function ($scope, $location, $rootScope, $routeParams) {
    hideSpinner();
});
app.controller('transfersCtrl', function ($scope, $location, $rootScope, $routeParams) {
    hideSpinner();
});

app.controller('loginCtrl', function ($scope, $location, $rootScope, $routeParams) {
    if ($rootScope.currentUser)
        $location.path('/');
    hideSpinner();

    $scope.login = function () {
        if (!$scope.username || !$scope.password) {
            alert("Username/Password are required!");
            return;
        }
        showSpinner();
        Parse.User.logIn($scope.username, $scope.password, {
            success: function (user) {
                location.reload();
            },
            error: function (user, error) {
                hideSpinner();
                alert("Error: " + error.code + " " + error.message);
            }
        });
    };
});

app.controller('signupCtrl', function ($scope, $location, $rootScope, $routeParams) {
    if ($rootScope.currentUser)
        $location.path('/');
    hideSpinner();

    $scope.signup = function () {
        if (!$scope.username || !$scope.password || !$scope.email) {
            alert("Username/Password/Email are required!");
            return;
        }
        var user = new Parse.User();
        user.set("username", $scope.username);
        user.set("password", $scope.password);
        user.set("email", $scope.email);
        showSpinner();
        user.signUp(null, {
            success: function (user) {
                location.reload();
            },
            error: function (user, error) {
                hideSpinner();
                alert("Error: " + error.code + " " + error.message);
            }
        });
    };
});

function hideSpinner() {
    $('#divLoading').fadeOut(250, function () {
        $('#divLoading').removeClass('show');
    });
}
function showSpinner() {
    $('#divLoading').fadeIn(250, function () {
        $('#divLoading').addClass('show');
    });
}
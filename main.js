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
    }).when("/editProfile", {
        templateUrl: "views/editProfile.html",
        controller: "editProfileCtrl"
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
    $rootScope.title = 'ENB';
    $rootScope.currentUser = Parse.User.current();
    $rootScope.logout = function () {
        showSpinner();
        Parse.User.logOut().then(function () {
            location.href = ".#!/";
            location.reload();
        });
    };

    $rootScope.$on('$locationChangeStart', function (event) {
        showSpinner();
        $("html, body").stop().animate({scrollTop: 0}, '100', 'swing');
    });
});

app.controller('indexCtrl', function ($scope, $location, $rootScope, $routeParams) {
    $rootScope.title = 'ENB';
    if (!$rootScope.currentUser)
        $location.path('/login');
    hideSpinner();
});
app.controller('accountsCtrl', function ($scope, $location, $rootScope, $routeParams) {
    $rootScope.title = 'accounts';

    hideSpinner();
});
app.controller('loansCtrl', function ($scope, $location, $rootScope, $routeParams) {
    $rootScope.title = 'loans';

    hideSpinner();
});
app.controller('paymentsCtrl', function ($scope, $location, $rootScope, $routeParams) {
    $rootScope.title = 'payments';

    hideSpinner();
});
app.controller('profileCtrl', function ($scope, $location, $rootScope, $routeParams) {
    $rootScope.title = 'profile';
    if (!$rootScope.currentUser)
        $location.path('/');

    var query = new Parse.Query(Parse.User);
    query.include('accountType');
    query.get($rootScope.currentUser.id, {
        success: function (user) {
            $scope.accountType = user.get('accountType');
            $scope.$apply();
            hideSpinner();
        },
        error: function (user, error) {
            hideSpinner();
            alert("Error: " + error.code + " " + error.message);
        }
    });
});
app.controller('editProfileCtrl', function ($scope, $location, $rootScope, $routeParams) {
    $rootScope.title = 'Edit Profile';
    if (!$rootScope.currentUser)
        $location.path('/');

    var AccountTypes = Parse.Object.extend("AccountTypes");
    var query = new Parse.Query(AccountTypes);
    query.find({
        success: function (results) {
            $scope.accounts = angular.copy(results);
            var user = $rootScope.currentUser;
            $scope.username = user.get('username');
            $scope.fullname = user.get('name');
            $scope.address = user.get('address');
            $scope.email = user.get('email');
            $scope.accountType = $scope.accounts.indexOf($scope.accounts.find(function (e) {
                return e.id == user.get('accountType').id;
            }));
            $scope.$apply();
            hideSpinner();
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
            hideSpinner();
        }
    });

    $scope.save = function () {
        var user = $rootScope.currentUser;
        if ($scope.username != user.get('username'))
            user.set("username", $scope.username);
        if ($scope.password)
            user.set("password", $scope.password);
        if ($scope.email != user.get('email'))
            user.set("email", $scope.email);
        if ($scope.fullname != user.get('name'))
            user.set('name', $scope.fullname);
        if ($scope.address != user.get('address'))
            user.set('address', $scope.address);
        if ($scope.accounts[$scope.accountType].id != user.get('accountType').id)
            user.set('accountType', $scope.accounts[$scope.accountType]);

        var fileUploadControl = $("#pic")[0];
        if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var name = "photo.jpg";

            var parseFile = new Parse.File(name, file);
            user.set('pic', parseFile);
        }
        showSpinner();
        user.save({
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

app.controller('servicesCtrl', function ($scope, $location, $rootScope, $routeParams) {
    $rootScope.title = 'services';

    hideSpinner();
});
app.controller('transfersCtrl', function ($scope, $location, $rootScope, $routeParams) {
    $rootScope.title = 'transfers';

    hideSpinner();
});

app.controller('loginCtrl', function ($scope, $location, $rootScope, $routeParams) {
    $rootScope.title = 'login';

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
    $rootScope.title = 'signup';

    if ($rootScope.currentUser)
        $location.path('/');
    var AccountTypes = Parse.Object.extend("AccountTypes");
    var query = new Parse.Query(AccountTypes);
    query.find({
        success: function (results) {
            $scope.accounts = angular.copy(results);
            $scope.accountType = 0;
            $scope.$apply();
            hideSpinner();
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
            hideSpinner();
        }
    });

    $scope.signup = function () {
        if (!$scope.username || !$scope.password || !$scope.email) {
            alert("Username/Password/Email are required!");
            return;
        }
        var user = new Parse.User();
        user.set("username", $scope.username);
        user.set("password", $scope.password);
        user.set("email", $scope.email);
        user.set('name', $scope.fullname);
        user.set('address', $scope.address);
        user.set('accountType', $scope.accounts[$scope.accountType]);

        var fileUploadControl = $("#pic")[0];
        if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var name = "photo.jpg";

            var parseFile = new Parse.File(name, file);
            user.set('pic', parseFile);
        }
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
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
    }).when("/profile/:id", {
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
    }).when("/newTransfer", {
        templateUrl: "views/newTransfer.html",
        controller: "newTransferCtrl"
    }).when("/signup", {
        templateUrl: "views/signup.html",
        controller: "signupCtrl"
    }).when("/login", {
        templateUrl: "views/login.html",
        controller: "loginCtrl"
    }).otherwise({
        templateUrl: "views/404.html",
        controller: "notFoundCtrl"
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
function currentUser() {
    return Parse.User.current();
}
app.controller('indexCtrl', function ($scope, $location, $rootScope, $routeParams) {
    $rootScope.title = 'ENB';
    if (!currentUser())
        $location.path('/login');
    hideSpinner();
});
app.controller('accountsCtrl', function ($scope, $location, $rootScope, $routeParams) {
    $rootScope.title = 'accounts';

    var query = new Parse.Query(Parse.User);
    query.equalTo("parent", currentUser());
    query.find({
        success: function (results) {
            $scope.results = angular.copy(results);
            console.log(results);
            $scope.$apply();
            hideSpinner();
        },
        error: function (results, error) {
            hideSpinner();
            alert("Error: " + error.code + " " + error.message);
        }
    });
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
    if (!currentUser())
        $location.path('/');

    var query = new Parse.Query(Parse.User);
    query.include('accountType');
    query.get(($routeParams.id) ? $routeParams.id : (currentUser()) ? currentUser().id : null, {
        success: function (result) {
            $scope.result = result;
            $scope.accountType = result.get('accountType');
            $scope.$apply();
            hideSpinner();
        },
        error: function (result, error) {
            hideSpinner();
            alert("Error: " + error.code + " " + error.message);
        }
    });
});

app.controller('editProfileCtrl', function ($scope, $location, $rootScope, $routeParams) {
    $rootScope.title = 'Edit Profile';
    if (!currentUser())
        $location.path('/');

    var AccountTypes = Parse.Object.extend("AccountTypes");
    var query = new Parse.Query(AccountTypes);
    query.find({
        success: function (results) {
            $scope.accounts = angular.copy(results);
            var user = currentUser();
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
        var user = currentUser();
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

    $scope.showReason = function (index) {
        alert($scope.results[index].get('reason'))
    };

    var fromQuery = new Parse.Query("Transfers");
    fromQuery.equalTo("from", currentUser());

    var toQuery = new Parse.Query("Transfers");
    toQuery.equalTo("to", currentUser());

    var query = Parse.Query.or(fromQuery, toQuery);
    query.include('from');
    query.include('to');
    query.descending('createdAt');
    query.find({
        success: function (results) {
            $scope.results = angular.copy(results);
            $scope.$apply();
            hideSpinner();
        },
        error: function (error) {
            alert("Error: " + error.code + " " + error.message);
            hideSpinner();
        }
    });
});

app.controller('newTransferCtrl', function ($scope, $location, $rootScope, $routeParams) {
    $rootScope.title = 'New Transfer';

    hideSpinner();

    $scope.send = function () {
        showSpinner();
        var query = new Parse.Query(Parse.User);
        query.equalTo("username", $scope.to);
        query.find({
            success: function (results) {
                if (results.length == 0) {
                    alert("To Not Found");
                    hideSpinner();
                    return;
                }

                var Transfers = Parse.Object.extend("Transfers");
                var transfer = new Transfers();
                transfer.set('from', currentUser());
                transfer.set('to', results[0]);
                transfer.set('amount', $scope.amount);
                transfer.set('reason', $scope.reason);
                transfer.save({
                    success: function (result) {
                        hideSpinner();
                        $location.path('/transfers');
                        $scope.$apply();
                    },
                    error: function (result, error) {
                        hideSpinner();
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            },
            error: function (result, error) {
                hideSpinner();
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }
});

app.controller('loginCtrl', function ($scope, $location, $rootScope, $routeParams) {
    $rootScope.title = 'login';

    if (currentUser())
        $location.path('/');
    hideSpinner();

    $scope.login = function () {
        if (!$scope.username || !$scope.password) {
            alert("Username/Password are required!");
            return;
        }
        showSpinner();
        Parse.User.logIn($scope.username, $scope.password, {
            success: function (result) {
                location.reload();
            },
            error: function (result, error) {
                hideSpinner();
                alert("Error: " + error.code + " " + error.message);
            }
        });
    };
});

app.controller('signupCtrl', function ($scope, $location, $rootScope, $routeParams) {
    $rootScope.title = 'signup';

    if (currentUser())
        $location.path('/');
    var query = new Parse.Query(Parse.Object.extend("AccountTypes"));
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
        if ($scope.parent) {
            var query = new Parse.Query(Parse.User);
            query.equalTo("username", $scope.parent);
            query.find({
                success: function (results) {
                    if (results.length == 0) {
                        alert("Parent Not Found");
                        hideSpinner();
                        return;
                    }
                    user.set('parent', results[0]);
                    user.signUp(null, {
                        success: function (result) {
                            location.reload();
                        },
                        error: function (result, error) {
                            hideSpinner();
                            alert("Error: " + error.code + " " + error.message);
                        }
                    });
                },
                error: function (results, error) {
                    hideSpinner();
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        } else {
            user.signUp(null, {
                success: function (result) {
                    location.reload();
                },
                error: function (result, error) {
                    hideSpinner();
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        }
    };
});

app.controller('notFoundCtrl', function ($scope, $location, $rootScope, $routeParams) {
    $rootScope.title = 'Not Found';

    hideSpinner();
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
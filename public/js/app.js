angular.module('currency-converter-app', [])

.controller('CurrencyConverterController', function($scope, $http, $q) {

  $http.get("http://localhost:8080/currencies").then(function(response) {
    $scope.currencies = response.data;

    //set initial values
    $scope.fromCurrency = $scope.currencies[0];
    $scope.toCurrency = $scope.currencies[1];

    var rate = $scope.fromCurrency.rates[$scope.toCurrency.code];
    $scope.currencyFromText = $scope.fromCurrency.name;
    $scope.currencyToText = $scope.toCurrency.name;
    $scope.currencyToValue = rate;
    $scope.fromValue = (0).toFixed(2);
  });


  $scope.updateValue = function() {

  //update currencies rates
  var rate = $scope.fromCurrency.rates[$scope.toCurrency.code];
  $scope.toValue = ($scope.fromValue * rate).toFixed(2);

  //update top currencies information
  $scope.currencyFromText = $scope.fromCurrency.name;
  $scope.currencyToText = $scope.toCurrency.name;
  $scope.currencyToValue = rate;

  //update currencies chart
  $http.get("http://localhost:8080/currency-history/" + $scope.fromCurrency.code + "/" + $scope.toCurrency.code)
  .success(function(response) {

    var chartjsData = [];
    var chartjsLabels = [];

    var lineChartData = {
      labels : chartjsLabels,
      datasets : [
      {
        strokeColor : "rgba(51,153,255,1)",
        data : chartjsData
      }
      ]
    }
    response.forEach(function(item) {
      chartjsData.push(item.rate);
      chartjsLabels.push(item.year);
    });

    lineChartData.labels = chartjsLabels;
    lineChartData.datasets.data = chartjsData;


    var ctx = document.getElementById("canvas").getContext("2d");
    var myChart = new Chart(ctx).Line(lineChartData, {
      datasetFill : false,
      pointDot : false,
      responsive: true
    });
  });
};

 // Update values if currencies change
 $scope.$watch('fromCurrency', function() { 
   $scope.updateValue(); 
 });
 $scope.$watch('toCurrency', function() { 
  $scope.updateValue(); 
});

});
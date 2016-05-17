var service = angular.module('outreachApp.factories', []);
service.factory('dataFactory', function($http){
    var data = {};
    data.fetch = function(url){
        return $http.get(url);
    }
    data.post = function(url, data){
        return $http.post(url, data);
    }
    data.put = function(url, data){
        return $http.put(url, data);
    }
    data.del = function(url){
        return $http.delete(url);
    }
    
    
    return data;
});

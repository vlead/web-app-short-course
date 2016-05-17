var app = angular.module('outreachApp.controllers',[]);
app.controller("users", function($scope, dataFactory, $http, $routeParams, $route,$window)
               {
		   $scope.user_id = $window.number;
		   dataFactory.fetch("/users").success(function(response){
		       $scope.users = response;
		   });
		   $scope.add_user = function(isvalid){    
		       if(isvalid){
			   data = {'name' : $scope.name, 'email' : $scope.email };
			   dataFactory.post("/users", data).success(function(response){
			       history.back();
			   }).error(function(data, status, headers, config){
			       if(status == 500){
				   $scope.status = "Duplicate Entry";
			       }
			       else if(status == 400){
				   $scope.status = "Invalid username"
			       }
			       else{
				   $scope.status = "Failed"
			       }
			   });
			   
		       }
		       else{
			   $scope.status = "Fill Details"
		       }
		}   
//                   $scope.users = [{"name":"sripathi", "id" : 1}, {"name":"raghu", "id": 2},{"name":"laxmipathi", "id" : 3}];
               });
app.controller("view-user", function($scope, dataFactory, $http, $routeParams, $route,$window)
               {
		   dataFactory.fetch("/users/"+$routeParams.id).success(function(response){
		       $scope.id = $routeParams.id;
		       $scope.user_id = $window.number;
		       $scope.role_id = $window.role_name;
		       $scope.name = response.name;
		       $scope.email = response.email;
		   });
		   $scope.delete_user =  function(id)
		   {

		       if(confirm("Are you sure!") == true){
			   dataFactory.del("/users/"+id).success(function(response){
			       history.back();
			   }).error(function(data, status){
			       alert("Error");  
			   });
		       }
                       
		   }
		   $scope.edit_user = function(isvalid){
		       if(isvalid){
			   data = {'name' : $scope.name,'email' : $scope.email };
			   dataFactory.put("/users/"+$routeParams.id, data).success(function(response){
			       history.back();
			   }).error(function(data, status, headers, config){
			       if(status == 500){
				   $scope.status = "Duplicate Entry";
			       }
			       else if(status == 400){
				   $scope.status = "Invalid username"
			       }
			       else{
				   $scope.status = "Failed"
			       }
			   });
            
		       }
		       else{
			   $scope.status = "Fill Details"
		       }
		   }
   

               });

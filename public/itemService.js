"use strict";

angular.module('app').
  factory('ItemService',function($resource){
      return $resource('/testApi');
  })

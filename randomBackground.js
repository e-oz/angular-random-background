'use strict';

angular.module('jm-random-background', [])
  .directive('jmRandomBackground', function($timeout, $compile) {
               var pad = function(num, field) {
                 var n = '' + num;
                 var w = n.length;
                 var l = field.length;
                 var pad = w < l ? l - w : 0;
                 return field.substr(0, pad) + n;
               };

               function randomFromInterval(from, to) {
                 return Math.floor(Math.random()*(to - from + 1) + from);
               }

               var updateBackground = function(element, scope) {
                 var id = randomFromInterval(parseInt(scope.imgNumFrom), parseInt(scope.imgNumTo));
                 if (scope.imgNumPad) {
                   id = pad(id, scope.imgNumPad);
                 }
                 var url = scope.imgUrl + id + scope.imgExt;
                 var tmp_element = $compile('<img src="' + url + '" style="display: none;"/>')(scope);
                 element.prepend(tmp_element).css({
                                 'background-size':       'cover',
                                 'background-position':   'center',
                                 'background-repeat':     'no-repeat',
                                 'background-attachment': 'fixed'
                               });;
                 tmp_element.bind('load', function() {
                   element.css({
                                 'background-image': 'url(' + url + ')'
                               });

                   tmp_element.remove();
                   var refresh_time = 60000;
                   if (scope.refresh) {
                     refresh_time = scope.refresh*1000;
                   }
                   $timeout(function() {
                     updateBackground(element, scope);
                   }, refresh_time);
                 });
               };
               return {
                 restrict: 'A',
                 scope:    {
                   refresh:    '@',
                   imgUrl:     '@',
                   imgNumFrom: '@',
                   imgNumTo:   '@',
                   imgNumPad:  '@',
                   imgExt:     '@'
                 },
                 link:     function link(scope, element, attrs) {
                   scope.imgUrl = attrs.imgUrl || '//s3-eu-west-1.amazonaws.com/btkmedia/media/backgrounds/image';
                   scope.imgExt = attrs.imgExt || '.jpg';
                   if (angular.isUndefined(attrs.imgNumFrom)) {
                     scope.imgNumFrom = '1';
                   }
                   else {
                     scope.imgNumFrom = attrs.imgNumFrom;
                   }
                   if (angular.isUndefined(attrs.imgNumTo)) {
                     scope.imgNumTo = '515';
                   }
                   else {
                     scope.imgNumTo = attrs.imgNumTo;
                   }
                   if (angular.isUndefined(attrs.imgNumPad)) {
                     scope.imgNumPad = '0000';
                   }
                   else {
                     scope.imgNumPad = attrs.imgNumPad;
                   }
                   updateBackground(element, scope);
                 }
               };
             });

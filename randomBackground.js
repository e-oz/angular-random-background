'use strict';

angular.module('jm-random-background')
  .directive('randomBackground', function($timeout, $compile) {
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
                 var id = pad(randomFromInterval(1, 515), '0000');
                 var url = 'https://s3-eu-west-1.amazonaws.com/btkmedia/media/backgrounds/image' + id + '.jpg';
                 var tmp_element = $compile('<img src="' + url + '" style="display: none;"/>')(scope);
                 element.prepend(tmp_element);
                 tmp_element.bind('load', function() {
                   element.css({
                                 'background-image': 'url(' + url + ')',
                                 'background-size':       'cover',
                                 'background-position':   'center',
                                 'background-repeat':     'no-repeat',
                                 'background-attachment': 'fixed'
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
                   imgNumPad:  '@'
                 },
                 link:     function link(scope, element, attrs) {
                   updateBackground(element, scope);
                 },
                 compile:  function(e, attrs) {
                   attrs.imgUrl = attrs.imgUrl || '//s3-eu-west-1.amazonaws.com/btkmedia/media/backgrounds/image';
                   if (angular.isUndefined(attrs.imgNumFrom)) {
                     attrs.imgNumFrom = attrs.imgNumFrom || 1;
                   }
                   if (angular.isUndefined(attrs.attrs.imgNumTo)) {
                     attrs.imgNumTo = attrs.imgNumTo || 515;
                   }
                   if (angular.isUndefined(attrs.imgNumPad)) {
                     attrs.imgNumPad = true;
                   }
                 }
               };
             });

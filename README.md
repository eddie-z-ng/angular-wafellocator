Wafel Locator
===========
A web-app for finding all Wafels & Dinges locations in NYC and getting directions to them!

See it at [wafellocator](http://wafellocator.herokuapp.com/)

Overview
----
* Client-side cross-server request to www.wafelsanddinges.com for truck data on any date using YQL
* Deconstruct and parse received truck data
* Google Maps APIs to create map, determine distance matrices, geolocate, and generate directions
* Single-page app built using AngularJS
* Deployed using Heroku

Screenshots
----
###Landing Page
![Landing](/screenshots/landing.png)

###Select Truck
![Select](/screenshots/select.png)

###Directions
![Directions](/screenshots/directions.png)

###Options
![Options](/screenshots/options.png)

###Tweets
![Tweets](/screenshots/tweets.png)

Challenges
----
* Deconstructing and parsing truck data from www.wafelsanddinges.com. The data is not JSON but seems to be straight JavaScript code that is ``eval``'d' by their server
* Implementing Google Map, markers, and info windows using (angular-google-maps)[https://github.com/nlaplante/angular-google-maps]
* Writing YQL querying, Google Maps distance matrices, Google maps directions as Angular module services
* Piecing this all together in AngularJS

Improvements
----
* Server-side querying and storing truck data from www.wafelsanddinges.com
* Storing more information in localStorage for better mobile experience
* More styling and better user interface

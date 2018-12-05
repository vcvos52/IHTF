# final-project-surf-the-high-cs
team name: Surf the High C's

##description
IHTF, or I Have This Food, is a web application that allows MIT students with excess of MIT Dining meal swipes to donate meal swipes to students who have poor access to food and request them. The app will create a match between students who create requests to donate swipes and students who create requests to receive swipes. The app will facilitate the meeting of the two before entering the dining hall. 

### Proof of Concept
The proof of concept will contain a simplified version of the app and will allow for logging in and out, creating donating and receiving requests, and a rudimentary matching algorithm.

## MVP
The MPV will contain a working version of the app and will allow most features to be present, with the exception of notifications, user 'donated meals' counter, customized hours of operation (per different dining hall), and thorough testing.

The implementation goals for the MVP, as discussed in the meeting, were:
○  Delete fulfilled requests: Completed
○  Cancel requests and meals: Completed
○  URL catching: Completed
○  Matching algorithm - important to get a basic matching: Completed
○  Make it secure (escaping, no thorough csrf yet): Completed
○  Sessions: Completed
○  OpenID Connect: Completed

Bugs fix:
○  Matching to multiple requests: Completed
○  Hours in ‘Upcoming Meals’ are off by timezone: Completed
○  Alice name not appearing in Upcoming meals: Completed
○  Self Matching: Completed

OpenID Connect: provides security against CSRF and XSRF because of request parameter 'state' passed into token request. See 2.1.1.1 in https://openid.net/specs/openid-connect-basic-1_0.html

## File ownership
Models/ -> mostly Husayn, some addition Giulio
routes/ -> mostly Vince, some additions by Giulio and Kostas for OpenID Connect
test/ -> Vince
src/ -> Kostas and Giulio (equally)
server.js, database.js, app.js -> all

## Project on heroku
ihtf.herokuapp.com

## Project setup locally
1. npm install
2. change `test` variables in routes/openidconnect.js and src/components/Login.vue to `true`
3. in MIT OpenID Connect Website, sign in on self-service client registration with credentials and set Redirect URI(s) solely to: http://127.0.0.1:3000/logging
### Compiles and minifies for production
npm run build
npm start
### Run your tests
npm run test
### Lints and fixes files
npm run lint
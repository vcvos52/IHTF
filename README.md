# final-project-surf-the-high-cs
team name: Surf the High C's

##description
IHTF, or I Have This Food, is a web application that allows MIT students with excess of MIT Dining meal swipes to donate meal swipes to students who have poor access to food and request them. The app will create a match between students who create requests to donate swipes and students who create requests to receive swipes. The app will facilitate the meeting of the two before entering the dining hall. 

### Proof of Concept
The proof of concept will contain a simplified version of the app and will allow for logging in and out, creating donating and receiving requests, and a rudimentary matching algorithm.

## MVP
The MPV will contain a working version of the app and will allow most features to be present, with the exception of notifications, csurf security, user 'donated meals' counter, customized hours of operation (per different dining hall), and thorough testing.

The implementation goals for the MVP, as discussed in the meeting, were:
○  Delete fulfilled requests → Husayn
○  Cancel requests → Giulio
○  URL catching → Giulio: Completed
○  Matching algorithm - important to get a basic matching → Husayin
○  Make it secure (bicrypt, escaping, and DOMPurify(), no csurf yet) → Vince
○  Sessions → Vincenzo 
○  OpenID Connect → Kostas/Giulio

Bugs fix:
○  Matching to multiple requests
○  Hours in ‘Upcoming Meals’ are off by timezone
○  Datetime in database instead of string
○  Sessions
○  Alice name not appearing in Upcoming meals

## File ownership
Models/ -> mostly Husayn, some addition Giulio
routes/ -> mostly Vince, some addition Giulio
test/ -> Vince
src/ -> Kostas and Giulio (equally)
server.js, database.js, app.js -> all

## Project on heroku
ihtf.herokuapp.com

## Project setup locally
npm install
### Compiles and hot-reloads for development
npm run serve
### Compiles and minifies for production
npm run build
### Run your tests
npm run test
### Lints and fixes files
npm run lint
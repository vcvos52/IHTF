# final-project-surf-the-high-cs
team name: Surf the High C's

##description
IHTF, or I Have This Food, is a web application that allows MIT students with excess of MIT Dining meal swipes to donate meal swipes to students who have poor access to food and request them. The app will create a match between students who create requests to donate swipes and students who create requests to receive swipes. The app will facilitate the meeting of the two before entering the dining hall. 

### Proof of Concept
The proof of concept will contain a simplified version of the app and will allow for logging in and out, creating donating and receiving requests, and a rudimentary matching algorithm.

### MVP
The MVP will contain a working version of the app and will allow most features to be present, with the exception of notifications, aesthetic improvements, some bug fixing, more hours of operation available, clearing of stale requests, and counter for user.

The implementation goals for the MVP, as discussed in the meeting, were:
1. Delete fulfilled requests: Completed
2. Cancel requests and meals: Completed
3. URL catching: Completed
4. Matching algorithm - important to get a basic matching: Completed
5. Make it secure (escaping, no thorough csrf yet): Completed
6. Sessions: Completed
7. OpenID Connect: Completed

Bugs fix:
8. Matching to multiple requests: Completed
9. Hours in ‘Upcoming Meals’ are off by timezone: Completed
10. Alice name not appearing in Upcoming meals: Completed
11. Self Matching: Completed

OpenID Connect: provides security against CSRF and XSRF because of request parameter 'state' passed into token request. See 2.1.1.1 in https://openid.net/specs/openid-connect-basic-1_0.html

### Final Product - version 1.0
The final product contain the finalized version of the app with all features from POC and MVP, and the following additions:
1. Notification System for matches and deletion of confirmed meals: Completed
2. Counter for donated meals after login: Completed
3. Change of location for logout: Completed
4. Cap on requests: Completed
5. Fix bug on deletion reactiveness of last request and meal: Completed
6. 'Please Wait' after Submit of a request: Completed
7. Clearing of stale requests (delete from db): Completed
8. Only showing upcoming meals in front-end (do not delete from db stale ones): Completed
9. Put the Foreign Keys back: Completed
10. Make the Pending Request Prettier: Completed
11. Make app aesthetically pleasing for mobile: Completed

## File ownership
Models/ -> mostly Husayn, some addition Giulio for nodemailer
routes/ -> mostly Vince, some additions by Giulio and Kostas for OpenID Connect
test/ -> Vince
src/ -> Kostas and Giulio (equally)
server.js, database.js, app.js -> all

## Project on heroku
ihtf.herokuapp.com

## Project setup locally
1. npm install
2. change `test` variables in routes/openidconnect.js, src/components/Login.vue, and App.vue to `true`. There are two tests account, with kerberos `test1` and `test2` - in order to switch among the two, change this.kerberos in the `login` function of Login.vue
3. in MIT OpenID Connect Website, sign in on self-service client registration with credentials and set Redirect URI(s) solely to: http://127.0.0.1:3000/logging
(whenever done with testing, make sure to reset the Redirect URI(s) to https://ihtf.herokuapp.com/logging) or else it will not work on heroku anymore.
4. npm run build
5. npm start --> localhost:3000
### Compiles and minifies for production
npm run build
npm start
### Run your tests
npm run test
### Lints and fixes files
npm run lint

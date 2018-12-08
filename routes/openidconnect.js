const express = require('express');
const router = express.Router();
const axios = require('axios');
const queryString = require('query-string');

/**
 * Catches redirection from /autorize and parse code and state
 * After parsing, proceeds with authentications as stated in 
 * http://kb.mit.edu/confluence/display/istcontrib/Logging+in+Users+to+your+application+using+OpenID+Connect
 * 
 * Eventually sets the session for the authenticated kerberos and redirects to ihtf
 */
router.get("/", async (req, res) => {
    let test = false // change when deploying!
    let redirect_url;

    // getting code, state from req
    let authorization_code = req.query.code;
    let stateReturned = req.query.state;

    // authorization info
    let client_id = "ab2aab03-b1aa-4fda-aa27-518b9b5c05e5";
    let client_secret =
        "AJakB9Zn_Tosrn306Op1flIZ0vBCweBdbkFq5V7g4OjIbnEZ2aa0d21voitKYSBHyAEdmT_WMiAL5kvZnUcLQc4";

    if (test) {
        redirect_url = "http://127.0.0.1:3000/logging";
    } else {
        redirect_url = "https://ihtf.herokuapp.com/logging";
    }

    let state = "state=g5afc5n89"; //used to mitigate csrf or xsrf attacks

    // Check if state is equal to before
    if (state.substring(6) !== stateReturned) {
        res.status(403).json("Could not validate state.").end();
        return;
    }

    // Step 3: HTTP Post to Token Endpoint
    let data = {
        'grant_type': 'authorization_code',
        'code': authorization_code,
        'redirect_url': redirect_url
    }
    await axios({
        method: "post",
        url: "https://oidc.mit.edu/token",
        withCredentials: true,
        crossdomain: true,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        auth: {
            username: client_id,
            password: client_secret
        },
        data: queryString.stringify(data)
    }).then(async tokenRes => {
        // Step 4: Parse and Validate the ID Token
        // check that id_token and scope are there.
        let parsedToken = tokenRes.data;
        if (parsedToken.id_token === undefined) {
            res.status(403).json("Id Token missing").end();
            return;
        } else if (!parsedToken.scope.includes('email')) {
            res.status(403).json("You must give access to email in OpenID connect").end();
            return;
        }

        // Step 5: Get user info through Bearer Token from access_token
        await axios({
            method: "get",
            url: "https://oidc.mit.edu/userinfo",
            headers: { 'Authorization': "bearer " + parsedToken.access_token }
        })
            .then(async userInfoRes => {
                let parsedInfo = userInfoRes.data;

                if (parsedInfo.email === undefined) {
                    res.status(403).json("User did not grant access to scope for email").end();
                    return;
                }
                let email = parsedInfo.email;
                let kerberos = email.substring(0, email.length - 8);

                // Step 6: Sign in the app!
                req.session.name = kerberos;
                res.redirect("/");
            })
            .catch(err => {
                res.status(403).json(err).end();
            });
    })
        .catch(err => {
            res.status(403).json(err).end();
        });
})

module.exports = router;
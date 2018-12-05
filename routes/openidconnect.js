const express = require('express');
const router = express.Router();
const axios = require('axios');
const queryString = require('query-string');

// Step 2: catch redirection from /autorize and parse code and state
router.get("/", async (req, res) => {

    let authorization_code = req.query.code;
    let stateReturned = req.query.state;

    // authorization info
    let client_id = "ab2aab03-b1aa-4fda-aa27-518b9b5c05e5";
    let client_secret =
        "AJakB9Zn_Tosrn306Op1flIZ0vBCweBdbkFq5V7g4OjIbnEZ2aa0d21voitKYSBHyAEdmT_WMiAL5kvZnUcLQc4";
    let registration_access_token =
        "eyJhbGciOiJSUzI1NiJ9.eyJhdWQiOlsiYWIyYWFiMDMtYjFhYS00ZmRhLWFhMjctNTE4YjliNWMwNWU1Il0sImlzcyI6Imh0dHBzOlwvXC9vaWRjLm1pdC5lZHVcLyIsImp0aSI6ImZiZmZmNTc1LTdkMGYtNDlmMC1iNzJhLTFlNTBiOWRmMjI1MCIsImlhdCI6MTU0MjY1ODczMH0.JPqggez-nVf98_fGzkZPi1qAfGFHhq2F0yN24LhkgRdTFCDAzTREfj9t34G3bl_OS9WduWBRegF-QT9h5dOmZ7ULKyVidmTIiajhKPC-Ll3AFkpdn_UhUwWTHmow66KeOVzlA-nEmz-j-DBefFHOb7ibDPyaZBsLvqQdNMdHnKXEHatWoqTIT6Zu1UlosDfgHrGoJCkK7OY8lUBYbPWZGVvnsxgvi20wXfKqcX4APF12z9FIIVY-RRxVyrVmY9-y27ngG41wLYV96zQXn7jf4Mbz_h6JU-oJyER_BugGJV_x7dm2GxNucj96KpU6wQgWChdvbEJPEMrZi_yDNQU3CA";
    let client_config_url =
        "https://oidc.mit.edu/register/ab2aab03-b1aa-4fda-aa27-518b9b5c05e5";

    let redirect_url = "http://127.0.0.1:3000/logging"; // https://ihtf.herokuapp.com -> URL encode?
    let scope = "scope=openid%20email";
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
        let [header, body, signature] = parsedToken.id_token.split(".");

        // Step 5: Validate signature on ID token using JWS
        // TODO

        // Step 6: Get user info through Bearer Token from access_token
        let config = {
            headers: { 'Authorization': "bearer " + parsedToken.access_token }
        }
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

                // Step 7: Sign in the app!
                // need to go back to the app and make call to /api/users + kerberos and eventbus emit
                let url = queryString.stringify("http://localhost:3000/api/users/" + kerberos);
                await axios
                    .get("http://localhost:3000/")
                    .then(() => {
                    })
                    .catch(err => {
                        res.status(403).json(err).end();
                    });
            })
            .catch(err => {
                console.log(err);
                res.status(403).json(err).end();
            });
    })
        .catch(err => {
            res.status(403).json(err).end();
        });
})

module.exports = router;
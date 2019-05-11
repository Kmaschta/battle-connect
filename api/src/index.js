const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const querystring = require('querystring');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const client = {
    id: process.env.BATTLE_CLIENT_ID,
    secret: process.env.BATTLE_CLIENT_SECRET,
    redirect_uri: process.env.BATTLE_CLIENT_REDIRECT_URI
};

app.post('/battletag', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.sendStatus(400);
    }

    let response;
    try {
        response = await axios.post(
            'https://eu.battle.net/oauth/token',
            querystring.stringify({
                grant_type: 'authorization_code',
                code,
                redirect_uri: client.redirect_uri
            }),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${client.id}:${client.secret}`, 'utf-8').toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
    } catch (error) {
        console.error('error', error);

        return res.sendStatus(500);
    }

    // This token should be saved, and used multiple times
    const { access_token } = response.data;

    const userInfoResponse = await axios.get('https://eu.battle.net/oauth/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` }
    });

    res.send(userInfoResponse.data);
});

module.exports = app;

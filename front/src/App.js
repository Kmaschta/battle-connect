import React, { Fragment } from 'react';
import { Fetch } from 'react-request';
import './App.css';

const apiUrl = process.env.REACT_APP_API_URL;

const params = {
    client_id: process.env.REACT_APP_BATTLE_OAUTH_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_BATTLE_OAUTH_REDIRECT_URI,
    response_type: 'code'
};

const authorizeUri = `https://eu.battle.net/oauth/authorize?${Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')}`;

const queryParams = window.location.search
    ? Object.fromEntries(
          window.location.search
              .replace('?', '')
              .split('&')
              .map(param => param.split('=').map(decodeURIComponent))
      )
    : {};

const defaultHeaders = { Accept: 'application/json', 'Content-Type': 'application/json' };

function App() {
    return (
        <div className="App">
            <header className="App-header">
                {queryParams.code ? (
                    <Fetch
                        method="POST"
                        url={`${apiUrl}/battletag`}
                        headers={defaultHeaders}
                        body={JSON.stringify({ code: queryParams.code })}
                        lazy={false}
                    >
                        {({ fetching, failed, data }) => (
                            <Fragment>
                                {fetching && <span>Loading...</span>}
                                {failed && <span>An error occured</span>}
                                {data && <span>Welcome {data.battletag}</span>}
                            </Fragment>
                        )}
                    </Fetch>
                ) : (
                    <a href={authorizeUri}>Connect with Battle.net</a>
                )}
            </header>
        </div>
    );
}

export default App;

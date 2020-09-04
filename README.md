# m0rpheus

A service for downloading Deezer, Spotify and Tidal music (or album) to your Onedrive.

## Usage

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Then send a POST request to your server's `/matrix` endpoint with the header:

`{ "Authorization": "<M0RPHEUS_ACCESS_KEY from Heroku Config vars>" }`

and JSON body:

```JSON
{
  "mgaAccessToken": "<Microsoft Graph API Access Token>",
  "trackUrl": "<Song or Album URL>",
  "trackName": "<Song Title>"
}
```

After sometime, the 320 KBPS MP3 file(s) will show up on your OneDrive/Music folder.

## Information

**Author:** [Nissan Ahmed](https://ni554n.github.io) ([@ni554n](https://twitter.com/ni554n))

**Project:** [Homepage](https://github.com/ni554n/m0rpheus/) / [Support](https://github.com/ni554n/m0rpheus/issues)

**License:** [MIT](https://github.com/ni554n/m0rpheus/blob/master/LICENSE)

**Donate:** [PayPal](https://paypal.me/ni554n)

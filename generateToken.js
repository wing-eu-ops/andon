const readline = require('readline');
const { google } = require('googleapis');

const client_id = '380098301424-pb3k9k2aevepolm19q9l4eivm8o8si04.apps.googleusercontent.com'
const redirect_uris = ['urn:ietf:wg:oauth:2.0:oob', 'http://localhost']
const client_secret = "ze9cgOXeGHCDNwsimMUEEQ2f"


//"auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",,}}

const scopes = [
  // ‘https://www.googleapis.com/auth/drive',
  // ‘https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
]

var sheets = google.sheets('v4');

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});
console.log('Authorize this app by visiting this url:', authUrl);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question('Enter the code from that page here: ', (code) => {
  rl.close();
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error while trying to retrieve access token', err);
    oAuth2Client.setCredentials(token);
    console.log('TOKEN TO STORE:');
    console.log('----------------');
    console.log(JSON.stringify(token));
    console.log('----------------');
  });
});


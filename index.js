const mqtt = require('mqtt')
const request = require('request')

const clientMqtt = mqtt.connect('mqtt://localhost')
clientMqtt.on('connect', () => console.log('Connected to mqtt'))

const Koa = require('koa');
const serve = require('koa-static');

const app = new Koa();

const server = require('http').createServer(app.callback())

const io = require('socket.io')(server)

const devicesState = {}

const correspondance = {
	"test": "test",
	"": "01 & 02",
	"": "03 & 04",
	"": "05 & 06",
	"": "07 & 08",
	"": "09 & 10",
	"": "11 & 12",
	"": "13 & 14",
	"": "15 & 16",
	"": "17 & 18",
	"": "00 Formation",
}

const GOOGLE_TOKEN = {"access_token":"","refresh_token":"","scope":"https://www.googleapis.com/auth/spreadsheets","token_type":"Bearer","expiry_date":1564567188688}
const { google } = require('googleapis')
const client_id = ''
const redirect_uris = ['urn:ietf:wg:oauth:2.0:oob', 'http://localhost']
const client_secret = ""
const auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris)
auth.setCredentials(GOOGLE_TOKEN)
const sheets = google.sheets('v4')
const spreadsheetId = ''

function addRowToExcel(...line) {
	const [ eventDate, station, message ] = line
	if (!['Je quitte mon poste', 'Je packe', 'Je pars en pause'].includes(message)) {
		request.post({
			url: 'https://hooks.slack.com/services/...', 
			json: true,
			body: {
				text: `*Station ${station}*\n${message}`,
			}
		});
	}
	sheets.spreadsheets.values.append({
		auth,
		spreadsheetId,
		range: 'A1',
		insertDataOption: 'INSERT_ROWS',
		valueInputOption: 'USER_ENTERED',
		resource: { values : [ line ]  },
	}, (err, res) => {
		if (err) return console.log('The API returned an error: ' + err);
		console.log(res)
		if (rows.length) {
			console.log('Name, Major:');
			// Print columns A and E, which correspond to indices 0 and 4.
			rows.map((row) => {
				console.log(`${row[0]}, ${row[4]}`);
			});
		} else {
			console.log('No data found.');
		}
	});
}

io.on('connection', socket => {
  socket.emit('devices_state', JSON.stringify(devicesState))
})

clientMqtt.on('connect', function () {
  console.log('Connection OK to MQTT broker')
  clientMqtt.subscribe('cmnd/#')
})

clientMqtt.on('message', function (topic, message) {
  // message is Buffer
  const msg = JSON.parse(message.toString())
  if (msg.device && msg.message) {
	  const nomDevice = correspondance[msg.device] ? correspondance[msg.device] : msg.device;
	  devicesState[nomDevice] = msg.message
	  addRowToExcel(new Date(), nomDevice, msg.message)
	  io.sockets.emit('devices_state', JSON.stringify(devicesState))
  }

  //clientMqtt.end()
})


const options = { qos: 1 };

app.use(serve(__dirname + '/static'));

app.use(async ctx => {
	if (ctx.path === '/color')  {
	  const { r, g, b, device, effect, message } = ctx.query
	  console.log('Send', { r,g,b,effect })
	  clientMqtt.publish(`cmnd/${device}/color`, JSON.stringify({ effect }), { ...options })
	  clientMqtt.publish(`cmnd/${device}/color`, JSON.stringify({ color: { r, g ,b } }), { ...options })
	  clientMqtt.publish(`cmnd/${device}/message`, JSON.stringify({ device, message }), { ...options, retain: true })
	  ctx.body = 'Color changed';
	} else {
	  ctx.status = 404
	  ctx.body = 'Not found';
	}
})

server.listen(3000);

console.log('listening on port 3000');

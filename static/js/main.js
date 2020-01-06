function sendColor(params) {
	console.log('send:', params)
	$.get('/color', params)
}

const colorMapping = {
	"solid-red": { r:255, g:0, b:0 },
	"solid-green": { r:0, g:255, b:0 },
	"solid-blue": { r:0, g:0, b:255 },
	"solid-cyan": { r:0, g:255, b:255 },
	"solid-magenta": { r:255, g:0, b:255 },
	"solid-yellow": { r:255, g:255, b:0 },
	"solid-orange": { r:255, g:254, b:0 },
	"blink1-red": { effect: 'blink1', r:255, g:0, b:0 },
	"blink1-green": { effect: 'blink1', r:0, g:255, b:0 },
	"blink1-blue": { effect: 'blink1', r:0, g:0, b:255 },
	"blink1-yellow": { effect: 'blink1', r:255, g:255, b:0 },
	"blink1-orange": { effect: 'blink1', r:255, g:254, b:0 },
	"blink2-red": { effect: 'blink2', r:255, g:0, b:0 },
	"blink2-green": { effect: 'blink2', r:0, g:255, b:0 },
	"blink2-blue": { effect: 'blink2', r:0, g:0, b:255 },
	"blink2-yellow": { effect: 'blink2', r:255, g:255, b:0 },
	"blink2-orange": { effect: 'blink2', r:255, g:254, b:0 },
	"blink3-red": { effect: 'blink3', r:255, g:0, b:0 },
	"blink3-green": { effect: 'blink3', r:0, g:255, b:0 },
	"blink3-blue": { effect: 'blink3', r:0, g:0, b:255 },
	"blink3-yellow": { effect: 'blink3', r:255, g:255, b:0 },
	"blink3-orange": { effect: 'blink3', r:255, g:254, b:0 },
	"blink4-red": { effect: 'blink4', r:255, g:0, b:0 },
	"blink4-green": { effect: 'blink4', r:0, g:255, b:0 },
	"blink4-blue": { effect: 'blink4', r:0, g:0, b:255 },
	"blink4-yellow": { effect: 'blink4', r:255, g:255, b:0 },
	"blink4-orange": { effect: 'blink4', r:255, g:254, b:0 },
	"champagne": { effect: 'champagne', r:1, g:0, b:0 },
	"rainbow1": { effect: 'rainbow1', r:1, g:0, b:0 },
	"rainbow2": { effect: 'rainbow2', r:1, g:0, b:0 },
	"rainbow3": { effect: 'rainbow3', r:1, g:0, b:0 },
	"rainbow4": { effect: 'rainbow4', r:1, g:0, b:0 },
	"black": { r:0, g:0, b:0 },
}       
$(document).ready(function() {
	let selectedPoste
	try {
	 selectedPoste = window.location.search.split('poste=')[1].split('&')[0]
	}
	catch(e) {}
	if (selectedPoste) {
		$('#device_address').val(selectedPoste)
	}
	$('.colorbtn').on('click', function() {
		const isGodMode = $('#godModeCheckbox').val() === 'on'
		const color = $(this).attr('id')
		const { r, g, b, effect } = colorMapping[color]
		if (isGodMode) {
			const distinctAddresses = {}
			$.each($('#device_address option'), function() {
				const address = $(this).attr('value')
				if (address) {
					distinctAddresses[address] = 'ok'
				}
			})
			const addresses = Object.keys(distinctAddresses)
			addresses.forEach(device => 
				sendColor({
					device,
					r,
					g,
					b,
					effect: colorMapping[color].effect || '',
					message: $(this).text(),
				})
			)
			return
		}
		sendColor({
			device: $('#device_address').val(),
			r,
			g,
			b,
			effect: colorMapping[color].effect || '',
			message: $(this).text(),
		})
	});
})

function plotGenome(genome_name, genome_length, features_to_plot, features_JSON, options){
	var canvas = options.canvas,
		context = canvas.getContext('2d');
	if(window.devicePixelRatio === 2) {
		canvas.setAttribute('width', 2 * canvas.width);
		canvas.setAttribute('height', 2 * canvas.height);
		context.scale(2, 2);
	}
	var centerX = canvas.width / 4,
		centerY = canvas.height / 4,
		radius = canvas.width / 6,
		origin = -Math.PI / 2,
		interval = (2 * Math.PI / genome_length);
	if (typeof options.radius !== 'undefined') {
		radius = options.radius;
	}
	drawCircle(canvas, context, centerX, centerY, radius, options);
	addName(genome_name, genome_length, canvas, context, centerX, centerY, radius, options);
}

function addName(genome_name, genome_length, canvas, context, centerX, centerY, radius, options){
	//This function allows for italic tags <i> and </i> in the text
	//However this is something of a hack
	//If italic tags are used, a monospace font is necessary, since it
	//has to read character by character, rather than the entire line,
	//because each character has a different width in serif and sans-serif fonts
	context.lineWidth = 1;
	context.fillStyle = 'black';
	context.lineStyle = '#ffff00';
	context.textAlign = 'center';
	fontsize = 20;
	var start_it = genome_name.indexOf('<i>');
	var end_it = genome_name.indexOf('</i>');
	if (options.font !== undefined){
		font = options.font;
	}
	else {
		font = 'sans-serif';
	}
	if (start_it !== end_it) {
		var italic_part = '';
		var std_part = '';
		context.textAlign = 'left';
		var undelimited = genome_name.replace('<i>', '');
		undelimited = undelimited.replace('</i>', '');
		var left = centerX - ((genome_name.length - 7) * (fontsize / 2) / 4);
		var bool = 1;
		context.font = 'oblique 10px Consolas';
		for(var i = 0; i < genome_name.length; i++){
			if (genome_name.charAt(i) === '<'){
				bool = 0;
				context.font = 'oblique 10px Consolas';
			}
			if (bool === 1){
				context.fillText(genome_name.charAt(i), left, centerY - (fontsize / 2));
				left = left + 0.5 * (fontsize / 2);
			}
			if (genome_name.charAt(i) === '>'){
				bool = 1;
			}
			if (genome_name.charAt(i) === '/'){
				context.font = '10px Consolas';
			}
		}
		context.textAlign = 'center';
		context.font = '10px Consolas';
		context.fillText(genome_length+ " bp", centerX, centerY + (fontsize / 2));
	} else {
		context.font = 'italic 10px ' + font;
		context.fillText(genome_name, centerX, centerY - (fontsize / 2));
		context.textAlign = 'center';
		context.font = '10px ' + font;
		context.fillText(genome_length+ " bp", centerX, centerY + (fontsize / 2));
	}
}

function drawCircle(canvas, context, centerX, centerY, radius, options) {
	if (typeof options.radius === 'undefined') {
		context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
	} else {
		context.arc(centerX, centerY, options.radius, 0, 2 * Math.PI, false);
	}
	context.lineWidth = 2;
	context.strokeStyle = 'black';
	context.fillStyle = 'transparent';
	context.fill();
	context.stroke();
}
function plotGenome(genome_name, genome_length, features_to_plot, features_JSON, labels_to_plot, options){
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
	addTicks(canvas, context, genome_length, origin, interval, radius, centerX, centerY, options);
	addLegend(canvas, context, features_to_plot, centerX, centerY, options.colors, 20);
	addAnnotations(canvas, context, features_to_plot, labels_to_plot, features_JSON, centerX, centerY, radius, options.colors, origin, interval, genome_length);
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

function addTicks(canvas, context, genome_length, origin, interval, radius, centerX, centerY, options) {
    var orders = 3;
    var color = "black";
    var font = "sans-serif";
    var fontsize = 10;
    var labelLevels = 2;
    var
        tickLength = radius / 7.5,
        order = orderOfMagnitude(genome_length),
        tick = 0,
        linewidth = 1.5,
        i,
        sx,
        textPos = radius / 4;
    for (i = 0; i < orders; i += 1) {
        while (tick < genome_length) {
            context.beginPath();
            context.lineWidth = linewidth;
            context.fillStyle = color;
            sx = origin + (tick * interval);
            context.moveTo((radius * Math.cos(sx)) + centerX, (radius * Math.sin(sx)) + centerY);
            context.lineTo(((radius-tickLength)* Math.cos(sx)) + centerX, ((radius-tickLength)* Math.sin(sx)) + centerY);
            context.stroke();
            if (i === (labelLevels - 1)){
                context.textAlign = 'center';
                context.font = fontsize+"px "+font;
                context.fillText(numberNomenclature(tick), ((radius-textPos)* Math.cos(sx)) + centerX, ((radius-textPos)* Math.sin(sx)) + (centerY+(fontsize/2)));
            }
            tick += order;
        }
        order = orderOfMagnitude(order-1);
        linewidth -= 0.5;
        tickLength = radius / (7.5 + (2.5 * (i + 1)));
        textPos = radius / (4 + (1.5 * (i + 1)));
        tick = 0;
    }
}

function numberNomenclature(number) {
    var prefix;
    if (number === 0) {
        prefix = number;
    } else if ((number % 1000000000) === 0) {
        prefix = (number / 1000000000) + "G";
    } else if ((number % 1000000) === 0) {
        prefix = (number / 1000000) + "M";
    } else if ((number % 1000) === 0) {
        prefix = (number / 1000) + "K";
    } else {
        prefix = number;
    }
    return prefix;
}

function angle(centerX, centerY, p1) {
	var p0 = {x: centerX, y: centerY - Math.sqrt(Math.abs(p1.x - centerX) * Math.abs(p1.x - centerX) + Math.abs(p1.y - centerY) * Math.abs(p1.y - centerY))};
	return (2 * Math.atan2(p1.y - p0.y, p1.x - p0.x)) * 180 / Math.PI;
}

function log10(val) {
	return Math.log(val) / Math.LN10;
}

function orderOfMagnitude(val) {
	return Math.pow(10, Math.floor(log10(val)));
}

function scaleValues(location, A, B, C, D) {
	var position = (((location - A) * (D - C)) / (B - A)) + C;
	return position;
}

function addLegend(canvas, context, features_to_plot, centerX, centerY, colors, fontsize) {
	//I would prefer if the randomness in colors was seedable, but for now this'll do.
	var rectX = (canvas.width / 2 - 40);
	var rectY = 75
	var rectWidth = 20;
	var rectHeight = 20;
	var cornerRadius = 2;
	context.textAlign = 'end';
	context.textBaseline = 'middle';
	for (var i = 0; i < colors.length; i++) {
		context.lineJoin = "round";
		context.strokeStyle = 'black';
		context.lineWidth = cornerRadius;
		context.fillStyle = colors[i];
		context.fill();
		context.strokeRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2), rectWidth-cornerRadius, rectHeight-cornerRadius);
		context.fillRect(rectX+(cornerRadius/2), rectY+(cornerRadius/2), rectWidth-cornerRadius, rectHeight-cornerRadius);
		context.fillStyle = 'black';
		context.fillText(features_to_plot[i], (rectX - 10), rectY + (fontsize / 2));
		rectY += 25;
	}
}

function addAnnotations(canvas, context, features_to_plot, labels_to_plot, features_JSON, centerX, centerY, radius, colors, origin, interval, genome_length){
	var array = JSON.parse(features_JSON);
	var Features = {};
	var Labels = {};
	var linewidth = 10;
	var i;
	var rad;
	for (i = 0; i < features_to_plot.length; i++) {
		Features[features_to_plot[i]] = i;
	}
	for (i = 0; i < labels_to_plot.length; i++) {
		Labels[labels_to_plot[i]] = i;
	}
	for (i = 0; i < array.length; i++) {
		if (Features[array[i].type] !== undefined){
			var left = array[i].start;
			var right = array[i].end;
			if (array[i].strand === '+'){
				rad = radius;
			}
			else {
				rad = radius + linewidth;
			}
			var arcStart = origin + (left * interval);
			var arcEnd = origin + (right * interval);
			var arcRadius = rad + (linewidth / 2) + 1;
			drawGlyphs(context, arcStart, arcEnd, colors[Features[array[i].type]], arcRadius, centerX, centerY, linewidth);
			if (Labels[array[i].type] !== undefined) {
				labelGlyphs(context, left, right, (rad+(1.5*linewidth)), origin, interval, array[i].ID, centerX, centerY, genome_length);
			}
		}
	}
}

function labelGlyphs(context, start, end, radius, origin, interval, label, centerX, centerY, genome_length) {
    context.save();
    var mean = ((start/2) + (end/2));
    var sx = origin + (mean * interval);
    context.fillStyle = "black";
    context.font = "4pt Helvetica";
    var midpoint = genome_length / 2;
    if (mean < midpoint) {
	    context.textAlign = 'left';
	}
	else {
		context.textAlign = 'right';
	}
    context.translate(((radius)* Math.cos(sx)) + centerX, (radius * Math.sin(sx)) + centerY);
    context.fillText(label, 0, 0);
    context.restore();
}

function drawGlyphs(context, start, end, color, radius, centerX, centerY, linewidth) {
        context.beginPath();
        context.arc(centerX, centerY, radius, start, end, false);
        context.lineWidth = linewidth;
        context.strokeStyle = color;
        context.stroke();
}
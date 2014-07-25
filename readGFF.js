function readGFF(filename) {
	//This function reads gff files and exports json strings of annotation
	var pathOfFileToRead = filename;
	function main(pathOfFileToRead)
	//This function is not cross-platform, it works in Firefox and Safari, but not in Chrome
	{
		var contentsOfFileAsString = FileHelper.readStringFromFileAtPath(pathOfFileToRead);
		return(contentsOfFileAsString);
	}
	function FileHelper(){}{
		FileHelper.readStringFromFileAtPath = function(pathOfFileToReadFrom)
		{
			var request = new XMLHttpRequest();
			request.open("GET", pathOfFileToReadFrom, false);
			request.send(null);
			var returnValue = request.responseText;
			return returnValue;
		};
	}
	var gffString = main(pathOfFileToRead),
		lines = gffString.split("\n"),
		result = [],
		headers = ["seqid", "source", "type", "start", "end", "score", "strand", "phase", "attributes"],
		i;
	for (i = 0; i < lines.length; i++) {
		var obj = {},
			j,
			matches,
			annotations = '';
			currentline = lines[i].split("\t");
		if ('#' != currentline.slice(0, currentline.length)) {
			for (j = 0; j < headers.length; j += 1) {
				obj[headers[j]] = currentline[j];
			}
			annotations = currentline[8] + ';';
			curr = annotations.split(";");
			for (j = 0; j < curr.length; j += 1) {
				if (/.*=.*/.test(curr[j])){
					matches = curr[j].match('(.*)=(.*)');
                    obj[matches[1]] = matches[2];
				}
			}
			result.push(obj);
		}
	}
	return JSON.stringify(result);
}

const express = require('express');
var multer  = require('multer')
const app = express();

const PORT = process.env.PORT || 3000

var storage = multer.diskStorage({
  	destination: './uploads/',
	filename: function ( req, file, cb ) {
	    cb( null, file.originalname.split('.')[0]+ '-' + Date.now()+".jpg");
	}
})
 
var upload = multer({ storage: storage })

var bodyParser = require('body-parser')
app.use(bodyParser.json()); 
//app.use(bodyParser.urlencoded({ extended: true }));

app.post('/upload', upload.single('img'), async function (req, res, next) {
    try
    {
    	console.log(req.file)
    	var filename = req.file.filename;
    	var text = await vision(filename)
    	console.log()
    	res.send('DOB: ' + parseDate(text,0) + '\n' + 'Is Legal: ' + isLegalWrapper(text,0));
    }
    catch(e){
    	next(e);
    }
});

app.listen(PORT, () => {
	console.log('server is live');
});

function isLegalWrapper(text,specifier)
{
	return isLegal(calculateAge(getFormattedDate(parseDate(text,specifier),specifier),getCurrentDate()),specifier);
}

async function vision(filename)
{
	var filepath = './uploads/' + filename
	// Imports the Google Cloud client library
	const vision = require('@google-cloud/vision');

	// Creates a client
	const client = new vision.ImageAnnotatorClient();

	// Performs label detection on the image file
	client
	  .labelDetection(filepath)
	  .then(results => {
	    const labels = results[0].labelAnnotations;

	    console.log('Labels:');
	    labels.forEach(label => console.log(label.description));
	  })
	  .catch(err => {
	    console.error('ERROR:', err);
	  });

	/**
	 * TODO(developer): Uncomment the following line before running the sample.
	 */
	const fileName = filepath;

	// Performs text detection on the local file
		const [result] = await client.textDetection(fileName);
		//const detections = result.textAnnotations;
		console.log('Text:');
		console.log(result.textAnnotations[0].description)
		return result.textAnnotations[0].description;
		//detections.forEach(text => console.log(text));
}

//specifier:0 - indodl(lahir), 1 - CAdl(DOB)
function parseDate(text, specifier)
{
	var regex = ''
	var regex2 = /[0-9-/]+/
	if(!specifier)//indo
	{
		regex = /lahir\s*[0-9]{2}[-/][0-9]{2}[-/][0-9]{4}/gi
	}
	else
	{
		regex = /DOB\s*[0-9]{2}[-/][0-9]{2}[-/][0-9]{4}/gi
	}
	var f1 = text.match(regex)[0];
	var f2 = f1.match(regex2)[0];
	return f2;
}

//specifier:0 - indodl(DD-MM-YYYY), 1 - CAdl(MM/DD/YYYY)
function getFormattedDate(oldDOB, specifier)//MM/DD/YYYY
{
	var newDOB = ''
	if(!specifier) //indo
	{
		var d = oldDOB.split('-', 3);
		newDOB = d[1] + '/' + d[0] + '/' + d[2];
	}
	else
	{
		newDOB = oldDOB;
	}
	return newDOB;
}

//dates should be formatted in MM/DD/YYYY
function calculateAge (birthDate, otherDate) {
    birthDate = new Date(birthDate);
    otherDate = new Date(otherDate);

    var years = (otherDate.getFullYear() - birthDate.getFullYear());

    if (otherDate.getMonth() < birthDate.getMonth() || 
        otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
        years--;
    }

    return years;
}

//specifier:0 - indo(18), 1 - CA(21)
function isLegal(age, specifier)
{
	toReturn = true;
	if(specifier)//indo
	{
		if(age < 18)
		{
			toReturn = false;
		}
	}
	else
	{
		if(age < 21)
		{
			toReturn = false;
		}
	}
	return toReturn;
}
function getCurrentDate()
{
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(dd<10) {
	    dd = '0'+dd
	} 

	if(mm<10) {
	    mm = '0'+mm
	} 

	today = mm + '/' + dd + '/' + yyyy;
	return today;
}
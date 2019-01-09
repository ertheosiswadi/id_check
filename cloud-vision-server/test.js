var paragraph = 'KEPOLISIAN NEGARA\nREPUBLIK INDONESIA\nSURAT IZIN MENGEMUDI\nDriving License)\nMETRO JAYA\nNama : ERTHEO SISWADI\nPRIA\nAlamat:CEMPAKA PUTIH TGH 27D/33\nRTO7/08 CEMPAKA PUTIH TMR\nJAKARTA PUSAT\nTempat & JAKARTA\nTgl.Lahir30-05-1997\nTingg\nPekerjaan PELAJAR/MAHASI\nNo. SIM97051205970471\nBerlaku sld: 30-05-2019\n165 cm\nJAKARTA, 28-08-2014\nDIRLANTÁS POLDA METROJAYA\nDrS, RESTU M, BUDYANTO, MM\nKOMBES POL NRP.66080386\n'
// var regex = /lahir\s*[0-9]{2}[-/][0-9]{2}[-/][0-9]{4}/gi;
// var regex2 = /[0-9-/]+/
// var found = paragraph.match(regex)[0];
// var found2 = found.match(regex2)
// console.log(found2[0])

// console.log(calculateAge(getFormattedDate(found2[0],0),'01/05/2019'));
// console.log(isLegal(calculateAge(getFormattedDate(found2[0],0),'01/05/2019'),0))


console.log(isLegal(calculateAge(getFormattedDate(parseDate(paragraph,0),getCurrentDate()),0)));
console.log(getCurrentDate())
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
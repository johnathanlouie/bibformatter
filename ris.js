function start()
{
	var inputTag = document.getElementById("thestuff");
	var theFile = inputTag.files[0];
	getFileData(theFile);
}

function start2(fileData)
{
	var mlaFormat = convert(fileData);
	output(mlaFormat);
}

function getFileData(file)
{
	jLouie.file.read(file, start2);
}

function convert(fileData)
{
	var records = parse(fileData);
	var str = "";
	for (var record of records)
	{
		str += mla(ris(record)) + "\n";
	}
	return str;
}

function linuxEol(str)
{
	return str.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function removeEmptyLines(str)
{
	return str.replace(/\n+/g, "\n").replace(/^\n|\n$/g, "");
}

function parse(fileData)
{
	fileData = linuxEol(fileData);
	var referenceArray = fileData.match(/TY[\w\W]*?ER  - \n/g);
	for (var ref in referenceArray)
	{
		referenceArray[ref] = referenceArray[ref].match(/[A-Z0-9]{2}  - [\w\W]*?(?=\n\s*[A-Z0-9]{2}  - )|ER  - (?=\n)/g);
		for (var line in referenceArray[ref])
		{
			var tagDataArray = referenceArray[ref][line].split("  - ");
			var tagDataObj = {};
			tagDataObj.tag = tagDataArray[0];
			tagDataObj.data = tagDataArray[1].trim();
			referenceArray[ref][line] = tagDataObj;
		}
	}
	return referenceArray;
}

var risLegend = {};
risLegend.tags = [
	["JO", "journal", false],
	["BT", "book", false],
	["VL", "volume", false],
	["IS", "issue", false],
	["TI", "title", false],
	["T1", "title", false],
	["AU", "author", true],
	["A1", "author", true],
	["A2", "author", true],
	["A3", "author", true],
	["A4", "author", true],
	["ED", "editor", true],
	["SP", "startPage", false],
	["EP", "endPage", false],
	["PY", "publicationYear", false],
	["PB", "publisher", false],
	["CY", "publisherLocation", false],
	["UR", "uri", false],
	["DO", "doi", false]
];
risLegend.isArray = function(tag)
{
	for (var i of risLegend.tags)
	{
		if (i[0] === tag)
		{
			return i[2];
		}
	}
	throw new Error("unknown ris tag");
};
risLegend.getProp = function(tag)
{
	for (var i of risLegend.tags)
	{
		if (i[0] === tag)
		{
			return i[1];
		}
	}
	throw new Error("unknown ris tag");
};

function ris(dataStructure)
{
	var obj = {};
	for (var tagData of dataStructure)
	{
		try
		{
			var prop = risLegend.getProp(tagData.tag);
			var isArray = risLegend.isArray(tagData.tag);
			if (isArray)
			{
				if (typeof obj[prop] !== "object" || !Array.isArray(obj[prop]))
				{
					obj[prop] = [];
				}
				obj[prop].push(tagData.data);
			}
			else
			{
				obj[prop] = tagData.data;
			}
		}
		catch (err) {}
	}
	return obj;
}

function authorName(str)
{
	var name = str.split(",");
	var lastName = name[0].trim();
	var firstMiddle = name[1].trim();
	return firstMiddle + " " + lastName;
}

function getYear(dateStr)
{
	return dateStr.match(/\d{4}/)[0];
}

function mlaAuthor(data)
{
	var str = "";
	if (typeof data.author === "object" && Array.isArray(data.author))
	{
		str += data.author[0];
		if (data.author.length === 2)
		{
			str += ", and " + authorName(data.author[1]);
		}
		else if (data.author.length > 2)
		{
			str += ", et al";
		}
		str += ". ";
	}
	return str;
}

function mla(objFormat)
{
	var str = "";
	str += mlaAuthor(objFormat);
	str += "\"" + objFormat.title + ".\" ";
	str += (objFormat.journal || objFormat.book || "") + ", ";
	if (typeof objFormat.editor === "object" && Array.isArray(objFormat.editor))
	{
		str += "Edited by ";
		for (var i = 0; i < objFormat.editor.length; i++)
		{
			str += authorName(objFormat.editor[0]) + ", ";
		}
	}
	str += objFormat.volume ? "vol. " + objFormat.volume + ", " : "";
	str += objFormat.issue ? "no. " + objFormat.issue + ", " : "";
	str += objFormat.publisher ? objFormat.publisher + ", " : "";
	str += objFormat.publicationYear ? getYear(objFormat.publicationYear) + ", " : "";
	str += "pp. " + objFormat.startPage + "-" + objFormat.endPage + ".";
	return str;
}

function output(mlaStr)
{
	document.getElementById("box").value = mlaStr;
}
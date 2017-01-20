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
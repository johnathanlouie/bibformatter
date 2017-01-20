var mla = {};

mla.nameFormat = function(name)
{
	if (typeof name !== "string") {throw new Error("nameFormat arg not str");}
	var name = name.split(",");
	var last = name[0].trim();
	var firstMiddle = name[1].trim();
	return `${firstMiddle} ${last}`;
}

mla.authors = function(authors)
{
	if (typeof authors !== "object" || !Array.isArray(authors) || authors.length === 0) {return "";}
	if (authors.length === 1)
	{
		return `${authors[0]}. `;
	}
	else if (authors.length === 2)
	{
		return `${authors[0]}, and ${mla.nameFormat(authors[1])}. `;
	}
	else if (authors.length > 2)
	{
		return `${authors[0]}, et al. `;
	}
	return "";
}

mla.format = function(data)
{
	var str = `${mla.authors(data.author)}"${data.title}." `;
	str += (data.journal || data.book || "") + ", ";
	if (typeof data.editor === "object" && Array.isArray(data.editor))
	{
		str += "Edited by ";
		for (var i = 0; i < data.editor.length; i++)
		{
			str += mla.nameFormat(data.editor[0]) + ", ";
		}
	}
	str += data.volume ? "vol. " + data.volume + ", " : "";
	str += data.issue ? "no. " + data.issue + ", " : "";
	str += data.publisher ? data.publisher + ", " : "";
	str += data.publicationYear ? getYear(data.publicationYear) + ", " : "";
	str += "pp. " + data.startPage + "-" + data.endPage + ".";
	return str;
}
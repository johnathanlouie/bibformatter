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

mla.editors = function(editors)
{
	if (typeof editors !== "object" || !Array.isArray(editors) || editors.length === 0) {return "";}
	var str = "Edited by ";
	str += mla.nameFormat(editors[0])
	for (var i = 1; i < editors.length; i++)
	{
		str += " and " + mla.nameFormat(editors[i]);
	}
	return str + ", ";
}

mla.addOn = function(prefix, data, suffix)
{
	if (data)
	{
		return prefix + data + suffix;
	}
	return "";
}

mla.format = function(data)
{
	var str = `${mla.authors(data.author)}"${data.title}." `;
	str += (data.journal || data.book || "") + ", ";
	str += mla.editors(data.editor);
	str += mla.addOn("vol. ", data.volume, ", ");
	str += mla.addOn("no. ", data.issue, ", ");
	str += mla.addOn("", data.publisher, ", ");
	str += mla.addOn("", getYear(data.publicationYear), ", ");
	str += "pp. " + data.startPage + "-" + data.endPage + ".";
	return str.replace(/\s{2,}/, " ").trim();
}
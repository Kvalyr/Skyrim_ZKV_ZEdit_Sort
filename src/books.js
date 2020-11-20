function isEmpty(str) {
    return (!str || 0 === str.length);
};

exports.getBookPrefix = function (item, oldName, helpers, settings) {
    let prefix = "";

    if (oldName.includes("Recipe")) {
        prefix = settings.books_recipeText;
    }
    if (isEmpty(prefix) || oldName.startsWith(prefix)) {
        return "";
    }

    return prefix;
}

exports.specialCases = function (item, oldName, helpers, settings) {

    if (oldName.includes("Atronach Forge")) {
        let separator = settings.general_compiledSeparator;
        let desc = xelib.GetValue(item, 'CNAM');
        xelib.SetValue(item, 'FULL', settings.books_recipeText + separator + "Atronach Forge - " + desc);
    }
}
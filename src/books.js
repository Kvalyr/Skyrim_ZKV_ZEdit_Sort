function isEmpty(str) {
    return (!str || 0 === str.length);
};

exports.getBookPrefix = function (item, oldName, helpers) {
    let prefix = "";

    if (oldName.includes("Recipe")) {
        prefix = "Recipe";
    }
    if (isEmpty(prefix) || oldName.startsWith(prefix)) {
        return "";
    }

    return prefix;
}

exports.specialCases = function (item, oldName, helpers, separator) {

    if (oldName.includes("Atronach Forge")) {
        let desc = xelib.GetValue(item, 'CNAM');
        xelib.SetValue(item, 'FULL', "Recipe: Atronach Forge - " + desc);
    }
}
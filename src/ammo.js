function isEmpty(str) {
    return (!str || 0 === str.length);
};

exports.getAmmoPrefix = function (item, oldName, helpers) {
    let prefix = "";

    if (oldName.includes("Arrow")) {
        prefix = "Arrow";
    }
    else if (oldName.includes("Bolt")) {
        prefix = "Bolt"
    }
    if (isEmpty(prefix) || oldName.startsWith(prefix)) {
        return "";
    }

    return prefix;
}

exports.specialCases = function (item, oldName, helpers, separator) {
    if (xelib.EditorID(item) === "ANHArrow") {
        let newName = "Arrow" + separator + " Ancient Nord Honed"
        helpers.logMessage("Changing weapon name from " + oldName + " to " + newName);
        xelib.SetValue(item, 'FULL', newName);
    }

    // Dwarven Exploding Bolts
    if (xelib.EditorID(item) === "DLC1BoltDwarvenExplodingFire") {
        let newName = "Bolt: Exploding Dwarven Bolt of Fire"
        helpers.logMessage("Changing weapon name from " + oldName + " to " + newName);
        xelib.SetValue(item, 'FULL', newName);
    }
    if (xelib.EditorID(item) === "DLC1BoltDwarvenExplodingIce") {
        let newName = "Bolt: Exploding Dwarven Bolt of Ice"
        helpers.logMessage("Changing weapon name from " + oldName + " to " + newName);
        xelib.SetValue(item, 'FULL', newName);
    }
    if (xelib.EditorID(item) === "DLC1BoltDwarvenExplodingShock") {
        let newName = "Bolt: Exploding Dwarven Bolt of Shock"
        helpers.logMessage("Changing weapon name from " + oldName + " to " + newName);
        xelib.SetValue(item, 'FULL', newName);
    }

    // Steel Exploding Bolts
    if (xelib.EditorID(item) === "DLC1BoltSteelExplodingFire") {
        let newName = "Bolt: Exploding Steel Bolt of Fire"
        helpers.logMessage("Changing weapon name from " + oldName + " to " + newName);
        xelib.SetValue(item, 'FULL', newName);
    }
    if (xelib.EditorID(item) === "DLC1BoltSteelExplodingIce") {
        let newName = "Bolt: Exploding Steel Bolt of Ice"
        helpers.logMessage("Changing weapon name from " + oldName + " to " + newName);
        xelib.SetValue(item, 'FULL', newName);
    }
    if (xelib.EditorID(item) === "DLC1BoltSteelExplodingShock") {
        let newName = "Bolt: Exploding Steel Bolt of Shock"
        helpers.logMessage("Changing weapon name from " + oldName + " to " + newName);
        xelib.SetValue(item, 'FULL', newName);
    }
}
function isEmpty(str) {
    return (!str || 0 === str.length);
};

exports.getAmmoPrefix = function (item, oldName, helpers, settings) {
    let prefix = "";

    if (oldName.includes("Arrow")) {
        prefix = settings.ammo_arrowText;
    }
    else if (oldName.includes("Bolt")) {
        prefix = settings.ammo_boltText;
    }
    if (isEmpty(prefix) || oldName.startsWith(prefix)) {
        return "";
    }

    return prefix;
}

exports.specialCases = function (item, oldName, helpers, settings) {
    let separator = settings.general_compiledSeparator;
    let arrowText = settings.ammo_arrowText
    let boltText = settings.ammo_boltText
    if (xelib.EditorID(item) === "ANHArrow") {
        let newName = arrowText + separator + " Ancient Nord Honed"
        helpers.logMessage("Changing weapon name from " + oldName + " to " + newName);
        xelib.SetValue(item, 'FULL', newName);
    }

    // Dwarven Exploding Bolts
    if (xelib.EditorID(item) === "DLC1BoltDwarvenExplodingFire") {
        let newName = boltText + separator + "Exploding Dwarven Bolt of Fire"
        helpers.logMessage("Changing weapon name from " + oldName + " to " + newName);
        xelib.SetValue(item, 'FULL', newName);
    }
    if (xelib.EditorID(item) === "DLC1BoltDwarvenExplodingIce") {
        let newName = boltText + separator + "Exploding Dwarven Bolt of Ice"
        helpers.logMessage("Changing weapon name from " + oldName + " to " + newName);
        xelib.SetValue(item, 'FULL', newName);
    }
    if (xelib.EditorID(item) === "DLC1BoltDwarvenExplodingShock") {
        let newName = boltText + separator + "Exploding Dwarven Bolt of Shock"
        helpers.logMessage("Changing weapon name from " + oldName + " to " + newName);
        xelib.SetValue(item, 'FULL', newName);
    }

    // Steel Exploding Bolts
    if (xelib.EditorID(item) === "DLC1BoltSteelExplodingFire") {
        let newName = boltText + separator + "Exploding Steel Bolt of Fire"
        helpers.logMessage("Changing weapon name from " + oldName + " to " + newName);
        xelib.SetValue(item, 'FULL', newName);
    }
    if (xelib.EditorID(item) === "DLC1BoltSteelExplodingIce") {
        let newName = boltText + separator + "Exploding Steel Bolt of Ice"
        helpers.logMessage("Changing weapon name from " + oldName + " to " + newName);
        xelib.SetValue(item, 'FULL', newName);
    }
    if (xelib.EditorID(item) === "DLC1BoltSteelExplodingShock") {
        let newName = boltText + separator + "Exploding Steel Bolt of Shock"
        helpers.logMessage("Changing weapon name from " + oldName + " to " + newName);
        xelib.SetValue(item, 'FULL', newName);
    }
}
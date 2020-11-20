function isEmpty(str) {
    return (!str || 0 === str.length);
};


exports.getWeaponPrefix = function (item, oldName, helpers) {
    let weaponType = xelib.GetValue(item, 'DNAM\\Animation Type');
    let handedness = "";
    let handednessAfter = true;
    let weapDisplayType = "WEAPON"
    let melee = false;
    switch (weaponType) {
        // Melee
        case "OneHandSword":
            weapDisplayType = "Sword";
            handedness = "1h";
            melee = true;
            break;
        case "OneHandDagger":
            weapDisplayType = "Dagger";
            handedness = "1h";
            melee = true;
            break;
        case "OneHandAxe":
            weapDisplayType = "Axe";
            handedness = "1h";
            melee = true;
            break;
        case "OneHandMace":
            weapDisplayType = "Mace";
            handedness = "1h";
            melee = true;
            break;
        case "TwoHandSword":
            weapDisplayType = "Sword";
            handedness = "2h";
            melee = true;
            break;
        case "TwoHandAxe":
            weapDisplayType = "Axe";
            if (oldName.includes("hammer")) {
                weapDisplayType = "Warhammer";
            }
            handedness = "2h";
            melee = true;
            break;

        // Ranged
        case "Bow":
            weapDisplayType = "Bow";
            // handedness = "2h";
            break;
        case "Crossbow":
            weapDisplayType = "Crossbow";
            // handedness = "2h";
            break;
        case "Staff":
            weapDisplayType = "Staff";
            // handedness = "2h";
            break;

        default:
            // Invalid weapon type, don't modify this record
            helpers.logMessage("Skipping weapon with invalid/unrecognize WeaponType:" + oldName);
            return "";
    }


    let prefix = handedness + " " + weapDisplayType;
    if (melee && handednessAfter) {
        handedness = "(" + handedness + ")"
        prefix = weapDisplayType + " " + handedness;
    }

    if (oldName.startsWith(prefix + " of")) {
        // Last ditch to catch stuff like "Staff: Staff of Fury"
        return "";
    }

    return prefix;
}

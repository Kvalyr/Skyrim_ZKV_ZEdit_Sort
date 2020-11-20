function isEmpty(str) {
    return (!str || 0 === str.length);
};


exports.getWeaponPrefix = function (item, oldName, helpers, settings) {
    let weaponType = xelib.GetValue(item, 'DNAM\\Animation Type');
    let handedness = "";
    let weapDisplayType = "WEAPON"
    let melee = false;

    let oneHandText = settings.weapons_oneHandText;
    let twoHandText = settings.weapons_twoHandText;

    switch (weaponType) {
        // Melee
        case "OneHandSword":
            weapDisplayType = settings.weapons_1hSwordText;
            handedness = oneHandText;
            melee = true;
            break;
        case "OneHandDagger":
            weapDisplayType = settings.weapons_DaggerText;
            handedness = oneHandText;
            melee = true;
            break;
        case "OneHandAxe":
            weapDisplayType = settings.weapons_1hAxeText;
            handedness = oneHandText;
            melee = true;
            break;
        case "OneHandMace":
            weapDisplayType = settings.weapons_1hHammerText;
            handedness = oneHandText;
            melee = true;
            break;
        case "TwoHandSword":
            weapDisplayType = settings.weapons_2hSwordText;
            handedness = twoHandText;
            melee = true;
            break;
        case "TwoHandAxe":
            weapDisplayType = settings.weapons_2hAxeText;
            if (oldName.includes("hammer")) {
                weapDisplayType = settings.weapons_2hHammerText;
            }
            handedness = twoHandText;
            melee = true;
            break;

        // Ranged
        case "Bow":
            weapDisplayType = settings.weapons_BowText;
            // handedness = twoHandText;
            break;
        case "Crossbow":
            weapDisplayType = settings.weapons_CrossbowText;
            // handedness = twoHandText;
            break;
        case "Staff":
            weapDisplayType = settings.weapons_StaffText;
            // handedness = twoHandText;
            break;

        default:
            // Invalid weapon type, don't modify this record
            helpers.logMessage("Skipping weapon with invalid/unrecognized WeaponType:" + oldName);
            return "";
    }


    let prefix = weapDisplayType;
    if (oldName.startsWith(prefix + " of")) {
        // Last ditch to catch stuff like "Staff: Staff of Fury"
        return "";
    }

    if(settings.weapons_handedness){
        if (melee && settings.weapons_handednessAfter) {
            prefix = weapDisplayType + " " + handedness;
        }
        else{
            prefix = handedness + " " + weapDisplayType;
        }
    }


    return prefix;
}

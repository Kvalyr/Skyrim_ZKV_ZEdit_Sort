function isEmpty(str) {
    return (!str || 0 === str.length);
};

const standardSkyrimWeaponTypes = [
    "Dagger",
    "Sword",
    "GreatSword",
    "War Axe",
    "Battleaxe",
    "Mace",
    "Warhammer",
    "Staff",
    "Bow",
    "Crossbow"
]

const isStandardWeaponType = function(weaponType){
    return standardSkyrimWeaponTypes.includes(weaponType);
}

function getPrefixFromSettings(weaponType, settings){
    let prefix = "";
    let isStandard = isStandardWeaponType(weaponType);

    if (isStandard) {
        switch (weaponType) {
            case "Dagger":
                prefix = settings.weapons_DaggerText;
                break;
            case "Sword":
                prefix = settings.weapons_1hSwordText;
                break;
            case "Greatsword":
                prefix = settings.weapons_2hSwordText;
                break;
            case "War Axe":
                prefix = settings.weapons_1hAxeText;
                break;
            case "Battleaxe":
                prefix = settings.weapons_2hAxeText;
                break;
            case "Mace":
                prefix = settings.weapons_1hHammerText;
                break;
            case "Warhammer":
                prefix = settings.weapons_2hHammerText;
                break;
            case "Staff":
                prefix = settings.weapons_StaffText;
                break;
            case "Bow":
                prefix = settings.weapons_BowText;
                break;
            case "Crossbow":
                prefix = settings.weapons_CrossbowText;
                break;
        }
    }
    else {
        // Stuff from mods that add whole new weapon types with new keywords
        // Use whatever Prefix is specified directly in overrides JSON here instead of pulling from user settings
        prefix = weaponType;
    }
    return prefix;
}


function getWeaponTypeByKeyword(weaponTypeFromJson, item) {
    let weaponType = "";
    if(weaponTypeFromJson == "Bow"){
        let animType = xelib.GetValue(item, 'DNAM\\Animation Type');
        if (animType == "Crossbow") {
            weaponType = "Crossbow";
        }
    }
    else {
        // Stuff from mods that add whole new weapon types with new keywords
        // Use whatever Prefix is specified directly in overrides JSON here instead of pulling from user settings
        weaponType = weaponTypeFromJson;
    }
    return weaponType;
}


exports.getWeaponPrefix = function (item, oldName, helpers, settings, locals) {
    if(xelib.EditorID(item).includes("CCOR_MenuCategory")){
        // TODO: Exclusions from JSON rules/overrides
        return "";
    }

    let rules = locals.weaponsRules;
    let recordsByName = rules.by_name;
    let prefixByName = recordsByName[oldName];
    if (!isEmpty(prefixByName)) {
        return prefixByName;
    }

    let recordsByEDID = rules.by_edid;
    let prefixByEDID = recordsByEDID[xelib.EditorID(item)];
    if (!isEmpty(prefixByEDID)) {
        return prefixByEDID;
    }

    // Get intersection of keywords from rules vs keywords present on record
    let keywords = rules.keywords;
    let keywordsPresent = {};
    for (var keyword in keywords) {
        if (xelib.HasKeyword(item, keyword)) {
            keywordsPresent[keyword] = true;
        }
    }

    let weaponType = "";
    for (var keyword in keywordsPresent) {
        weaponType = getWeaponTypeByKeyword(keywords[keyword], item);
    }

    let rangedTypes = rules.ranged || {};
    let melee = true;
    if(rangedTypes.includes(weaponType)){
        melee = false;
    }

    prefix = getPrefixFromSettings(weaponType, settings)

    if (oldName.startsWith(prefix + " of")) {
        // Last ditch to catch stuff like "Staff: Staff of Fury"
        return "";
    }

    if (melee && settings.weapons_handedness) {
        let handedness = "";
        let etyp = xelib.GetValue(item, "ETYP");
        helpers.logMessage("Weapon: " + oldName + "ETYP: " + etyp);
        if (etyp.startsWith("BothHands")) {
            handedness = settings.weapons_twoHandText;
        }
        else {
            handedness = settings.weapons_oneHandText;
        }

        if (settings.weapons_handednessAfter) {
            prefix = prefix + " " + handedness;
        }
        else {
            prefix = handedness + " " + prefix;
        }
    }

    return prefix;
}

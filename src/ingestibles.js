/* global ngapp, xelib, fh */

function isEmpty(str) {
    return (!str || 0 === str.length);
};


function getPrefixBySettings(keyword, settings) {
    let prefix = "";
    if (keyword == "Potion" && settings.ingestibles_potionsEnable) {
        prefix = settings.ingestibles_potionsText;
    }
    else if (keyword == "Poison" && settings.ingestibles_poisonsEnable) {
        prefix = settings.ingestibles_poisonsText;
    }
    else if (keyword == "Food" && settings.ingestibles_cookedFoodEnable) {
        prefix = settings.ingestibles_cookedFoodText;
    }
    else if (keyword == "Raw" && settings.ingestibles_rawFoodEnable) {
        prefix = settings.ingestibles_rawFoodText;
    }
    return prefix;
}


exports.getIngestiblePrefix = function (item, oldName, helpers, settings, locals) {
    let prefix = "";
    if (oldName.startsWith("Drink -") || oldName.startsWith("Food -")) {
        // Early return to prevent hassle from mis-classified items in VitalityMode
        return "fixSep";
    }
    let rules = locals.ingestiblesRules;
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

    for (var keyword in keywordsPresent) {
        prefix = getPrefixBySettings(keywords[keyword], settings);
        if (prefix == settings.ingestibles_cookedFoodText || prefix == settings.ingestibles_rawFoodText) {
            if (settings.ingestibles_identifyDrinks) {
                let pickupSound = xelib.GetValue(item, 'YNAM');
                if (pickupSound == 'ITMPotionUpSD [SNDR:0003EDBD]') {
                    prefix = "Drink";
                }
            }
        }
    }

    if (oldName.startsWith(prefix + " of")) {
        // Last ditch to catch stuff like "Staff: Staff of Fury"
        return "";
    }

    return prefix;
}

function isEmpty(str) {
    return (!str || 0 === str.length);
};


const masteryLevel1 = "I"; //"Novice"; // 00
const masteryLevel2 = "II"; //"Apprentice"; // 25
const masteryLevel3 = "III"; //"Adept"; // 50
const masteryLevel4 = "IV"; //"Expert"; // 75
const masteryLevel5 = "V"; //"Master"; // 75

const alterationPrefix = "Alteration";
const conjurationPrefix = "Conjuration";
const destructionPrefix = "Destruction";
const illusionPrefix = "Illusion";
const restorationPrefix = "Restoration";


exports.getSpellPrefix = function (item, oldName, helpers) {
    let prefix = "";
    let masteryLevel = "";

    let spellDataHandle = xelib.GetElement(item, "SPIT");
    let halfCostPerk = xelib.GetValue(spellDataHandle, "Half-cost Perk");

    if (xelib.EditorID(item) == "AbDragon") {
        return "";
    }

    if (halfCostPerk.includes("Novice")) {
        masteryLevel = masteryLevel1
    }
    else if (halfCostPerk.includes("Apprentice")) {
        masteryLevel = masteryLevel2
    }
    else if (halfCostPerk.includes("Adept")) {
        masteryLevel = masteryLevel3
    }
    else if (halfCostPerk.includes("Expert")) {
        masteryLevel = masteryLevel4
    }
    else if (halfCostPerk.includes("Master")) {
        masteryLevel = masteryLevel5
    }

    if (halfCostPerk.includes("Alteration")) {
        prefix = alterationPrefix
    }
    else if (halfCostPerk.includes("Conjuration")) {
        prefix = conjurationPrefix
    }
    else if (halfCostPerk.includes("Destruction")) {
        prefix = destructionPrefix
    }
    else if (halfCostPerk.includes("Illusion")) {
        prefix = illusionPrefix
    }
    else if (halfCostPerk.includes("Restoration")) {
        prefix = restorationPrefix
    }

    prefix = prefix + " " + masteryLevel;

    return prefix;
}


exports.getSpellTomePrefix = function (item, oldName, helpers) {
    let prefix = "";
    let masteryLevel = "";

    let inventoryArt = xelib.GetValue(item, "INAM");

    if (xelib.EditorID(item) == "AbDragon") {
        return "";
    }

    if (inventoryArt.includes("Alteration")) {
        prefix = alterationPrefix
    }
    else if (inventoryArt.includes("Conjuration")) {
        prefix = conjurationPrefix
    }
    else if (inventoryArt.includes("Destruction")) {
        prefix = destructionPrefix
    }
    else if (inventoryArt.includes("Illusion")) {
        prefix = illusionPrefix
    }
    else if (inventoryArt.includes("Restoration")) {
        prefix = restorationPrefix
    }

    return prefix;
}

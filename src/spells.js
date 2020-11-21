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


function getValueFromSpellEffectsByIndex(spellEffects, index, elementKey){
    if(index > spellEffects.length - 1){
        return;
    }
    let mgef = spellEffects[index];
    let effectHandle = xelib.GetLinksTo(mgef, 'EFID');
    effectHandle = xelib.GetWinningOverride(effectHandle);
    let data = xelib.GetElement(effectHandle, "Magic Effect Data");
    data = xelib.GetElements(data);

    return xelib.GetValue(data, elementKey);
}

/*
function getLowestMinLevelFromMGEFs(spellEffects, helpers){
    let lowestLevel = 1000;
    for (var i = 0; i < spellEffects.length; i++) {
        let minLevel = getValueFromSpellEffectsByIndex(spellEffects, i, "Minimum Skill Level");
        helpers.logMessage("minLevel:" + minLevel);
        if(minLevel < lowestLevel){
            lowestLevel = minLevel;
        }
    }
    return lowestLevel;
}
*/


exports.getSpellPrefix = function (record, oldName, helpers, settings) {
    if (xelib.EditorID(record) == "AbDragon") {
        return "";
    }

    let prefix = "";
    let masteryLevel = "";

    let spellEffects = xelib.GetElement(record, "Effects");
    spellEffects = xelib.GetElements(spellEffects);

    let spellSchool = getValueFromSpellEffectsByIndex(spellEffects, 0, "Magic Skill")
    if (spellSchool == "Alteration") {
        prefix = alterationPrefix
    }
    else if (spellSchool == "Conjuration") {
        prefix = conjurationPrefix
    }
    else if (spellSchool == "Destruction") {
        prefix = destructionPrefix
    }
    else if (spellSchool == "Illusion") {
        prefix = illusionPrefix
    }
    else if (spellSchool == "Restoration") {
        prefix = restorationPrefix
    }
    if(isEmpty(prefix)){
        return "";
    }

    let minLevel = getValueFromSpellEffectsByIndex(spellEffects, 0, "Minimum Skill Level")
    if (minLevel <= 0) {
        masteryLevel = masteryLevel1
    }
    if (minLevel >= 25) {
        masteryLevel = masteryLevel2
    }
    if (minLevel >= 50) {
        masteryLevel = masteryLevel3
    }
    if (minLevel >= 75) {
        masteryLevel = masteryLevel4
    }
    if (minLevel >= 100) {
        masteryLevel = masteryLevel5
    }
    if(isEmpty(masteryLevel)){
        return "";
    }

    prefix = prefix + " " + masteryLevel;

    return prefix;
}


exports.getSpellTomePrefix = function (record, oldName, helpers, settings) {
    let prefix = "";

    let data = xelib.GetElement(record, 'DATA');
    let spellHandle = xelib.GetLinksTo(data, 'Teaches');
    spellHandle = xelib.GetWinningOverride(spellHandle);
    let spellName = xelib.GetValue(spellHandle, "FULL");

    let startsWithSchoolName = false;
    let schoolNames = [alterationPrefix, conjurationPrefix, destructionPrefix, illusionPrefix, restorationPrefix];
    for (var i = 0; i < schoolNames.length; i++) {
        if(spellName.startsWith(schoolNames[i])){
            startsWithSchoolName = true;
        }
    }

    let spellNameParts = spellName.split(settings.general_compiledSeparator);
    if(startsWithSchoolName && spellNameParts.length > 1){
        prefix = spellNameParts[0];
    }
    else{
        // Fall back to using inventory art to get just the school name
        let inventoryArt = xelib.GetValue(record, "INAM");
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
    }

    return prefix;
}

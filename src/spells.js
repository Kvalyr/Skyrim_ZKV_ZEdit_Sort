function isEmpty(str) {
    return (!str || 0 === str.length);
};


function getValueFromSpellEffectsByIndex(spellEffects, index, elementKey) {
    if (index > spellEffects.length - 1) {
        return;
    }
    let mgef = spellEffects[index];
    let effectHandle = xelib.GetLinksTo(mgef, 'EFID');
    effectHandle = xelib.GetWinningOverride(effectHandle);
    let data = xelib.GetElement(effectHandle, "Magic Effect Data");
    data = xelib.GetElements(data);

    return xelib.GetValue(data, elementKey);
}


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
        prefix = settings.spells_alterationText;
    }
    else if (spellSchool == "Conjuration") {
        prefix = settings.spells_conjurationText;
    }
    else if (spellSchool == "Destruction") {
        prefix = settings.spells_destructionText;
    }
    else if (spellSchool == "Illusion") {
        prefix = settings.spells_illusionText;
    }
    else if (spellSchool == "Restoration") {
        prefix = settings.spells_restorationText;
    }
    if (isEmpty(prefix)) {
        return "";
    }

    let minLevel = getValueFromSpellEffectsByIndex(spellEffects, 0, "Minimum Skill Level")
    if (minLevel <= 0) {
        masteryLevel = settings.spells_noviceText;
    }
    if (minLevel >= 25) {
        masteryLevel = settings.spells_apprenticeText;
    }
    if (minLevel >= 50) {
        masteryLevel = settings.spells_adeptText;
    }
    if (minLevel >= 75) {
        masteryLevel = settings.spells_expertText;
    }
    if (minLevel >= 100) {
        masteryLevel = settings.spells_masterText;
    }
    if (isEmpty(masteryLevel)) {
        return "";
    }

    if (settings.spells_addMasteryLevel) {
        prefix = prefix + " " + masteryLevel;
    }

    return prefix;
}


exports.getSpellTomePrefix = function (record, oldName, helpers, settings) {
    let prefix = "";

    let data = xelib.GetElement(record, 'DATA');
    let spellHandle = xelib.GetLinksTo(data, 'Teaches');
    spellHandle = xelib.GetWinningOverride(spellHandle);
    let spellName = xelib.GetValue(spellHandle, "FULL");

    let startsWithSchoolName = false;
    let schoolNames = [
        settings.spells_alterationText,
        settings.spells_conjurationText,
        settings.spells_destructionText,
        settings.spells_illusionText,
        settings.spells_restorationText
    ];
    for (var i = 0; i < schoolNames.length; i++) {
        if (spellName.startsWith(schoolNames[i])) {
            startsWithSchoolName = true;
        }
    }

    let spellNameParts = spellName.split(settings.general_compiledSeparator);
    if (startsWithSchoolName && spellNameParts.length > 1) {
        prefix = spellNameParts[0];
    }
    else {
        // Fall back to using inventory art to get just the school name
        let inventoryArt = xelib.GetValue(record, "INAM");
        if (inventoryArt.includes("Alteration")) {
            prefix = settings.spells_alterationText;
        }
        else if (inventoryArt.includes("Conjuration")) {
            prefix = settings.spells_conjurationText;
        }
        else if (inventoryArt.includes("Destruction")) {
            prefix = settings.spells_destructionText;
        }
        else if (inventoryArt.includes("Illusion")) {
            prefix = settings.spells_illusionText;
        }
        else if (inventoryArt.includes("Restoration")) {
            prefix = settings.spells_restorationText;
        }
    }

    return prefix;
}

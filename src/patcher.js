function isEmpty(str) {
    return (!str || 0 === str.length);
};

// const separator = ":"


const removeSuffix = function (oldName, suffix, helpers) {
    let regex = new RegExp(suffix + "$");
    let newName = oldName.replace(regex, "");
    return newName;
}

const buildSeparator = function(settings){
    let separator = settings.general_separator;
    if(settings.general_spaceBeforeSeparator){
        separator = " " + separator;
    }
    if(settings.general_spaceAfterSeparator){
        separator = separator + " ";
    }
    return separator;
}


const renamer = function (item, oldName, prefix, helpers, removeSuffixFirst, settings) {
    let originalOldName = oldName;
    if (removeSuffixFirst) {
        oldName = removeSuffix(oldName, prefix);
    }
    let separator = settings.general_compiledSeparator;
    let newName = prefix + separator + " " + oldName;
    newName = newName.trim()
    helpers.logMessage("Changing weapon name from " + originalOldName + " to " + newName);
    xelib.SetValue(item, 'FULL', newName);
};


const fixSeperator = function (item, oldName, helpers, settings) {
    // TODO: Something less hard-coded
    let needsFix = false;
    if (oldName.startsWith("Drink - ")) {  // Vitality mode
        needsFix = true;
    }
    if (oldName.startsWith("Recipe - ")) {
        needsFix = true;
    }

    let regex = /\s*-/gi;
    let separator = settings.general_compiledSeparator;
    let newName = oldName.replace(regex, separator)
    newName = newName.trim()

    helpers.logMessage("Fixing separator from " + oldName + " to " + newName);
    xelib.SetValue(item, 'FULL', newName);
};


module.exports = function (patcherPath) {
    let ammo = require(patcherPath + '\\src\\ammo.js');
    let armor = require(patcherPath + '\\src\\armor.js');
    let books = require(patcherPath + '\\src\\books.js');
    let consumables = require(patcherPath + '\\src\\consumables.js');
    let misc = require(patcherPath + '\\src\\misc.js');
    let spells = require(patcherPath + '\\src\\spells.js');
    let weapons = require(patcherPath + '\\src\\weapons.js');
    let module = {};

    module.debug = {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'AMMO',
                filter: function (record) {
                    return xelib.HasElement(record, 'FULL');
                }
            }
        },
        patch: function (item, helpers, settings, locals) {
            helpers.logMessage("================================================================");
            helpers.logMessage("settings:" + String(settings));
            helpers.logMessage("settings.weapons_enable:" + settings.weapons_enable);
            helpers.logMessage("settings.weapons_oneHandText:" + settings.weapons_oneHandText);
            helpers.logMessage("settings.weapons_twoHandText:" + settings.weapons_twoHandText);
            helpers.logMessage("settings.weapons_handednessAfter:" + settings.weapons_handednessAfter);
            helpers.logMessage("settings.weapons_movePrefix:" + settings.weapons_movePrefix);
            helpers.logMessage("================================================================");
        }
    };

    module.init = function(plugin, helpers, settings, locals){
        settings.general_compiledSeparator = buildSeparator(settings);
        helpers.logMessage("built sep: '" + buildSeparator(settings) + "'");
        helpers.logMessage("settings.general_compiledSeparator: '" + settings.general_compiledSeparator + "'");
    }

    module.weaponRenamer = {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'WEAP',
                filter: function (record) {
                    return xelib.HasElement(record, 'FULL');
                }
            }
        },
        patch: function (item, helpers, settings, locals) {
            let oldName = xelib.FullName(item).trim()
            let prefix = weapons.getWeaponPrefix(item, oldName, helpers, settings);
            if (!isEmpty(prefix)) {
                renamer(item, oldName, prefix, helpers, false, settings);
            }
        }
    };

    module.armorRenamer = {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'ARMO',
                filter: function (record) {
                    return xelib.HasElement(record, 'FULL') && xelib.HasElement(record, 'KWDA');
                }
            }
        },
        patch: function (item, helpers, settings, locals) {
            let oldName = xelib.FullName(item).trim()
            let prefix = armor.getArmorPrefix(item, oldName, helpers);
            if (!isEmpty(prefix)) {
                renamer(item, oldName, prefix, helpers, false, settings);
            }
        }
    };

    module.ingestiblesRenamer = {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'ALCH',
                filter: function (record) {
                    return xelib.HasElement(record, 'FULL');
                }
            }
        },
        patch: function (item, helpers, settings, locals) {
            let oldName = xelib.FullName(item).trim()
            let prefix = consumables.getIngestiblePrefix(item, oldName, helpers, settings);
            if (prefix == "fixSep") {
                fixSeperator(item, oldName, helpers, settings);
            }
            else if (!isEmpty(prefix)) {
                renamer(item, oldName, prefix, helpers, false, settings);
            }
            // Fix classification of some drinks as Raw food by some mods (affects sorting in SkyUI)
            if (xelib.FullName(item).startsWith("Drink")) {
                xelib.RemoveKeyword(item, 'VendorItemFoodRaw');
                xelib.AddKeyword(item, 'VendorItemFood');
            }
        }
    };

    module.ammoRenamer = {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'AMMO',
                filter: function (record) {
                    return xelib.HasElement(record, 'FULL');
                }
            }
        },
        patch: function (item, helpers, settings, locals) {
            let oldName = xelib.FullName(item).trim()

            // Fuckit - Hardcode the special cases
            let specialCaseEDIDs = [
                "ANHArrow",
                "DLC1BoltDwarvenExplodingFire",
                "DLC1BoltDwarvenExplodingIce",
                "DLC1BoltDwarvenExplodingShock",
                "DLC1BoltSteelExplodingFire",
                "DLC1BoltSteelExplodingIce",
                "DLC1BoltSteelExplodingShock",
            ]
            if (specialCaseEDIDs.includes(xelib.EditorID(item))) {
                ammo.specialCases(item, oldName, helpers, settings);
            }
            else {
                let prefix = ammo.getAmmoPrefix(item, oldName, helpers, settings);
                if (!isEmpty(prefix)) {
                    renamer(item, oldName, prefix, helpers, settings.ammo_movePrefix, settings);
                }
            }
        }
    };

    module.bookRenamer = {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'BOOK',
                filter: function (record) {
                    if(!settings.books_recipes) return false;
                    return xelib.HasElement(record, 'FULL') && !xelib.FullName(record).includes("Spell Tome");
                }
            }
        },
        patch: function (item, helpers, settings, locals) {
            let oldName = xelib.FullName(item).trim()
            let prefix = books.getBookPrefix(item, oldName, helpers, settings);

            if (xelib.EditorID(item) == "Book3ValuableChaurusPie") {
                return;
            }

            if (prefix == "fixSep") {
                fixSeperator(item, oldName, helpers, settings);
            }
            if (!isEmpty(prefix)) {
                // Remove suffix first (5th arg) on these. i.e.; "Potion Recipe" -> "Recipe: Potion"
                renamer(item, oldName, prefix, helpers, settings.books_movePrefix, settings);
                books.specialCases(item, oldName, helpers, settings);
            }
        }
    };

    module.soulGemRenamer = {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'SLGM',
                filter: function (record) {
                    return xelib.HasElement(record, 'FULL');
                }
            }
        },
        patch: function (item, helpers, settings, locals) {
            let edid = xelib.EditorID(item);
            let separator = settings.general_compiledSeparator;
            let prefix = settings.soulgems_prefixText;

            // Artifacts
            if (edid == "DA01SoulGemAzurasStar") {
                xelib.SetValue(item, 'FULL', prefix + separator + settings.soulgems_artifactText + "Azura's Star");
            }
            else if (edid == "DA01SoulGemBlackStar") {
                xelib.SetValue(item, 'FULL', prefix + separator + settings.soulgems_artifactText + "The Black Star");
            }

            // Also handle GIST soul gems
            if (edid.startsWith("SoulGemPetty") || edid.startsWith("ogsg_SoulGemPetty")) {
                xelib.SetValue(item, 'FULL', prefix + separator + settings.soulgems_pettyText);
            }
            else if (edid.startsWith("SoulGemLesser") || edid.startsWith("ogsg_SoulGemLesser")) {
                xelib.SetValue(item, 'FULL', prefix + separator + settings.soulgems_lesserText);
            }
            else if (edid.startsWith("SoulGemCommon") || edid.startsWith("ogsg_SoulGemCommon")) {
                xelib.SetValue(item, 'FULL', prefix + separator + settings.soulgems_commonText);
            }
            else if (edid.startsWith("SoulGemGreater") || edid.startsWith("ogsg_SoulGemGreater")) {
                xelib.SetValue(item, 'FULL', prefix + separator + settings.soulgems_greaterText);
            }
            else if (edid.startsWith("SoulGemGrand") || edid.startsWith("ogsg_SoulGemGrand")) {
                xelib.SetValue(item, 'FULL', prefix + separator + settings.soulgems_grandText);
            }
            else if (edid.startsWith("SoulGemBlack") || edid.startsWith("ogsg_SoulGemBlack")) {
                xelib.SetValue(item, 'FULL', prefix + separator + settings.soulgems_blackText);
            }
            if (edid.includes("Filled")) {
                let oldName = xelib.FullName(item);
                xelib.SetValue(item, 'FULL', oldName + settings.soulgems_filledText);
            }
        }
    };


    module.miscRenamer = {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'MISC',
                filter: function (record) {
                    return xelib.HasElement(record, 'FULL');
                }
            }
        },
        patch: function (item, helpers, settings, locals) {
            let oldName = xelib.FullName(item).trim()
            let prefix = misc.getMiscPrefix(item, oldName, helpers);
            if (!isEmpty(prefix)) {
                renamer(item, oldName, prefix, helpers, true, settings);
            }
        }
    };

    module.spellRenamer = {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'SPEL',
                filter: function (record) {
                    let spellDataHandle = xelib.GetElement(record, "SPIT");
                    return xelib.HasElement(record, 'FULL') &&
                        xelib.GetValue(spellDataHandle, "Base Cost") > 0 &&
                        !xelib.GetValue(spellDataHandle, "Half-cost Perk").startsWith("NULL");
                }
            }
        },
        patch: function (item, helpers, settings, locals) {
            let oldName = xelib.FullName(item).trim()
            let spellDataHandle = xelib.GetElement(item, "SPIT");
            let baseCost = xelib.GetValue(spellDataHandle, "Base Cost");
            let halfCostPerk = xelib.GetValue(spellDataHandle, "Half-cost Perk");

            helpers.logMessage("Spell: " + oldName + " - baseCost: " + baseCost + " - halfCostPerk: " + halfCostPerk);

            let prefix = spells.getSpellPrefix(item, oldName, helpers);
            if (!isEmpty(prefix)) {
                renamer(item, oldName, prefix, helpers, false, settings);
            }
        }
    };

    module.spellTomeRenamer = {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'BOOK',
                filter: function (record) {
                    return xelib.HasElement(record, 'FULL') &&
                        xelib.FullName(record).includes("Spell Tome") &&
                        xelib.HasKeyword(record, 'VendorItemSpellTome');
                }
            }
        },
        patch: function (item, helpers, settings, locals) {
            let oldName = xelib.FullName(item).trim()

            // Remove "Spell Tome: " from the name first, to reinsert later
            let regex = new RegExp("^Spell Tome: ");
            oldName = oldName.replace(regex, "");

            let prefix = spells.getSpellTomePrefix(item, oldName, helpers);
            if (!isEmpty(prefix)) {
                renamer(item, oldName, "Spell Tome - " + prefix, helpers, false, settings);
            }
        }
    };

    return module;
};

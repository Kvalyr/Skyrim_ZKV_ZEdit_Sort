function isEmpty(str) {
    return (!str || 0 === str.length);
};

const separator = ":"


const removeSuffix = function (oldName, suffix, helpers) {
    let regex = new RegExp(suffix + "$");
    let newName = oldName.replace(regex, "");
    return newName;
}


const renamer = function (item, oldName, prefix, helpers, removeSuffixFirst) {
    if (removeSuffixFirst) {
        oldName = removeSuffix(oldName, prefix);
    }
    let newName = prefix + separator + " " + oldName;
    helpers.logMessage("Changing weapon name from " + oldName + " to " + newName);
    xelib.SetValue(item, 'FULL', newName);
};


const fixSeperator = function (item, oldName, helpers) {
    // TODO: Something less hard-coded
    let needsFix = false;
    if (oldName.startsWith("Drink - ")) {  // Vitality mode
        needsFix = true;
    }
    if (oldName.startsWith("Recipe - ")) {
        needsFix = true;
    }

    let regex = /\s*-/gi;
    let newName = oldName.replace(regex, separator)

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

    module.weaponRenamer = {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'WEAP',
                filter: function (record) {
                    return xelib.HasElement(record, 'FULL');// && xelib.HasElement(record, 'KWDA');    // Has a display name and Keywords
                }
            }
        },
        patch: function (item, helpers, settings, locals) {
            let oldName = xelib.FullName(item)
            let prefix = weapons.getWeaponPrefix(item, oldName, helpers);
            if (!isEmpty(prefix)) {
                renamer(item, oldName, prefix, helpers);
            }
        }
    };

    module.armorRenamer = {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'ARMO',
                filter: function (record) {
                    return xelib.HasElement(record, 'FULL') && xelib.HasElement(record, 'KWDA');    // Has a display name and Keywords
                }
            }
        },
        patch: function (item, helpers, settings, locals) {
            let oldName = xelib.FullName(item)
            let prefix = armor.getArmorPrefix(item, oldName, helpers);
            if (!isEmpty(prefix)) {
                renamer(item, oldName, prefix, helpers);
            }
        }
    };

    module.ingestiblesRenamer = {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'ALCH',
                filter: function (record) {
                    return xelib.HasElement(record, 'FULL');    // Has a display name and Keywords
                }
            }
        },
        patch: function (item, helpers, settings, locals) {
            let oldName = xelib.FullName(item)
            let prefix = consumables.getIngestiblePrefix(item, oldName, helpers);
            if (prefix == "fixSep") {
                fixSeperator(item, oldName, helpers);
            }
            else if (!isEmpty(prefix)) {
                renamer(item, oldName, prefix, helpers);
            }
            // Fix classification of some drinks as Raw food by some mods (affects sorting in SkyUI)
            if (xelib.FullName(item).startsWith("Drink")){
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
                    return xelib.HasElement(record, 'FULL');    // Has a display name and Keywords
                }
            }
        },
        patch: function (item, helpers, settings, locals) {
            let oldName = xelib.FullName(item)

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
            if (specialCaseEDIDs.includes(xelib.EditorID(item))){
                ammo.specialCases(item, oldName, helpers, separator);
            }
            else{
                let prefix = ammo.getAmmoPrefix(item, oldName, helpers);
                if (!isEmpty(prefix)) {
                    // Remove suffix first (5th arg) on these. i.e.; "Ebony Arrow" -> "Arrow: Ebony"
                    renamer(item, oldName, prefix, helpers, true);
                }
            }
        }
    };

    module.bookRenamer = {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'BOOK',
                filter: function (record) {
                    return xelib.HasElement(record, 'FULL') && !xelib.FullName(record).includes("Spell Tome");    // Has a display name and Keywords
                }
            }
        },
        patch: function (item, helpers, settings, locals) {
            let oldName = xelib.FullName(item)
            let prefix = books.getBookPrefix(item, oldName, helpers);

            if(xelib.EditorID(item) == "Book3ValuableChaurusPie"){
                return;
            }

            if (prefix == "fixSep") {
                fixSeperator(item, oldName, helpers);
            }
            if (!isEmpty(prefix)) {
                // Remove suffix first (5th arg) on these. i.e.; "Potion Recipe" -> "Recipe: Potion"
                renamer(item, oldName, prefix, helpers, true);
                books.specialCases(item, oldName, helpers, separator);
            }
        }
    };

    module.soulGemRenamer = {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'SLGM',
                filter: function (record) {
                    return xelib.HasElement(record, 'FULL');    // Has a display name and Keywords
                }
            }
        },
        patch: function (item, helpers, settings, locals) {
            let oldName = xelib.FullName(item)
            let prefix = books.getBookPrefix(item, oldName, helpers);

            let edid = xelib.EditorID(item);

            // Also handle GIST soul gems
            if(edid.startsWith("SoulGemPetty") || edid.startsWith("ogsg_SoulGemPetty")){
                xelib.SetValue(item, 'FULL', "Soul Gem: I - Petty");
            }
            else if(edid.startsWith("SoulGemLesser") || edid.startsWith("ogsg_SoulGemLesser")){
                xelib.SetValue(item, 'FULL', "Soul Gem: II - Lesser");
            }
            else if(edid.startsWith("SoulGemCommon") || edid.startsWith("ogsg_SoulGemCommon")){
                xelib.SetValue(item, 'FULL', "Soul Gem: III - Common");
            }
            else if(edid.startsWith("SoulGemGreater") || edid.startsWith("ogsg_SoulGemGreater")){
                xelib.SetValue(item, 'FULL', "Soul Gem: IV - Greater");
            }
            else if(edid.startsWith("SoulGemGrand") || edid.startsWith("ogsg_SoulGemGrand")){
                xelib.SetValue(item, 'FULL', "Soul Gem: V - Grand");
            }
            else if(edid.startsWith("SoulGemBlack") || edid.startsWith("ogsg_SoulGemBlack")){
                xelib.SetValue(item, 'FULL', "Soul Gem: VI - Black");
            }
            if(edid.includes("Filled")){
                let oldName = xelib.FullName(item);
                xelib.SetValue(item, 'FULL', oldName + " [Filled]");
            }
        }
    };


    module.miscRenamer = {
        load: function (plugin, helpers, settings, locals) {
            return {
                signature: 'MISC',
                filter: function (record) {
                    return xelib.HasElement(record, 'FULL');// && xelib.HasElement(record, 'KWDA');    // Has a display name and Keywords
                }
            }
        },
        patch: function (item, helpers, settings, locals) {
            let oldName = xelib.FullName(item)
            let prefix = misc.getMiscPrefix(item, oldName, helpers);
            if (!isEmpty(prefix)) {
                renamer(item, oldName, prefix, helpers, true);
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
            let oldName = xelib.FullName(item)
            let spellDataHandle = xelib.GetElement(item, "SPIT");
            let baseCost = xelib.GetValue(spellDataHandle, "Base Cost");
            let halfCostPerk = xelib.GetValue(spellDataHandle, "Half-cost Perk");

            helpers.logMessage("Spell: " + oldName + " - baseCost: " + baseCost + " - halfCostPerk: " + halfCostPerk);

            let prefix = spells.getSpellPrefix(item, oldName, helpers);
            if (!isEmpty(prefix)) {
                renamer(item, oldName, prefix, helpers);
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
            let oldName = xelib.FullName(item)

            // Remove "Spell Tome: " from the name first, to reinsert later
            let regex = new RegExp("^Spell Tome: ");
            oldName = oldName.replace(regex, "");

            let prefix = spells.getSpellTomePrefix(item, oldName, helpers);
            if (!isEmpty(prefix)) {
                renamer(item, oldName, "Spell Tome - " + prefix, helpers);
            }
        }
    };

    return module;
};

function isEmpty(str) {
    return (!str || 0 === str.length);
};


const renamer = function (item, oldName, prefix, helpers) {
    let newName = prefix + oldName;
    helpers.logMessage("Changing weapon name from " + oldName + " to " + newName);
    xelib.SetValue(item, 'FULL', newName);
};

const fixSeperator = function (item, oldName, helpers){
    // TODO: Something less hard-coded
    let needsFix = false;
    if (oldName.startsWith("Drink - ")){  // Vitality mode
        needsFix = true;
    }

    let regex = /\s*-/gi;
    let newName = oldName.replace(regex, ':')

    helpers.logMessage("Fixing separator from " + oldName + " to " + newName);
    xelib.SetValue(item, 'FULL', newName);
};


module.exports = function (patcherPath) {
    let weapons = require(patcherPath + '\\src\\weapons.js');
    let armor = require(patcherPath + '\\src\\armor.js');
    let consumables = require(patcherPath + '\\src\\consumables.js');
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
                    return xelib.HasElement(record, 'FULL');// && xelib.HasElement(record, 'KWDA');    // Has a display name and Keywords
                }
            }
        },
        patch: function (item, helpers, settings, locals) {
            let oldName = xelib.FullName(item)
            let prefix = consumables.getIngestiblePrefix(item, oldName, helpers);
            if (prefix == "fixSep"){
                fixSeperator(item, oldName, helpers);
            }
            else if (!isEmpty(prefix)) {
                renamer(item, oldName, prefix, helpers);
            }
        }
    };

    return module;
};

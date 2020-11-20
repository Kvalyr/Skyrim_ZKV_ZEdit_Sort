function isEmpty(str) {
    return (!str || 0 === str.length);
};

const addClassJewelry = false;
const groupJewelry = false;
const jewelryClassInsteadOfSlot = false;
const unclassifeidStr = "UNCLASSIFIED";
const unknownSlotStr = "UNKNOWN_SLOT";

exports.getArmorPrefix = function (item, oldName, helpers) {
    let addSlot = true;
    let addClass = false;
    let prefix = unclassifeidStr;
    let armorClass = "";
    let armorSlot = "UNKNOWN_SLOT";
    // xelib.HasKeyword(item, keyword)
    // let keywords = getRecords(helpers, locals, 'KYWD');

    if (!addSlot && !addClass) {
        return "";
    }

    if (xelib.HasKeyword(item, 'NoCraftingExperience')) {
        // Skip CCOR crafting category items
        return "";
    }

    const clothingClass = "C"; //"Clothing";
    const jewelryClass = "J"; //"Clothing";
    const lightArmorClass = "L"; //"Clothing";
    const heavyArmorClass = "H"; //"Clothing";

    const headpieceSlotName = "Headpiece"; // "Circlet";
    const neckpieceSlotName = "Neck"; // "Circlet";

    // TODO: Replace this naive list of conditions on keywords with some kind of intelligent mapping

    // Main Classes
    if (xelib.HasKeyword(item, 'ArmorClothing')) {
        armorClass = clothingClass;
        if (xelib.HasKeyword(item, 'ClothingBody') && oldName.startsWith("Robes of")) {
            // Don't do "Robes: Robes of X"
            return "";
        }
    }
    else if (xelib.HasKeyword(item, 'ArmorJewelry')) {
        armorClass = jewelryClass; //"Jewelry";
        if (xelib.HasKeyword(item, 'ClothingRing') && oldName.startsWith("Ring of")) {
            // Don't do "Ring: Ring of X"
            return "";
        }
    }
    else if (xelib.HasKeyword(item, 'ArmorLight')) {
        armorClass = lightArmorClass; //"Light";
    }
    else if (xelib.HasKeyword(item, 'ArmorHeavy')) {
        armorClass = heavyArmorClass; //"Heavy";
    }

    // Pouches, Bandoliers, etc.
    if (xelib.HasKeyword(item, 'WAF_ClothingPouch') || xelib.HasKeyword(item, 'ClothingPouch')) {
        armorClass = "Pouch";
        armorSlot = "Pouch";
    }
    // Accessories (Eyepatch, etc.)
    if (xelib.HasKeyword(item, 'WAF_ClothingAccessories') || xelib.HasKeyword(item, 'ClothingAccessories')) {
        armorClass = "Accessory";
        armorSlot = "Accessory";
    }

    // Shields
    if (xelib.HasKeyword(item, 'ArmorShield')) {
        prefix = "Shield";
        armorClass = "Shield";
        armorSlot = "Shield";
    }

    // ==== Slots ====

    // Accessories (Eyepatch, etc.)
    if (xelib.HasKeyword(item, 'ClothingCloak') || xelib.HasKeyword(item, 'WAF_ClothingCloak')) {
        armorClass = "Cloak";
        armorSlot = "Cloak";
    }

    if (xelib.HasKeyword(item, 'ArmorHelmet') || xelib.HasKeyword(item, 'ClothingHead')) {
        armorSlot = "Helm";
    }

    if (xelib.HasKeyword(item, 'ClothingCirclet')) {
        armorClass = jewelryClass;
        armorSlot = headpieceSlotName;
    }

    if (xelib.HasKeyword(item, 'ArmorCuirass') || xelib.HasKeyword(item, 'ClothingBody')) {
        armorSlot = "Cuirass";
        if (armorClass === clothingClass) {
            if (oldName.includes("Robes")) {
                prefix = "Robes";
                armorClass = "Robes";
                armorSlot = "Robes";
            }
            else {
                prefix = "Clothes";
                armorClass = "Clothes";
                armorSlot = "Clothes";
            }
        }
    }

    if (xelib.HasKeyword(item, 'ArmorBoots') || xelib.HasKeyword(item, 'ClothingFeet')) {
        armorSlot = "Boots";
    }

    if (xelib.HasKeyword(item, 'ArmorGauntlets') || xelib.HasKeyword(item, 'ClothingHands')) {
        armorSlot = "Gloves";
    }

    if (armorClass === jewelryClass) {
        if (jewelryClassInsteadOfSlot) {
            armorClass = "Jewelry";
            armorSlot = "Jewelry";
            addSlot = true;
        }
        else {
            if (xelib.HasKeyword(item, 'ClothingRing')) {
                armorSlot = "Ring";
            }
            if (xelib.HasKeyword(item, 'ClothingCirclet')) {
                armorSlot = headpieceSlotName;
            }
            if (xelib.HasKeyword(item, 'ClothingNecklace')) {
                armorSlot = neckpieceSlotName;
            }
            // Don't add jewelry class "(J)"
            if (!addClassJewelry) {
                armorClass = "";
            }
            // Group all slots of jewelry as jewelry (ignoring the above setting if enabled)
            if (groupJewelry) {
                armorClass = "Jewelry - " + armorSlot;
            }
        }
    }

    if (armorSlot === unknownSlotStr) {
        return "";
    }

    if (isEmpty(armorClass) && !isEmpty(armorSlot)) {
        armorClass = armorSlot;
    }

    if (!addClass) {
        prefix = armorSlot;
    }
    else {
        if (!isEmpty(armorClass)) {
            if (armorClass === armorSlot) {
                //armorSlot = "";
                prefix = armorSlot;
            }
            else {
                if (addClass && addSlot && !isEmpty(armorSlot)) {
                    prefix = armorSlot + " (" + armorClass + ")";
                }
                else if (addClass) {
                    prefix = armorClass;
                }
            }
        }
    }

    if (oldName.startsWith(prefix + " of")) {
        // Last ditch to catch stuff like "Staff: Staff of Fury"
        return "";
    }

    // // If we can't determine the slot, don't make any changes
    // // if(isEmpty(armorSlot)){
    // if(armorSlot === "UNKNOWN_SLOT"){
    //     return "";
    // }

    return prefix;
}

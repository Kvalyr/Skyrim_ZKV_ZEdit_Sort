function isEmpty(str) {
    return (!str || 0 === str.length);
};


exports.getMiscPrefix = function (item, oldName, helpers) {
    let prefix = "";

    if (
        oldName == "Black Mage Focusing Gem" ||
        oldName.includes("Soul Gem") ||
        oldName.includes("Reaper Gem Fragment") ||
        xelib.EditorID(item) == "FFRiften14Ingot" ||
        xelib.EditorID(item) == "TGCrownGemInventory"
    ) {
        return "";
    }

    // TODO: Use patcher systemn's filter properly instead
    if (
        !(
            xelib.HasKeyword(item, 'VendorItemOreIngot') ||
            xelib.HasKeyword(item, 'VendorItemAnimalHide') ||
            xelib.HasKeyword(item, 'ArmorMaterialHide') ||
            xelib.HasKeyword(item, 'VendorItemGem') ||
            xelib.HasKeyword(item, 'VendorItemClutter')
        )
    ) {
        return "";
    }

    if (oldName.endsWith("Ingot")) {
        prefix = "Ingot";
    }
    else if (oldName.endsWith("Ore")) {
        prefix = "Ore";
    }
    else if (oldName.endsWith("Hide") || oldName.endsWith("Pelt") || xelib.EditorID(item) == "_Camp_CraftingPelt") {
        prefix = "Hide";
    }
    else if (xelib.HasKeyword(item, 'VendorItemGem')) {
        prefix = "Gem";
    }
    else if (xelib.EditorID(item) == "LeatherDark" || xelib.EditorID(item) == "LeatherRed") {
        prefix = "Leather";
    }
    else if (xelib.HasKeyword(item, 'VendorItemClutter')) {
        prefix = "Clutter";
    }

    if (oldName.startsWith(prefix + " of")) {
        // Last ditch to catch stuff like "Staff: Staff of Fury"
        return "";
    }

    return prefix;
}
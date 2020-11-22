function isEmpty(str) {
    return (!str || 0 === str.length);
};


exports.getMiscPrefix = function (item, oldName, helpers, settings) {
    let prefix = "";

    if (
        oldName == "Black Mage Focusing Gem" ||
        oldName.includes("Soul Gem") ||
        oldName.includes("Reaper Gem Fragment") ||
        xelib.EditorID(item) == "DA09Gem" ||
        xelib.EditorID(item) == "Gold001" ||    // Septim
        xelib.EditorID(item) == "Buckles" ||    // CCOR
        xelib.EditorID(item).startsWith("AP_Misc_PortalStone") ||   // Shalidor's Migrant Portals
        xelib.EditorID(item).startsWith("FFRiften") ||
        xelib.EditorID(item).startsWith("TG") ||    // Quest Items
        xelib.EditorID(item).startsWith("1Dr_BAN")  // Bandolier crafting parts
    ) {
        return "";
    }

    // TODO: Use patcher system's filter properly instead
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

    if (settings.misc_ingots && oldName.endsWith("Ingot")) {
        prefix = "Ingot";
    }
    else if (settings.misc_ore && oldName.endsWith("Ore")) {
        prefix = "Ore";
    }
    else if (settings.misc_hide && (oldName.endsWith("Hide") || oldName.endsWith("Pelt") || xelib.EditorID(item) == "_Camp_CraftingPelt")) {
        prefix = "Hide";
    }
    else if (settings.misc_gems && xelib.HasKeyword(item, 'VendorItemGem')) {
        prefix = "Gem";
    }
    else if (settings.misc_leather && (xelib.EditorID(item) == "LeatherDark" || xelib.EditorID(item) == "LeatherRed")) {
        prefix = "Leather";
    }
    else if (settings.misc_clutter && xelib.HasKeyword(item, 'VendorItemClutter')) {
        prefix = "Clutter";
    }

    if (oldName.startsWith(prefix)) {
        return "";
    }

    return prefix;
}

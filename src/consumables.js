function isEmpty(str) {
    return (!str || 0 === str.length);
};


exports.getIngestiblePrefix = function (item, oldName, helpers) {
    let separator = ": ";

    if (oldName.startsWith("Drink -") || oldName.startsWith("Food -")){
        // Early return to prevent hassle from mis-classified items in VitalityMode
        return "fixSep";
    }

    if (xelib.HasKeyword(item, 'VendorItemPotion')) {
        prefix = "Potion";
    }
    if (xelib.HasKeyword(item, 'VendorItemPoison')) {
        prefix = "Poison";
    }
    if (xelib.HasKeyword(item, 'VendorItemFood')) {
        prefix = "Food";
        let pickupSound = xelib.GetValue(item, 'YNAM');
        if (pickupSound == 'ITMPotionUpSD [SNDR:0003EDBD]') {
            prefix = "Drink";
        }
    }
    if (xelib.HasKeyword(item, 'VendorItemFoodRaw')) {
        prefix = "Raw";
    }

    if (oldName.startsWith(prefix + " of")) {
        // Last ditch to catch stuff like "Staff: Staff of Fury"
        return "";
    }

    return prefix + separator;
}

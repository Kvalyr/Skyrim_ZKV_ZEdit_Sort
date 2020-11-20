function isEmpty(str) {
    return (!str || 0 === str.length);
};


exports.getIngestiblePrefix = function (item, oldName, helpers, settings) {
    let prefix = "";
    if (oldName.startsWith("Drink -") || oldName.startsWith("Food -")) {
        // Early return to prevent hassle from mis-classified items in VitalityMode
        return "fixSep";
    }

    if (settings.consumables_potionsEnable && xelib.HasKeyword(item, 'VendorItemPotion')) {
        prefix = settings.consumables_potionsText;
    }

    if (settings.consumables_poisonsEnable && xelib.HasKeyword(item, 'VendorItemPoison')) {
        prefix = settings.consumables_poisonsText;
    }

    if (settings.consumables_cookedFoodEnable && xelib.HasKeyword(item, 'VendorItemFood')) {
        prefix = settings.consumables_cookedFoodText;
        if(settings.consumables_identifyDrinks){
            let pickupSound = xelib.GetValue(item, 'YNAM');
            if (pickupSound == 'ITMPotionUpSD [SNDR:0003EDBD]' || pickupSound == 'ITMIngredientBowlUp [SNDR:000FC21F]') {
                prefix = "Drink";
            }
        }
    }

    if (settings.consumables_rawFoodEnable && xelib.HasKeyword(item, 'VendorItemFoodRaw')) {
        prefix = settings.consumables_rawFoodText;
        if(settings.consumables_identifyDrinks){
            let pickupSound = xelib.GetValue(item, 'YNAM');
            if (pickupSound == 'ITMPotionUpSD [SNDR:0003EDBD]' || pickupSound == 'ITMIngredientBowlUp [SNDR:000FC21F]') {
                prefix = "Drink";
            }
        }
    }

    if (oldName.startsWith(prefix + " of")) {
        // Last ditch to catch stuff like "Staff: Staff of Fury"
        return "";
    }

    return prefix;
}

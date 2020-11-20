// let init = require(patcherPath + '\\src\\init.js')(patcherPath, fh);
let patcher = require(patcherPath + '\\src\\patcher.js')(patcherPath);

/* global ngapp, xelib */
registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
        label: 'ZKV_Sort Settings',
        templateUrl: `${patcherUrl}/partials/settings.html`,
        defaultSettings: {
            patchFileName: 'ZKV_Sort.esp',

            general_separator: ":",
            general_spaceBeforeSeparator: false,
            general_spaceAfterSeparator: true,

            weapons_enable: true,
            weapons_handedness: true,
            weapons_oneHandText: "[1h]",
            weapons_twoHandText: "[2h]",
            weapons_handednessAfter: true,
            weapons_movePrefix: false,

            weapons_1hSwordText: "Sword",
            weapons_2hSwordText: "Sword",
            weapons_1hAxeText: "Axe",
            weapons_2hAxeText: "Axe",
            weapons_1hHammerText: "Mace",
            weapons_2hHammerText: "Warhammer",
            weapons_DaggerText: "Dagger",
            weapons_BowText: "Bow",
            weapons_CrossbowText: "Crossbow",
            weapons_StaffText: "Staff",

            armor_enable: true,
            // armor_addSlot: true,
            // armor_addClass: false,
            armor_addClothingClass: false,
            armor_clothingClassText: "[C]",
            armor_addJewelryClass: false,
            armor_jewelryClassText: "[J]",
            armor_addLightClass: false,
            armor_lightClassText: "[L]",
            armor_addHeavyClass: false,
            armor_heavyClassText: "[H]",
            armor_jewelryClassInsteadOfSlot: false,

            books_recipes: true,
            books_recipeText: "Recipe",
            books_movePrefix: true,

            ammo_enable: true,
            ammo_arrowText: "Arrow",
            ammo_boltText: "Bolt",
            ammo_movePrefix: true,

            consumables_potionsEnable: true,
            consumables_potionsText: "Potion",
            consumables_poisonsEnable: true,
            consumables_poisonsText: "Poison",
            consumables_cookedFoodEnable: true,
            consumables_cookedFoodText: "Food",
            consumables_rawFoodEnable: true,
            consumables_rawFoodText: "Raw",
            consumables_identifyDrinks: true,

            spells_enable: true,
            spells_addMasteryLevel: true,
            spells_noviceText: "I",
            spells_apprenticeText: "II",
            spells_adeptText: "III",
            spells_expertText: "IV",
            spells_masterText: "V",
            spells_addSchoolToTomes: true,

            soulgems_enable: true,
            soulgems_prefixText: "Soul Gem",
            soulgems_filledText: " [Filled]",
            soulgems_pettyText: " I - Petty",
            soulgems_lesserText: " II - Lesser",
            soulgems_commonText: " III - Common",
            soulgems_greaterText: " IV - Greater",
            soulgems_grandText: " V - Grand",
            soulgems_blackText: " VI - Black",
            soulgems_artifactText: " X - ",

            misc_enable: true,
            misc_ore: true,
            misc_ingots: true,
            misc_hide: true,
            misc_leather: true,
            misc_gems: true,
            misc_clutter: true,
        },
    },
    execute: (patchFile, helpers, settings, locals) => ({
        initialize: function () {
            patcher.init(patchFile, helpers, settings, locals);
        },
        process: [
            // patcher.debug,
            patcher.armorRenamer,
            patcher.weaponRenamer,
            patcher.ingestiblesRenamer,
            patcher.ammoRenamer,
            patcher.bookRenamer,
            patcher.soulGemRenamer,
            patcher.spellRenamer,
            patcher.spellTomeRenamer,
            patcher.miscRenamer,
        ],
    })
});

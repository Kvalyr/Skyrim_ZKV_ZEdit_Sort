let patcher = require(patcherPath + '\\src\\patcher.js')(patcherPath);

/* global ngapp, xelib, registerPatcher */
registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
        label: 'Dynamic Item Sort Patcher',
        hide: false,
        defaultSettings: {
            patchFileName: 'ZKV_ZEdit_Sort.esp',
        },
    },
    execute: (patchFile, helpers, settings, locals) => ({
        // initialize: function () {
        //     // locals.potion_keyword = xelib.GetHexFormID(xelib.GetElement(0, 'Skyrim.esm\\KYWD\\VendorItemPotion'));
        //     // locals.poison_keyword = xelib.GetHexFormID(xelib.GetElement(0, 'Skyrim.esm\\KYWD\\VendorItemPoison'));
        // },
        process: [
            // patcher.armorRenamer,
            // patcher.weaponRenamer,
            patcher.ingestiblesRenamer

            // projectile (arrow/bolt)
            // soul gem (size, empty/full, soul-size)
            // spell (school, level)
            // ingredient
        ],
        finalize: function () {
            let diff = new Date() - locals.date;
            let seconds = Math.round(diff / 1000);
            let minutes = Math.floor(seconds / 60);
            helpers.logMessage('Elapsed minutes:' + minutes);
            helpers.logMessage('Elapsed seconds:' + (seconds - (minutes * 60)));
        }
    })
});

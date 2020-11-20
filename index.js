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
        },
    },
    execute: (patchFile, helpers, settings, locals) => ({
        process: [
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

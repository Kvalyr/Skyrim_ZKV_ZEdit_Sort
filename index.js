let patcher = require(patcherPath + '\\src\\patcher.js')(patcherPath);

/* global ngapp, xelib */
registerPatcher({
    info: info,
    gameModes: [xelib.gmTES5, xelib.gmSSE],
    settings: {
        label: 'ZKV_Sort Settings',
        templateUrl: `${patcherUrl}/partials/settings.html`,
        defaultSettings: {
            patchFileName: 'ZKV_ZEdit_Sort.esp',
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
        finalize: function () {
            let diff = new Date() - locals.date;
            let seconds = Math.round(diff / 1000);
            let minutes = Math.floor(seconds / 60);
            helpers.logMessage('Elapsed minutes:' + minutes);
            helpers.logMessage('Elapsed seconds:' + (seconds - (minutes * 60)));
        }
    })
});

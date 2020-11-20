# ZKV_ZEdit_Sort

A Skyrim zEdit patcher that creates a plugin file from loaded plugins with record names (items, spells, etc.) modified for sorting in the inventory.
For example, the spell `Flames` can become `Destruction I: Flames`; or `Iron Sword` will be renamed to `Sword (1h): Iron`.

This produces a result similar to popular sorting mods such as [Valdacil's Item Sorting](https://www.nexusmods.com/skyrimspecialedition/mods/5224) with the massive advantage of not requiring a multitude of patches to account for any other mod that adds or changes items.

This patcher was inspired by _EQLIBRIIM's_ [SORT](https://www.nexusmods.com/skyrimspecialedition/mods/13622) patcher, but uses heuristics (such as analyzing the keywords or names of records) instead of working from a list of known records, meaning that unlike _SORT_, this patcher doesn't need updates to make it aware of other mods. It should work with almost any mod.

Requires the latest [zEdit](https://github.com/z-edit/zedit) release

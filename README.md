# ZKV_Sort

A Skyrim zEdit patcher that creates a plugin file from loaded plugins with record names (items, spells, etc.) modified for sorting in the inventory.
For example, the spell `Flames` can become `Destruction I: Flames`; or `Iron Sword` will be renamed to `Sword (1h): Iron`.

This produces a result similar to popular sorting mods such as [Valdacil's Item Sorting](https://www.nexusmods.com/skyrimspecialedition/mods/5224) or _Zhior's_ [Enhanced Better Sorting](https://www.nexusmods.com/skyrim/mods/66797/?) with the major advantage of not requiring a multitude of patches to account for any other mod that adds or changes items.

As long as your load-order is set up correctly for the game, this patcher will produce a plugin that incorporates the changes for all loaded mods correctly while also renaming objects appropriately for sorting. If you add or remove mods, just run the patcher again to regenerate its plugin and it will adapt accordingly.

This patcher was inspired by _EQLIBRIIM's_ [SORT](https://www.nexusmods.com/skyrimspecialedition/mods/13622) patcher, but uses heuristics (such as analyzing the keywords or names of records) instead of working from a JSON list of known records, meaning that unlike _SORT_, this patcher doesn't need updates to make it aware of other mods. It should work with almost any mod.

Requires the latest release of the excellent [zEdit](https://github.com/z-edit/zedit) by _Mator_; without which this patcher would not be possible

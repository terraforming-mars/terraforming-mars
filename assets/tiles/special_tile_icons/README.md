# Special tile icons

This directory holds the overlay images drawn on top of the special tiles
(rendered on cards via the `.card-tile-symbol-*` rules.)

Every image in this directory must be **152×152**, with the glyph centered on a
transparent canvas. Keeping the canvas size and centering consistent lets a
simple CSS rule align them all, instead of per-icon offset tweaks.

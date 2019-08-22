# bem-icomoon

[![Build Status](https://travis-ci.org/b1tc0re/bem-icomoon.svg?branch=master)](https://travis-ci.org/b1tc0re/bem-icomoon)
![](https://david-dm.org/b1tc0re/bem-icomoon.svg)

[IcoMoon](https://icomoon.io) icons extracted as SVG in BEM notation.

**Be careful in the icomoon folder contains files from my old project and I do not remember under what license they are distributed !!!**

## Content

The library provides two modifiers for each icon:
* `bg` to use SVG as background image
* `glyph` to use inline SVG via templates (BEMHTML, BH, BHPHP)

```
icon/
    _bg/
        icon_bg_accessibility.css
        icon_accessibility.svg
        icon_bg_add.css
        icon_bg_add.svg
        # and so on
    _glyph/
        icon_glyph_accessibility.bemhtml.js
        icon_glyph_accessibility.bh.js
        icon_glyph_accessibility.bh.php
        icon_glyph_add.bemhtml.js
        icon_glyph_add.bh.js
        icon_glyph_add.bh.php
        # and so on
```

## Installation

1. Add the library to project dependencies:
    ```
    npm i bem-icomoon --save
    ```
2. Add it as [redefinition level](https://en.bem.info/methodology/key-concepts/#redefinition-level)

3. If you don't use [bem-components](https://en.bem.info/platform/libs/bem-components/) with `icon` block please add `icon.css` with something like this:

```css
.icon {
    display: inline-block;
    text-align: center;
    background: 50% no-repeat;
}

/* Hack for correct baseline positioning */
.icon:empty:after {
    visibility: hidden;
    content: '\00A0';
}

.icon > img,
.icon > svg {
    margin: -5.15em 0 -5em; /* 0.15 — magic number, empirically found */
    vertical-align: middle;
}
```

You're done :)

## Usage

### BEMJSON
```js
{ block: 'icon', mods: { bg: 'accessibility' } }
{ block: 'icon', mods: { glyph: 'accessibility' } } // style regular

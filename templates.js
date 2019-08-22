module.exports = {

    mod : null,

    /**
     * Initialize the template builder
     * @param mod block mod name
     */
    initialize : function(mod) {
        this.mod = mod || 'glyph';
        return this;
    },

    /**
     * Build bemhtml template
     * @param modVal
     * @param svg
     * @return {string}
     */
    bemhtml : function (modVal, svg) {
        return `block('icon').mod('${this.mod}', '${modVal}').content()({
            html: '${svg}'
        });\n`
    },

    /**
     * Build BH JS template
     * @param modVal
     * @param svg
     * @return {string}
     */
    bhJs : function (modVal, svg) {
        return `module.exports = function(bh) {
                    bh.match('icon_${this.mod}_${modVal}', function(ctx) {
                        ctx.content({
                            html: '${svg}',
                            tag: false
                        });
                    });
        };\n`
    },

    /**
     * Build BG PHP template
     * @param modVal
     * @param svg
     * @return {string}
     */
    bhPhp : function (modVal, svg) {
        return `<?php
return function($bh) {
    $bh->match('icon_${this.mod}_${modVal}', function ($ctx) {
        $ctx.content({
            html: '${svg}',
            tag: false
        });
    });
};`;
    }

};
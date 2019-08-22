const PATH = require('path'),
    FS = require('fs'),
    postcss = require('postcss'),
    TPL = require('./templates'),
    fontBlast = require('font-blast'),
    mv = require('mv'),
    selectorRegexp = /\.icon\-(.+)\:before/;


module.exports = {

    /**
     * Путь к папке с файлами icomoon
     */
    icomoonSource : 'icomoon',

    /**
     * Стили icomoon
     */
    icomoonCssContent : '',

    /**
     * Block name
     */
    block       : 'icon',

    /**
     * Block mod glyph
     */
    glyph       : 'glyph',

    /**
     * Block mod background with style
     */
    background  : 'bg',


    glyphToEntityMap: {},
    entityToGlyphMap: {},

    /**
     * Initialize
     */
    initialize: function () {
        this.icomoonCssContent = FS.readFileSync(PATH.join(this.icomoonSource, 'styles.min.css'), 'utf8');
        this.createBlockStructure().build();
    },

    /**
     * Создать структуру папок для блока
     * @return this
     */
    createBlockStructure: function () {

        FS.existsSync(this.block) || FS.mkdirSync(this.block);

        // Create glyph mod
        if (!FS.existsSync(PATH.join(this.block, '_' + this.glyph))) {
            FS.mkdirSync(PATH.join(this.block, '_' + this.glyph));
        }

        // Create background mod
        if (!FS.existsSync(PATH.join(this.block, '_' + this.background))) {
            FS.mkdirSync(PATH.join(this.block, '_' + this.background));
        }

        return this;
    },

    /**
     * Собрать блок icon
     */
    build : function() {
        postcss([this.getPostcssPlugin()]).process(this.icomoonCssContent).then(result => {

            fontBlast(PATH.join(this.icomoonSource, 'fonts', 'icomoon.svg'), 'tmp', { filenames: this.glyphToEntityMap }).then((x,s) => {

                const readGlyphs = {};

                Promise.all(Object.keys(this.entityToGlyphMap).map( entity => {

                    const glyphId  = this.entityToGlyphMap[entity];
                    const filename = this.glyphToEntityMap[glyphId] + '.svg';
                    const modVal = entity.split('_').pop();
                    const svgContent = readGlyphs[filename] || (readGlyphs[filename] = FS.readFileSync(PATH.join('tmp', 'svg', filename), 'utf8'));
                    const path = PATH.join(this.block, '_' + this.glyph, this.block + '_' + this.glyph + '_' + modVal);

                    FS.writeFileSync(path + '.bemhtml.js' , TPL.initialize(this.glyph).bemhtml(modVal, svgContent));
                    FS.writeFileSync(path + '.bh.js' , TPL.initialize(this.glyph).bhJs(modVal, svgContent));
                    FS.writeFileSync(path + '.bh.php' , TPL.initialize(this.glyph).bhPhp(modVal, svgContent));

                    return mv(PATH.join('tmp', 'svg', filename), PATH.join(__dirname, this.block, '_' + this.background, filename), err => {
                        if (err && err.code !== 'ENOENT') console.error(err);
                    });
                }));
            });
        });
    },

    /**
     * Создать файлы со стилями для каждой иконки
     * @return {postcss.Plugin<>}
     */
    getPostcssPlugin: function() {
        return postcss.plugin('icomoon', (options) => {

            return (css) => css.walkRules((rule) => {
                const selectors = rule.selector.split(',');
                let firstParsedModVal;

                selectors.forEach(selector => {
                    const parsedSelector = selectorRegexp.exec(selector);

                    if (!parsedSelector) return;
                    const modVal = parsedSelector[1];

                    firstParsedModVal || (firstParsedModVal = modVal);

                    const styleArr = [
                        '.' + this.block + '_' + this.background + '_' + modVal + ' {\n'
                    ];

                    rule.walkDecls((decl, i) => {
                        const glyphId = decl.value.slice(2, decl.value.length - 1);

                        this.glyphToEntityMap[glyphId] = this.block + '_' + firstParsedModVal;
                        this.entityToGlyphMap[this.block + '_' + this.background + '_' + modVal] = glyphId;

                        styleArr.push(decl.raws.before + "\t" + 'background-image: url(' + this.block + '_' + firstParsedModVal + '.svg);');
                    });

                    styleArr.push('\n}');

                    FS.writeFileSync(PATH.join(this.block, '_' + this.background, this.block + '_' + this.background + '_' + modVal + '.css'), styleArr.join(''));
                });
            });
        });
    },
};
var RTFcolors  = {
    aqua:    { order: 1,  red: 0,   green: 255, blue: 255 },
    black:   { order: 2,  red: 0,   green: 0,   blue: 0 },
    blue:    { order: 3,  red: 0,   green: 0,   blue: 255 },
    fushsia: { order: 4,  red: 255, green: 0,   blue: 255 },
    gray:    { order: 5,  red: 80,  green: 80,  blue: 80 },
    green:   { order: 6,  red: 0,   green: 80,  blue: 0 },
    lime:    { order: 7,  red: 0,   green: 255, blue: 0 },
    navy:    { order: 8,  red: 0,   green: 0,   blue: 80 },
    olive:   { order: 9,  red: 128, green: 128, blue: 0 },
    purple:  { order: 10, red: 80,  green: 0,   blue: 80 },
    red:     { order: 11, red: 255, green: 0,   blue: 0 },
    silver:  { order: 12, red: 192, green: 192, blue: 192 },
    teal:    { order: 13, red: 0,   green: 128, blue: 128 },
    white:   { order: 14, red: 255, green: 255, blue: 255 },
    yellow:  { order: 15, red: 255, green: 255, blue: 0 }
};
    
/**
 * Create rtf files with pure js
 */
class RTF {
    
    control = {
        paragraphIni:  "{\\pard ",
        paragraphEnd:  "\\par}",
        newLine:       "\\line ",
        bold:          "\\b ",
        underline:     "\\ul ",
        italic:        "\\i ",
        center:        "\\qc ",
        right:         "\\qr ",
        justify:       "\\qj ",
        strike:        "\\strike ",
        tabsDef1:      "\\li600\\ri0\\lin600\\rin0\\fi-600 ",
        tabsDef2:      "\\li1200\\ri0\\lin1200\\rin0\\fi-1200 ",
        tab:           "\\tab "
    };

    content = '';
    fonts   = [];
    colors  = {};
    footer  = '';
    numberPage = '#page#';

    /**
     * 
     */
    constructor() {
        this.content = '';
    }
    
    /**
     * Example: Times New Roman
     */
    addFont( n_, type_ ){
        this.fonts[ this.fonts.length ] = { order: n_, type: type_ };
    }
    
    /**
     * o_ is one object RTFText, or Array of objects RTFText
     */
    addParagraph( o_ ) {
        var t = '';
        if (Array.isArray( o_ )){
            o_.forEach( function( o2 ) {
                t += o2.text;
            });
        } else {
            t = o_.text;
        }
        this.content += this.control.paragraphIni + t + this.control.paragraphEnd;
    }
    
    /**
     * 
     */
    addFooter( f_ ){
        this.footer = f_;
    }
    
    /**
     * 
     */
    generate(){
        var fonts = '';
        if (this.fonts.length > 0){
            this.fonts.forEach(function(f, i){
                fonts += "{\\f" + f.order + " " + f.type + ";}";
            });
            fonts = "{\\fonttbl " + fonts + "}";
        }
        var colors = "";
        for(var prop in RTFcolors ){
            colors += "\\red" + RTFcolors[ prop ].red
                + "\\green"   + RTFcolors[ prop ].green
                + "\\blue"    + RTFcolors[ prop ].blue
                + ";"
            ;
        }
        colors = "{\\colortbl;" + colors + "}";
        
        if (this.footer != ''){
            var f = '';
            var rtf = this;
            ['left', 'center', 'right'].forEach(function( mode ){
                if (typeof rtf.footer[ mode ] != 'undefined'){
                    f += (rtf.footer[ mode ] == rtf.numberPage ? "\\chpgn" : this.specialChars(rtf.footer[mode]));
                }
                if (mode != 'right'){
                    f += rtf.control.tab;
                }
            });
            this.footer = "{\\footer\\pard\\plain \\widctlpar\\tqc\\tx4000\\tqr\\tx9638"
                + f + "\\par}";
        }
        
        var rtf = "{\\rtf1\\paperh16838\\paperw11906\\ansi\\deff0\\ftnbj\\ftnnar \\margl1985\\margr1416\\margt2552\\margb1140\\deflang1033"
            + colors
            + fonts
            + this.footer
            //+ "{\\header\\pard\\sb300\\fi-993 " + logo + "\\line\\par}" //espacio en cabecera before sb, after sa
            + "{\\*\\ftnsep\\chftnsep}"
            + "\\pgndec\\pard\\plain \\s0\\widctlpar\\hyphpar0\\cf0\\kerning1\\dbch\\af5\\langfe2052\\dbch\\af6\\afs24\\alang1081\\loch\\f3\\hich\\af3\\fs24\\lang3082"
            + this.specialChars(this.content)
            + "}"
        ;
        this.download( rtf, 'fichero' + '.rtf', 'rtf');
    }
    
    /**
     * download data to a file
     */
    download(data, filename, type) {
        var file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else {
            var a = document.createElement("a"), url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }
    
    /**
     * 
     */
    specialChars( t ){
        return t
            .replace(/ª/g, "\\u170\\'aa")
            .replace(/º/g, "\\u186\\'ba")
            .replace(/¿/g, "\\u191\\'be")
            .replace(/À/g, "\\u192\\'c0")
            .replace(/Á/g, "\\u193\\'c1")
            .replace(/Â/g, "\\u194\\'c2")
            .replace(/Ä/g, "\\u196\\'c4")
            .replace(/Ç/g, "\\u199\\'c7")
            .replace(/È/g, "\\u200\\'c8")
            .replace(/É/g, "\\u201\\'c9")
            .replace(/Ê/g, "\\u202\\'ca")
            .replace(/Ë/g, "\\u203\\'cb")
            .replace(/Ì/g, "\\u204\\'cc")
            .replace(/Í/g, "\\u205\\'cd")
            .replace(/Î/g, "\\u206\\'ce")
            .replace(/Ï/g, "\\u206\\'cf")
            .replace(/Ñ/g, "\\u209\\'d1")
            .replace(/Ò/g, "\\u210\\'d2")
            .replace(/Ó/g, "\\u211\\'d3")
            .replace(/Ô/g, "\\u212\\'d4")
            .replace(/Ö/g, "\\u214\\'d6")
            .replace(/Ù/g, "\\u217\\'d9")
            .replace(/Ú/g, "\\u218\\'da")
            .replace(/Û/g, "\\u219\\'db")
            .replace(/Ü/g, "\\u220\\'dc")
            .replace(/à/g, "\\u224\\'e0")
            .replace(/á/g, "\\u225\\'e1")
            .replace(/â/g, "\\u226\\'e2")
            .replace(/ä/g, "\\u228\\'e4")
            .replace(/ç/g, "\\u231\\'e7")
            .replace(/è/g, "\\u232\\'e8")
            .replace(/é/g, "\\u233\\'e9")
            .replace(/ê/g, "\\u234\\'ea")
            .replace(/ë/g, "\\u235\\'eb")
            .replace(/ì/g, "\\u236\\'ec")
            .replace(/í/g, "\\u237\\'ed")
            .replace(/î/g, "\\u238\\'ee")
            .replace(/ï/g, "\\u239\\'ef")
            .replace(/ñ/g, "\\u241\\'f1")
            .replace(/ò/g, "\\u242\\'f2")
            .replace(/ó/g, "\\u243\\'f3")
            .replace(/ô/g, "\\u244\\'f4")
            .replace(/ö/g, "\\u246\\'f6")
            .replace(/ù/g, "\\u249\\'f9")
            .replace(/ú/g, "\\u250\\'fa")
            .replace(/û/g, "\\u251\\'fb")
            .replace(/ü/g, "\\u252\\'fc")
            .replace(/–/g, "\\u8211\\'96")
        ;
}

}

/**
 * 
 */
class RTFText {
 
    control = {
        bold:          "\\b ",
        underline:     "\\ul ",
        italic:        "\\i ",
        center:        "\\qc ",
        right:         "\\qr ",
        justify:       "\\qj ",
        strike:        "\\strike ",
        color:         "\\cf",
        bgColor:       "\\highlight",
        font:          "\\f",
        fontSize:      "\\fs",
        newLine:       "\\line ",
        spaceBefore:   "\\sb"
    };

    text = '';
    
    /**
     * 
     */
    constructor( t_ ) {
        this.text = t_;
    }
    
    /**
     * 
     */
    font( n_ ){
        this.text = this.control.font + n_ + " " + this.text;
    }
    
    /**
     * 
     */
    fontSize( n_ ){
        this.text = this.control.fontSize + n_ + " " + this.text;
    }
    
    /**
     * 
     */
    italic(){
        this.text = this.control.italic + this.text;
    }
    
    /**
     * 
     */
    bold(){
        this.text = this.control.bold + this.text;
    }
    
    /**
     * 
     */
    underline(){
        this.text = this.control.underline + this.text;
    }
    
    /**
     * 
     */
    strike(){
        this.text = this.control.strike + this.text;
    }
    
    /**
     * 
     */
    addLine( n_ ){
        if (typeof n_ == 'undefined'){
            n_ = 1;
        }
        for(var i = 0; i < n_; i++){
            this.text += this.control.newLine;
        }
    }
    
    /**
     * 
     */
    color( t_ ){
        if (typeof  RTFcolors[ t_ ] != 'undefined'){
            this.text = this.control.color + RTFcolors[ t_ ].order + " " + this.text;
        }
    }
    
    /**
     * 
     */
    bgColor( t_ ){
        if (typeof  RTFcolors[ t_ ] != 'undefined'){
            this.text = this.control.bgColor + RTFcolors[ t_ ].order + " " + this.text;
        }
    }
    
    /**
     * 
     */
    spaceBefore( n_ ){
        this.text = this.control.spaceBefore + n_ + " " + this.text;
    }

    /**
     * 
     */
    right( n_ ){
        this.text = this.control.right + " " + this.text;
    }
    
    /**
     * 
     */
    center( n_ ){
        this.text = this.control.center + " " + this.text;
    }
    
    /**
     * 
     */
    justify( n_ ){
        this.text = this.control.justify + " " + this.text;
    }
    
}

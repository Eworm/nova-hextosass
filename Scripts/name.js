const colors = require('colors.js'),
    convertToRgb = require('rgb.js'),
    convertToHsl = require('hsl.js');

const convert = (color) => {

    //
    color = color.toUpperCase();
    if (color.length < 3 || color.length > 7)
        return ["#000000", "Invalid Color: " + color, false];
    if (color.length % 3 == 0)
        color = "#" + color;
    if (color.length == 4)
        color = "#" + color.substr(1, 1) + color.substr(1, 1) + color.substr(2, 1) + color.substr(2, 1) + color.substr(3, 1) + color.substr(3, 1);

    //
    let rgb = convertToRgb.convert(color);
    let r = rgb[0],
        g = rgb[1],
        b = rgb[2];
    let hsl = convertToHsl.convert(color);
    let h = hsl[0],
        s = hsl[1],
        l = hsl[2];
    let ndf1 = 0;
    ndf2 = 0;
    ndf = 0;
    let cl = -1,
        df = -1;

    //
    for (let i = 0; i < colors.color_names.length; i++) {

        // If the actual color exists
        if (color == "#" + colors.color_names[i][0])
            return ["#" + colors.color_names[i][0], colors.color_names[i][1], true];

        //
        ndf1 = Math.pow(r - colors.color_names[i][2], 2) + Math.pow(g - colors.color_names[i][3], 2) + Math.pow(b - colors.color_names[i][4], 2);
        ndf2 = Math.pow(h - colors.color_names[i][5], 2) + Math.pow(s - colors.color_names[i][6], 2) + Math.pow(l - colors.color_names[i][7], 2);
        ndf = ndf1 + ndf2 * 2;

        //
        if (df < 0 || df > ndf) {
            df = ndf;
            cl = i;
        }

    }

    return (cl < 0 ? ["#000000", "Invalid Color: " + color, false] : ["#" + colors.color_names[cl][0], colors.color_names[cl][1], false]);

}

module.exports = { convert }

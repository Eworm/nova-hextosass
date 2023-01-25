const colors = require('colors.js'),
    convertToName = require('name.js'),
    convertToRgb = require('rgb.js'),
    convertToHsl = require('hsl.js');

// Invoked by the "Foobar" command
nova.commands.register("hex-to-sass.convertToSass", (editor) => {
    // Begin an edit session
    // var position = editor.selectedRange.start;
    var selectedRanges = editor.selectedRanges.reverse();
    editor.edit(function(e) {
        for (var range of selectedRanges) {

            var color, rgb, hsl;
            for (var i = 0; i < colors.color_names.length; i++) {
                color = "#" + colors.color_names[i][0];
                rgb = convertToRgb.convert(color);
                hsl = convertToHsl.convert(color);
                colors.color_names[i].push(rgb[0], rgb[1], rgb[2], hsl[0], hsl[1], hsl[2]);
            }

            // Get selection
            var text = editor.getTextInRange(range);

            //
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            // selection = selection.replace(shorthandRegex, function(m, r, g, b) {
            text = text.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });

            //
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(text);

            //
            var resultColor = [];

            if (result != null) {

                resultColor.push(
                    parseInt(result[1], 16),
                    parseInt(result[2], 16),
                    parseInt(result[3], 16)
                );

                // Determine if we're dealing with a grey or a color
                if (!!resultColor.reduce(function(a, b) {
                        return (a === b) ? a : NaN;
                    }) === true) {

                    // A gray
                    var grayPercentage = Math.floor(100 - (100 / 255) * resultColor[0]);

                    // Replace the selection with the correct variable
                    // editor.insertText('$color--gray-' + grayPercentage + ': #' + selection + ';')
                    e.replace(range, '$color--gray-' + grayPercentage + ': #' + text + ';');

                } else {

                    // A color
                    var n_match = convertToName.convert(text);
                    var name = n_match[1];

                    // Replace optional characters
                    name = name.replace(/#/g, '');
                    name = name.replace(" / ", "-");
                    name = name.replace(/ /g, '-');
                    name = name.toLowerCase();

                    // Replace the selection with the correct variable
                    // editor.insertText('$color--' + name + ': #' + selection + ';')
                    e.replace(range, '$color--' + name + ': #' + text + ';');

                }
            } else {

                // editor.insertText(selection + ' is not a hex color!')
                e.replace(range, range + ' is not a hex color!');

            }
        }
    });
});

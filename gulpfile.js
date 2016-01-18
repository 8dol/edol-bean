const gulp = require('gulp');
var parse = require('java-class-parser');
var fs = require('fs');

var baseDir = "/Users/frank/IdeaProjects/service/core/api/target/classes/com/edol/core/domain/box/";

var modalTemplate = "export class {0} { constructor({1}) {{2}}}";

fs.readdir(baseDir, function (err, files) {
    files = files.map(function (item) {
        return baseDir.concat(item);
    });

    parse(files, function (err, result) {

        if (result) {
            var modal = [];
            Object.keys(result).map(function (key) {
                var keyArrays = key.split('.');
                var str = modalTemplate.replace('{0}', keyArrays[keyArrays.length - 1]);
                var val = result[key];
                var args = [];
                var expression = [];
                if (val.methods && val.methods.length > 0) {
                    val.methods.filter(function (item) {
                        return item.name.indexOf('get') > -1;
                    }).forEach(function (item) {
                        var field = item.name.replace('get', '');
                        field = field.charAt(0).toLowerCase().concat(field.substr(1, field.length));
                        args.push(field);
                        expression.push('this.'.concat(field).concat('=').concat(field));
                    });
                }

                str = str.replace('{1}', args.join(','));
                str = str.replace('{2}', expression.join(';'));
                modal.push(str);
            });

            fs.writeFile('index.js', modal.join('\r\n'), function (err) {
                if (err) throw err;
                console.log('compiled done!');
            });
        }


    });

});
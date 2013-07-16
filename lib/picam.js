var format = require("util").format;
var exec   = require("child_process").exec;
var join   = require("path").join;

var PiCam = function(path, shortArgs) {
    var CMD = {
        PHOTO: "raspistill",
        VIDEO: "raspivid"
    };

    if (shortArgs === undefined && typeof path == "boolean") {
        shortArgs = path;
        path = null;
    }

    this.help = function(mode) {
        if (mode.toLowerCase() == "photo")
            mode = CMD.PHOTO;
        else if (mode.toLowerCase() == "video")
            mode = CMD.VIDEO;
        else
            return this;
        exec(format("%s --help", mode));
        return this;
    };

    var record = function(mode, opts) {
        if (mode != CMD.PHOTO && mode != CMD.VIDEO)
            throw format("unknown mode: '%s'", mode);
        
        opts = opts || {};
        var _path, name = opts.name;
        if (opts && typeof opts == "string") {
            name = opts;
            opts = {};
        }
        _path = opts.path || path;
        delete opts.path;
        delete opts.name;
        
        if (!name)
            name = format("img_%s.jpg", parseInt(Math.random() * 1000));
        
        var target = join(_path, name);
        var parts = [mode, format("-o %s -t 0", target)];
        var indicator = shortArgs ? "-" : "--";
        Object.keys(opts).forEach(function(key) {
            var value = opts[key];
            if (typeof value == "boolean") {
                if (value)
                    parts.push(format("%s%s", indicator, key));
            } else
                parts.push(format("%s%s %s", indicator, key, value));
        });
        var cmd = parts.join(" ");
        exec(cmd);
        return target;
    };

    this.photo = function() {
        var args = [].slice.call(arguments);
        args.unshift(CMD.PHOTO);
        record.apply(null, args);
        return this;
    };

    this.video = function() {
        var args = [].slice.call(arguments);
        args.unshift(CMD.VIDEO);
        record.apply(null, args);
        return this;
    };
};


module.exports = function(path, shortArgs) {
    var cam = new PiCam(path, shortArgs);
    this.__proto__ = cam;
    return cam;
};
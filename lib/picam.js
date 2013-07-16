var format = require("util").format;
var exec   = require("child_process").exec;

var PiCam = function(path, shortArgs) {
    var CMD = {
        PHOTO: "raspistill",
        VIDEO: "raspivid"
    };

    if (shortArgs === undefined && path instanceof Boolean) {
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
        
        if (opts && opts instanceof String) {
            var name = opts;
            opts = {name: name};
        } else {
            // TODO
        }
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


modul.exports = function(path, shortArgs) {
    var cam = new PiCam(path, shortArgs);
    this.__proto__ = cam;
    return cam;
};
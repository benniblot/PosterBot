"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var config_json_1 = require("../config.json");
module.exports = {
    name: 'ready',
    once: true,
    execute: function (client) {
        console.log("" + client.user.tag + ' Version ' + config_json_1.bot_info.version + ' started sucessfully!');
        client.user.setActivity("V" + config_json_1.bot_info.version, {
            type: discord_js_1.ActivityType.Playing,
        });
    },
};

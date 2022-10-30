"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var canvas_1 = require("canvas");
var number_to_words_1 = __importDefault(require("number-to-words"));
function getModal() {
    var modal = new discord_js_1.ModalBuilder()
        .setCustomId('posterModal')
        .setTitle('Poster Creator');
    var header = new discord_js_1.TextInputBuilder()
        .setCustomId('header')
        .setLabel("Header:")
        .setPlaceholder('Dickinson')
        .setStyle(discord_js_1.TextInputStyle.Short)
        .setRequired(true);
    var subText = new discord_js_1.TextInputBuilder()
        .setCustomId('subText')
        .setLabel("Sub-Text:")
        .setPlaceholder('Season 0')
        .setStyle(discord_js_1.TextInputStyle.Short)
        .setRequired(false);
    var headerRow = new discord_js_1.ActionRowBuilder().addComponents(header);
    var subTextRow = new discord_js_1.ActionRowBuilder().addComponents(subText);
    return modal.addComponents(headerRow, subTextRow);
}
module.exports = {
    data: new discord_js_1.ContextMenuCommandBuilder()
        .setName('createPoster')
        .setType(discord_js_1.ApplicationCommandType.Message),
    execute: function (interaction) {
        return __awaiter(this, void 0, void 0, function () {
            var message, textArray_1, name_1, seasonIndex_1, i, canvas, context, poster, vignette, frame, subText, testString, attachment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, interaction.deferReply()];
                    case 1:
                        _a.sent();
                        if (!(interaction.channel != undefined)) return [3, 6];
                        return [4, interaction.channel.messages.fetch(interaction.targetId)];
                    case 2:
                        message = (_a.sent()).attachments.first();
                        if (!(message != undefined)) return [3, 6];
                        if (message.name == undefined)
                            return [2];
                        textArray_1 = message.name.split('_');
                        name_1 = '';
                        seasonIndex_1 = 0;
                        textArray_1.forEach(function (element, index) {
                            if (element == '-') {
                                for (var i = 0; i < index - 1; i++) {
                                    name_1 += textArray_1[i] + " ";
                                }
                                name_1.trimEnd();
                                name_1 = name_1.toUpperCase();
                                seasonIndex_1 = index + 1;
                                return;
                            }
                        });
                        if (name_1 == '') {
                            for (i = 0; i < textArray_1.length - 1; i++) {
                                name_1 += textArray_1[i] + " ";
                            }
                            name_1 = name_1.trim();
                            name_1 = name_1.toUpperCase();
                        }
                        canvas = (0, canvas_1.createCanvas)(1000, 1500);
                        context = canvas.getContext('2d');
                        return [4, (0, canvas_1.loadImage)(message.url)];
                    case 3:
                        poster = _a.sent();
                        return [4, (0, canvas_1.loadImage)('assets/effects/vignette.png')];
                    case 4:
                        vignette = _a.sent();
                        return [4, (0, canvas_1.loadImage)('assets/effects/frame.png')];
                    case 5:
                        frame = _a.sent();
                        context.drawImage(poster, 0, 0, canvas.width, canvas.height);
                        context.drawImage(vignette, 0, 0, canvas.width, canvas.height);
                        context.drawImage(frame, 0, 0, canvas.width, canvas.height);
                        context.font = '76pt "Nunito Sans Black"';
                        context.fillStyle = '#ffffff';
                        context.textAlign = 'center';
                        context.fillText(name_1, canvas.width * 0.5, 1348.46, context.measureText(name_1).width - 80);
                        subText = '';
                        if (textArray_1[seasonIndex_1] == 'Season') {
                            context.font = '35pt "Nunito Sans Black"';
                            context.fillStyle = '#ffffff';
                            context.textAlign = 'center';
                            subText = ("Season " + number_to_words_1.default.toWords(textArray_1[seasonIndex_1 + 1].split('.')[0])).toUpperCase();
                            context.fillText(subText, canvas.width * 0.5, 1403.21, context.measureText(subText).width - 25);
                        }
                        testString = textArray_1[textArray_1.length - 1].split('.')[0];
                        if (testString == 'Collection' || testString == 'Specials') {
                            context.font = '35pt "Nunito Sans Black"';
                            context.fillStyle = '#ffffff';
                            context.textAlign = 'center';
                            subText = testString.toUpperCase();
                            context.fillText(subText, canvas.width * 0.5, 1403.21, context.measureText(subText).width - 25);
                        }
                        console.log(textArray_1);
                        console.log("Created Poster for: " + name_1 + " - " + subText);
                        attachment = new discord_js_1.AttachmentBuilder(canvas.toBuffer(), { name: message.name });
                        return [2, interaction.followUp({ files: [attachment] })];
                    case 6: return [2];
                }
            });
        });
    },
};

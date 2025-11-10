"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTheme = exports.getTheme = void 0;
const nedb_1 = __importDefault(require("nedb"));
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const userDataPath = electron_1.app.getPath('userData');
const db = new nedb_1.default({
    filename: path_1.default.join(userDataPath, 'theme.db'),
    autoload: true,
});
const getTheme = () => {
    return new Promise((resolve, reject) => {
        db.findOne({}, (err, doc) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(doc ? doc.theme : null);
            }
        });
    });
};
exports.getTheme = getTheme;
const setTheme = (theme) => {
    return new Promise((resolve, reject) => {
        db.update({}, { theme }, { upsert: true }, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
};
exports.setTheme = setTheme;

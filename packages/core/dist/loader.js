"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadWorld = loadWorld;
const fs_1 = require("fs");
const yaml_1 = require("yaml");
function loadWorld(filePath) {
    const raw = (0, fs_1.readFileSync)(filePath, "utf-8");
    const parsed = (0, yaml_1.parse)(raw);
    return parsed;
}
//# sourceMappingURL=loader.js.map
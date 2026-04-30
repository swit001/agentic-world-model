"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWorld = validateWorld;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({ allErrors: true });
const worldSchema = {
    type: "object",
    required: ["name", "version", "mission", "entities", "transitions", "verdicts", "audit"],
    properties: {
        name: { type: "string" },
        version: { type: "string" },
        mission: {
            type: "object",
            required: ["scope"],
            properties: {
                scope: { type: "string" },
            },
        },
        entities: {
            type: "object",
            additionalProperties: {
                type: "object",
                required: ["id", "states"],
                properties: {
                    id: { type: "string" },
                    states: { type: "array", items: { type: "string" }, minItems: 1 },
                },
            },
        },
        transitions: {
            type: "object",
            additionalProperties: {
                type: "object",
                required: ["entity", "from", "to", "trigger"],
                properties: {
                    entity: { type: "string" },
                    from: { type: "string" },
                    to: { type: "string" },
                    trigger: { type: "string" },
                    guards: {
                        type: "array",
                        items: {
                            type: "object",
                            required: ["id", "expression", "message"],
                            properties: {
                                id: { type: "string" },
                                expression: { type: "string" },
                                message: { type: "string" },
                            },
                        },
                    },
                },
            },
        },
        verdicts: {
            type: "object",
            required: ["allowed"],
            properties: {
                allowed: { type: "array", items: { type: "string" }, minItems: 1 },
            },
        },
        audit: {
            type: "object",
            required: ["events"],
            properties: {
                events: { type: "array", items: { type: "string" }, minItems: 1 },
            },
        },
    },
    additionalProperties: false,
};
const validate = ajv.compile(worldSchema);
function validateWorld(world) {
    const valid = validate(world);
    const schemaErrors = validate.errors
        ? validate.errors.map((e) => `${e.instancePath} ${e.message}`.trim())
        : [];
    const semanticErrors = [];
    if (valid || schemaErrors.length === 0) {
        for (const [transName, trans] of Object.entries(world.transitions)) {
            const entity = world.entities[trans.entity];
            if (!entity) {
                semanticErrors.push(`Transition "${transName}" references unknown entity "${trans.entity}"`);
                continue;
            }
            if (!entity.states.includes(trans.from)) {
                semanticErrors.push(`Transition "${transName}" has unknown from-state "${trans.from}" for entity "${trans.entity}"`);
            }
            if (!entity.states.includes(trans.to)) {
                semanticErrors.push(`Transition "${transName}" has unknown to-state "${trans.to}" for entity "${trans.entity}"`);
            }
        }
    }
    const allErrors = [...schemaErrors, ...semanticErrors];
    return { valid: allErrors.length === 0, errors: allErrors };
}
//# sourceMappingURL=validator.js.map
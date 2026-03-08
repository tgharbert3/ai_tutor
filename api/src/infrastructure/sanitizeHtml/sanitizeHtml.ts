import sanitizeHtml from "sanitize-html";

import type { ISanitizeHtml } from "../interfaces/sanitizeHtml/sanitizeHtml.interface.js";

export class SanitizeHtml implements ISanitizeHtml {
    constructor() {};

    sanitize(rawHtml: string) {
        return sanitizeHtml(rawHtml);
    }

    convertToPlainText(rawHtml: string) {
        return sanitizeHtml(rawHtml, {
            allowedAttributes: {},
            allowedTags: [],
        });
    }
}
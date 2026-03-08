export interface ISanitizeHtml {
    sanitize: (rawHtml: string) => string;
    convertToPlainText: (rawHtml: string) => string;
}
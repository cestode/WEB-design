export class ShortLinkModel
{
    constructor(originalUrl,shortUrl) {
        this.shortUrl = shortUrl;
        this.originalUrl = originalUrl;
    }
}
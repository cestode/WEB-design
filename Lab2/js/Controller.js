import { ShortLinkModel } from './Model.js';
import { ItemListView } from './ItemListView.js';

export class Controller {
    constructor(view) {
        console.assert(view instanceof ItemListView);
        this.linksArray = [];
        this.view = view;
        this.view.setController(this);
    }
    addLink(url) {
        this.linksArray.push(new ShortLinkModel(url,this.generateShortLink()));
        this.view.renderView(this.linksArray);
    }
    removeLink(id) {
        this.linksArray.splice(id,1);
        this.view.renderView(this.linksArray);
    }
    onUrlChanged(id,newUrl) {
            this.linksArray[id].originalUrl = newUrl;
            this.linksArray[id].shortUrl = this.generateShortLink(newUrl);
            this.view.renderView(this.linksArray);
    }
    generateShortLink() {
        var result = [];
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < 5; i++ ) {
            result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
        }
        return window.location.hostname + '/' + result.join('');
    }
}
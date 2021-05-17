import { Controller } from "./Controller.js";
import { ShortLinkModel } from './Model.js';
export class ItemView {
    constructor(id,data,controller) {
        console.assert(data instanceof ShortLinkModel);
        console.assert(controller instanceof Controller);
        this.rootElement = document.createElement('tr');
        this.id = id;
        this.url = data.originalUrl;
        this.shortUrl = data.shortUrl;
        this.controller = controller;
    }
    generateView() {
        this.rootElement.innerHTML = 
        `<td class="history-table-text-color"><input type="text" class="table-input-field" value = "${this.url}"></td>
         <td class="history-table-text-color"><input type="text" class="table-input-field" value="${this.shortUrl}"></td>
         <td class="fit"><button class="btn btn-outline-light rounded-pill" type="button"><img src="icons/history/trash.svg" alt=""></button></td>`;
        this.inputField =  this.rootElement.getElementsByTagName('input')[0];
        this.inputField.addEventListener('focusout',this.onFocusOut);
        this.rootElement.getElementsByTagName('button')[0].addEventListener('click',this.onDelete);
        return this.rootElement;
    }
    onDelete = ()=> this.controller.removeLink(this.id);
    onFocusOut = () => {
        this.controller.onUrlChanged(this.id,text);
    }
}
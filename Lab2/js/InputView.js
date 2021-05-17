import { Controller } from "./Controller.js";
export class VirtualItemView {

    constructor(controller) {
        console.assert(controller instanceof Controller);
        this.controller = controller;
        this.rootElement = document.createElement('tr');
    }
    generateView() {

        this.rootElement.innerHTML = 
        `<td class="history-table-text-color"><input type="text" class="table-input-field"></td>
         <td class="history-table-text-color"><input type="text" class="table-input-field"></td>
         <td class="fit"><button class="btn btn-outline-light rounded-pill" type="button"><img src="icons/history/trash.svg" alt=""></button></td>`;
        this.inputField =  this.rootElement.getElementsByTagName('input')[0];
        this.inputField.addEventListener('focusout',this.onFocusChanged);
        window.setTimeout(()=> { this.inputField.focus(); }, 0);
        return this.rootElement;
    }
    onFocusChanged = () => {
		this.controller.addLink(this.inputField.value);
    }
}
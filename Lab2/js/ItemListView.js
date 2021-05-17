import { ItemView } from "./ItemView.js";
import { VirtualItemView } from "./InputView.js";
export class ItemListView{

    constructor() {
        this.controller = null;
        this.itemList = [];
        this.rootElement = document.getElementById('itemListRoot');
        this.virtualItem = null;
        document.getElementById('addButton').addEventListener('mousedown',this.onAddItem);
    }
    renderView(data) {
        this.itemList = [];
        this.rootElement.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
            let itemView = new ItemView(i,data[i],this.controller);
            this.rootElement.appendChild(itemView.generateView());
            this.itemList.push(itemView);
        }
    }
    onAddItem = () => {
        this.virtualItem = new VirtualItemView(this.controller);
        this.rootElement.appendChild(this.virtualItem.generateView());
        console.log('add virtual');
    }
    setController = (controller) => this.controller = controller;
}
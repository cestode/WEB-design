import { Controller } from './Controller.js';
import { ItemListView } from './ItemListView.js';

const view = new ItemListView();
const controller = new Controller(view);

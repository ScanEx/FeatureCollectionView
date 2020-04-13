import Tree from '../src/Tree.js';
import {Result} from './moskva.json';

class Example {
    constructor(container) {
        this._root = new Tree(container);
        this._root.on('change:state', e => {
            const {detail: {title, visible, expanded, geometry, order}} = e;
            console.log('change:', {title, visible, expanded, geometry, order});
        });     
        this._root.on('redraw', e => {
            const {detail: {title, visible, expanded, geometry, order}} = e;
            console.log('redraw:', {title, visible, expanded, geometry, order});
        });   
        this._root.update(Result);        
        console.log('natural:', this._root.layers);
        this._root.vectorFirst = true;
        console.log('vectors first:', this._root.layers);
    }
}

export default Example;
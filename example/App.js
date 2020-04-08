import Tree from '../src/Tree.js';
import {Result} from './moskva.json';

class Example {
    constructor(container) {
        this._root = new Tree(container);
        this._root.on('change:state', e => {
            const {detail: {title, visible, expanded, geometry, order}} = e;
            console.log({title, visible, expanded, geometry, order});
        });     
        this._root.on('redraw', e => {
            const {detail: {title, visible, expanded, geometry, order}} = e;
            console.log({title, visible, expanded, geometry, order});
        });   
        this._root.update(Result);        
        console.log(this._root.layers);
    }
}

export default Example;
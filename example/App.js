import Tree from '../src/Tree.js';
import {Result} from './moskva.json';

class Example {
    constructor(container) {
        this._root = new Tree(container);
        this._root.on('change:state', e => {
            const {detail: {title, visible, geometry, order}} = e;
            console.log('change:', {title, visible, geometry, order});
        });
        this._root.on('redraw', e => {
            const {detail: {title, visible, geometry, order}} = e;
            console.log('redraw:', {title, visible, geometry, order});
        });
        this._root.update(Result);
        console.log('change order');
        this._root.vectorFirst = true;        
    }
}

export default Example;
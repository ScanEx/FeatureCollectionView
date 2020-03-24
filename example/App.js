import Group from '../src/Group.js';
import {Result} from './moskva.json';

class Example {
    constructor(container) {
        this._root = new Group(container);        
        this._root.on('change:state', e => {
            const {detail: {title, visible, geometry}} = e;
            console.log({title, visible, geometry});
        });
        this._root.update(Result);
    }
}

export default Example;
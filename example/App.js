import Group from '../src/Group.js';
import {Result} from './moskva.json';

console.log(Result);

class Example {
    constructor(container) {
        this._root = new Group(container, Result);
        this._root.on('change:state', e => {
            const {detail: {title, visible, geometry}} = e;
            console.log({title, visible, geometry});
        });
    }
}

export default Example;
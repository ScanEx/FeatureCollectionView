import Group from '../src/Group.js';
import {Result} from './moskva.json';
// import {Result} from './ais.json';

console.log(Result);

function onChangeVisible(e) {
    console.log(e);
}

class Example {
    constructor(container) {
        this._root = new Group(container, Result);
    }
}

export default Example;
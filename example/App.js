import Group from '../src/Group.js';
import {Result} from './moskva.json';

class Example {
    constructor(container) {
        this._root = new Group(container);        
        this._root.on('change:state', e => {
            const {detail: {title, visible, expanded, geometry}} = e;
            console.log({title, visible, expanded, geometry});
        });
        this._root.update(Result);
        console.log({type: 'FeatureCollection', features: this._root.features});
    }
}

export default Example;
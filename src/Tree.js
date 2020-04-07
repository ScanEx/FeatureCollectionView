import EventTarget from 'scanex-event-target';
import Group from './Group.js';

class Tree extends EventTarget {
    constructor(container, expand){
        super();
        this._root = new Group(container);
        this._root.expand = expand;
        this._root.on('change:state', e => {            
            let event = document.createEvent('Event');
            event.initEvent('change:state', false, false);
            event.detail = e.detail;
            this.dispatchEvent(event);            
        });
        this._root.on('expanded', () => this._root.enumerate());        
        
    }
    update (data) {
        this._root.update(data);
        this._root.enumerate();
    }
    get layers () {
        return this._root.layers;
    }
}

export default Tree;
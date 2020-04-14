import EventTarget from 'scanex-event-target';
import Group from './Group.js';

class Tree extends EventTarget {
    constructor(container, expand){
        super();
        this._vectorFirst = false;
        this._root = new Group(container);
        this._root.expand = expand;
        this._temporal = false;
        this._root.on('change:state', this._forwardEvent.bind(this));
        this._root.on('node:expanded', () => {
            this._root.enumerate(0);
            this._root.redraw();
        });        
        this._root.on('node:redraw', this._forwardEvent.bind(this));
        this._root.on('node:click', this._forwardEvent.bind(this));
    }
    get temporal() {
        return this._root.layers.some(layer => layer.temporal);
    }
    redraw(filter) {
        this._root.redraw(filter);
    }
    _forwardEvent(e) {
        e.stopPropagation();
        let event = document.createEvent('Event');
        event.initEvent(e.type, false, false);
        event.detail = e.detail;
        this.dispatchEvent(event);
    }
    update (data) {
        this._temporal = false;
        this._root.update(data);
        if (this._vectorFirst) {
            const count = this._root.enumerate(0, item => {
                return item.type === 'Group' || item.type === 'Vector';
            });
            this._root.enumerate(count, item => {
                return item.type === 'Group' || item.type !== 'Vector';
            });
        }
        else {
            this._root.enumerate(0);
        }
        this._root.redraw();
    }
    get vectorFirst () {
        return this._vectorFirst;
    }
    set vectorFirst (vectorFirst) {
        if (this._vectorFirst !== vectorFirst) {
            this._vectorFirst = vectorFirst;
            if (this._vectorFirst) {
                const count = this._root.enumerate(0, item => {
                    return item instanceof Group || item.type === 'Vector';
                });
                this._root.enumerate(count, item => {
                    return item instanceof Group || item.type !== 'Vector';
                });
            }
            else {
                this._root.enumerate(0);
            }
            this._root.redraw();
        }        
    }
    get layers () {
        return this._root.layers;
    }
}

export default Tree;
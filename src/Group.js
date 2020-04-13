import './Group.css';
import './icons.css';
import Layer from './Layer.js';
import EventTarget from 'scanex-event-target';

class Group extends EventTarget {
    constructor(container, expand) {
        super();
        this._container = container;
        this._items = [];
        this.expand = expand;        
        this._order = 0;
    }
    _forwardEvent(e) {
        e.stopPropagation();
        let event = document.createEvent('Event');
        event.initEvent(e.type, false, false);
        event.detail = e.detail;
        this.dispatchEvent(event);
    }
    get order() {
        return this._order;
    } 
    set order(order) {
        this._order = order;
    }   
    get items() {
        return this._items;
    }    
    enumerate() {
        return this._items.reduce((a,item) => {
            item.order = a + 1;            
            return item.enumerate();
        }, this._order);
    }    
    enumVectors() {        
        return this._items.reduce((a,item) => {
            if (item.type === 'Group' || item.type === 'Vector') {
                item.order = a + 1;
                return item.enumVectors();
            }
            else {
                return a;
            }            
        }, this._order);
    }
    enumRest(start) {
        return this._items.reduce((a,item) => {
            if (item.type === 'Group' || item.type !== 'Vector') {
                item.order = a + 1;          
                return item.enumRest(item.order);
            }
            else {
                return a;
            }
        }, start);
    }
    redraw() {
        this._items.forEach(item => {
            if (!(typeof item.visible === 'boolean' && !item.visible)) {
                item.redraw();
            }            
        });
    }
    update({properties, children}) {
        this.destroy();
        this.render(this._container);
        this._properties = properties;
        this._init(children);        
    }
    get layers() {
        return Array.isArray(this._items) ?
            this._items.reduce((a,x) => {
                return a.concat(x instanceof Group ? x.layers : [x]);
            }, []) : [];
    }
    _init(children) {        
        this._expanded = false;
        this._folder.classList.add('folder-filled');
        this._children.classList.add('scanex-layer-tree-hidden');        
        this._folder.addEventListener('click', this._toggleChildren.bind(this));
        this._title.innerText = this.title;
        this._visibility.addEventListener('click', this._toggleVisibility.bind(this));
        this._initChildren(children);
        this.expanded = !!this._properties.expanded;
    }
    destroy() { 
        if (this._element) {
            this._element.remove();
        }        
    }
    _initChildren(children) {        
        this._items = (Array.isArray (children) && children || []).map(({content, type}) => {
            let item;            
            if (type === 'group') {
                item = new Group (this._children, this.expand);
                item.update(content);                
            }
            else if (type === 'layer') {
                item = new Layer (this._children, content);
            }
            item.addEventListener('change:visible', this._onChangeVisible.bind(this));
            item.addEventListener('change:state', this._forwardEvent.bind(this));
            item.addEventListener('redraw', this._forwardEvent.bind(this));
            item.addEventListener('expanded', this._forwardEvent.bind(this));
            return item;
        });

        this._visible = this.childrenVisibility;
        if (typeof this.visible === 'boolean') {
            if (this.visible) {
                this._visibility.classList.add('check-square');
            }
            else {
                this._visibility.classList.add('square');
            }
        }
        else {
            this._visibility.classList.add('minus-square');
        }
    }
    _toggleChildren(e) {
        e.stopPropagation();
        this.expanded = !this.expanded;        
    }
    _toggleVisibility(e) {
        e.stopPropagation();        
        this.childrenVisibility = !this.visible;
    }
    _onRedraw(e) {
        let event = document.createEvent('Event');
        event.initEvent('redraw', false, false);
        event.detail = e.detail;
        this.dispatchEvent(event);
    }
    _onExpanded () {
        let event = document.createEvent('Event');
        event.initEvent('expanded', false, false);        
        this.dispatchEvent(event);
    }
    _onChangeVisible(e) {
        e.stopPropagation();
        this.visible = this.childrenVisibility;
    }       
    get childrenVisibility() {
        if (this._items.length === 0) {
            return false;
        }
        const state = this._items.map(item => item.visible);
        let isTrue = true;
        for (let i = 0; i < state.length; ++i) {
            isTrue = isTrue && (typeof state[i] === 'boolean') && state[i];
        }
        if (isTrue) {
            return true;
        }

        let isFalse = true;
        for (let i = 0; i < state.length; ++i) {
            isFalse = isFalse && (typeof state[i] === 'boolean') && !state[i];
        }
        if (isFalse) {
            return false;
        }
        return undefined;
    }
    set childrenVisibility(visible) {
        if (this._items.length === 0 && typeof this.expand === 'function') {
            this.expand(this._properties)
            .then(children => {
                this._initChildren(children);
                this._items.forEach(item => item.visible = visible);
                this._onExpanded();
            })
            .catch(e => console.log(e));
        }
        else {            
            this._items.forEach(item => item.visible = visible);
        }        
    }    
    get properties () {
        return this._properties;
    }
    set properties (properties) {
        this._properties = properties;
    }
    get title () {
        return this._properties.title;
    }      
    get visible () {
        return this._visible;
    } 
    set visible (value) {
        if (this.visible !== value) {
            if (typeof value === 'boolean') {
                if (value) {
                    this._visibility.classList.remove('square');
                    this._visibility.classList.remove('minus-square');
                    this._visibility.classList.add('check-square');
                    this._visible = true;
                    this.childrenVisibility = true;
                }
                else {
                    this._visibility.classList.remove('check-square');
                    this._visibility.classList.remove('minus-square');
                    this._visibility.classList.add('square');
                    this._visible = false;
                    this.childrenVisibility = false;
                }
            }
            else {
                this._visibility.classList.remove('check-square');
                this._visibility.classList.remove('square');
                this._visibility.classList.add('minus-square');
                this._visible = undefined;
            }            
            let event = document.createEvent('Event');
            event.initEvent('change:visible', false, false);
            this.dispatchEvent(event);
        }        
    } 
    get expanded () {
        return this._expanded;
    }
    _handleExpand(expanded) {
        if (expanded) {
            this._folder.classList.remove('folder-filled');
            this._folder.classList.add('folder-open-filled');
            this._children.classList.remove('scanex-layer-tree-hidden');
            this._expanded = true;
        }
        else {
            this._folder.classList.remove('folder-open-filled');
            this._folder.classList.add('folder-filled');
            this._children.classList.add('scanex-layer-tree-hidden');
            this._expanded = false;
        }        
    } 
    set expanded (expanded) {        
        if (this._items.length === 0 && typeof this.expand === 'function') {
            this.expand(this._properties)
            .then(children => {
                this._initChildren(children);
                this._handleExpand(expanded);
                this._onExpanded();
            })
            .catch(e => console.log(e));
        }
        else {
            this._handleExpand(expanded);
        }   
    }  
    render (container) {
        this._element = document.createElement('div');
        this._element.classList.add('scanex-layer-tree-group');

        this._header = document.createElement('div');
        this._header.classList.add('scanex-layer-tree-header');
        this._element.appendChild(this._header);

        this._visibility = document.createElement('i');
        this._visibility.classList.add('scanex-layer-tree-visibility');
        this._visibility.classList.add('scanex-layer-tree-icon');
        this._header.appendChild(this._visibility);

        this._folder = document.createElement('i');
        this._folder.classList.add('scanex-layer-tree-folder');
        this._folder.classList.add('scanex-layer-tree-icon');
        this._header.appendChild(this._folder);

        this._title = document.createElement('label');
        this._title.classList.add('scanex-layer-tree-title');
        this._header.appendChild(this._title);

        this._children = document.createElement('div');
        this._children.classList.add('scanex-layer-tree-children');
        this._element.appendChild(this._children);

        container.appendChild(this._element);        
    }
}

export default Group;
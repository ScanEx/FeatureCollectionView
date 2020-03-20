import './Group.css';
import './icons.css';
import Layer from './Layer.js';
import EventTarget from 'scanex-event-target';

class Group extends EventTarget {
    constructor(container, {properties, children}) {
        super();
        this._container = container;                
        this.render(this._container);
        this._properties = properties;
        
        this.initialize(children);
    }
    initialize(children) {
        
        this._expanded = false;
        this._folder.classList.add('folder-filled');
        this._children.classList.add('scanex-layer-tree-hidden');        
        this._folder.addEventListener('click', this._toggleChildren.bind(this));

        this._items = children.map(({content, type}) => {
            let item;
            if (type === 'group') {
                item = new Group (this._children, content);
            }
            else if (type === 'layer') {
                item = new Layer (this._children, content);
            }
            item.addEventListener('change:visible', this._onChangeVisible.bind(this));
            item.addEventListener('change:state', this._onChangeState.bind(this));
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
        this._visibility.addEventListener('click', this._toggleVisibility.bind(this));
            
        this._title.innerText = this.title;
    }
    set childrenVisibility(visible) {
        this._items.forEach(item => item.visible = visible);
    }
    _toggleChildren(e) {
        e.stopPropagation();
        this.expanded = !this.expanded;
    }
    _toggleVisibility(e) {
        e.stopPropagation();        
        this.childrenVisibility = !this.visible;
    }
    get childrenVisibility() {
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
    _onChangeVisible(e) {
        e.stopPropagation();
        this.visible = this.childrenVisibility;
    } 
    _onChangeState (e) {
        e.stopPropagation();
        let event = document.createEvent('Event');
        event.initEvent('change:state', false, false);
        event.detail = e.detail;
        this.dispatchEvent(event);
    }
    get properties () {
        return this._properties;
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
    set expanded (value) {        
        if (value) {
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
        let event = document.createEvent('Event');
        event.initEvent('change:expanded', false, false);
        this.dispatchEvent(event);
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
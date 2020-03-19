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
        this.visible = this._properties.visible;        
        this._visibility.addEventListener('click', e => {
            e.stopPropagation();            
        });   
        this.expanded = false;
        this._folder.addEventListener('click', e => {
            e.stopPropagation();
            this.expanded = !this.expanded;            
        });
        this._items = children.map(({content, type}) => {
            let item;
            if (type === 'group') {
                item = new Group (this._children, content);
            }
            else if (type === 'layer') {
                item = new Layer (this._children, content);
            }
            item.addEventListener('change:visible', this._onChangeVisible.bind(this));
            return item;
        });        
        this._title.innerText = this.title;
    }
    _toggleVisibility() {
        let event = document.createEvent('Event');
        event.initEvent('change:visible', false, false);
        this.dispatchEvent(event);
    }
    _onChangeVisible(e) {
        e.stopPropagation();
        if (this._items.every(item => typeof item.visible === 'boolean' && item.visible)) {
            this.visible = true;
        }
        else if (this._items.every(item => typeof item.visible === 'boolean' && !item.visible)) {
            this.visible = false;
        }
        else {
            this.visible = undefined;
        }
    } 
    get properties () {
        return this._properties;
    }
    get title () {
        return this._properties.title;
    }      
    get visible () {
        return this._properties.visible;
    } 
    set visible (value) {
        if (typeof value === 'boolean') {
            if (value) {
                this._visibility.classList.remove('square');
                this._visibility.classList.remove('minus-square');
                this._visibility.classList.add('check-square');
                this._properties.visible = true;
            }
            else {
                this._visibility.classList.remove('check-square');
                this._visibility.classList.remove('minus-square');
                this._visibility.classList.add('square');
                this._properties.visible = false;
            }
        }
        else {
            this._visibility.classList.remove('check-square');
            this._visibility.classList.remove('square');
            this._visibility.classList.add('minus-square');
            this._properties.visible = undefined;
        }
        let event = document.createEvent('Event');
        event.initEvent('change:visible', false, false);
        this.dispatchEvent(event);
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
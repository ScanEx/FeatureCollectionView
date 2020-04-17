import EventTarget from 'scanex-event-target';

// function uuid () {
//     var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//         var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
//          return v.toString(16);
//     });
//     return guid;
// }

class Layer extends EventTarget {
    constructor(container, {properties, geometry}) {
        super();
        this._container = container;                
        this.render(this._container);
        this._properties = properties;
        this._geometry = geometry;     
        this._init();        
        this._type.addEventListener('click', this._onClick.bind(this));
        this._title.addEventListener('click', this._onClick.bind(this));
    }
    _onClick(e) {
        e.stopPropagation();
        let event = document.createEvent('Event');
        event.initEvent('node:click', false, false);
        event.detail = this;
        this.dispatchEvent(event);
    }
    get order () {
        return this._order;
    }
    get temporal () {
        return !!this._properties.Temporal;
    }    
    enumerate (start) {
        this._order = start;
        return this._order;
    }    
    redraw(filter) {
        if (this.visible && (typeof filter !== 'function' || filter(this))) {            
            let event = document.createEvent('Event');
            event.initEvent('node:redraw', false, false);
            event.detail = this;
            this.dispatchEvent(event);
        }
    }
    _init() {        
        if (this._properties.visible) {
            this._visibility.classList.remove('square');
            this._visibility.classList.add('check-square');            
        }
        else {
            this._visibility.classList.remove('check-square');
            this._visibility.classList.add('square');            
        }

        this._visibility.addEventListener('click', this._toggleVisibility.bind(this));

        switch (this._properties.type) {            
            case 'Vector':
                if (this.temporal) {
                    this._type.classList.add('clock');
                }
                else {
                    this._type.classList.add('block');
                }
                break;
            case 'Raster':
                this._type.classList.add('picture');
                break;
            case 'Virtual':
                if (this.temporal) {
                    this._type.classList.add('clock');
                }
                else {
                    this._type.classList.add('cloud');
                }                
                break;
            default:
                break;
        }
    
        this._title.innerText = this.title;
    }
    _toggleVisibility(e) {
        e.stopPropagation();
        this.visible = !this.visible;
    }      
    get geometry () {
        return this._geometry;
    }
    get properties () {
        return this._properties;
    }
    get title () {
        return this._properties.title;
    }
    get description() {
        return this._properties.description;
    }
    get visible () {
        return typeof this._properties.visible === 'boolean' ? this._properties.visible : false;
    }
    set visible (value) {
        if (this.visible !== value) {
            if (value) {
                this._visibility.classList.remove('square');
                this._visibility.classList.add('check-square');
                this._properties.visible = true;
            }
            else {
                this._visibility.classList.remove('check-square');
                this._visibility.classList.add('square');
                this._properties.visible = false;
            }            
            let visibilityEvent = document.createEvent('Event');
            visibilityEvent.initEvent('change:visible', false, false);
            this.dispatchEvent(visibilityEvent);

            let stateEvent = document.createEvent('Event');
            stateEvent.initEvent('change:state', false, false);
            stateEvent.detail = this;
            this.dispatchEvent(stateEvent);
        }
    }    
    get type () {
        return this._properties.type;
    }    
    render (container) {
        this._element = document.createElement('div');
        this._element.classList.add('scanex-layer-tree-layer');        

        this._header = document.createElement('div');
        this._header.classList.add('scanex-layer-tree-header');
        this._element.appendChild(this._header);

        this._visibility = document.createElement('i');
        this._visibility.classList.add('scanex-layer-tree-visibility');
        this._visibility.classList.add('scanex-layer-tree-icon');
        this._header.appendChild(this._visibility);

        this._type = document.createElement('i');
        this._type.classList.add('scanex-layer-tree-type');
        this._type.classList.add('scanex-layer-tree-icon');
        this._header.appendChild(this._type);

        this._title = document.createElement('label');
        this._title.classList.add('scanex-layer-tree-title');
        this._header.appendChild(this._title);

        container.appendChild(this._element);
    }
}

export default Layer;
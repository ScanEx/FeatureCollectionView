import Tree from '../src/Tree.js';
import {Result} from './ais.json';

class Example {
    constructor(container) {
        this._root = new Tree(container);
        this._root.on('change:state', e => {
            const {detail: {title, visible, geometry, order}} = e;
            console.log('change:', {title, visible, geometry, order});
        });
        // this._root.on('node:redraw', e => {
        //     const {detail: {title, visible, geometry, order}} = e;
        //     console.log('node:redraw:', {title, visible, geometry, order});
        // });
        this._root.on('node:click', e => {
            const {detail: {title, visible, geometry, order}} = e;
            console.log('node:click', {title, visible, geometry, order});
        });
        this._root.update(Result);
        console.log('temporal:', this._root.temporal);
        const vectors = item => item.type === 'Vector';
        const rasters = item => item.type === 'Raster';
        const ord = item => item.order;
        console.log('vector:', this._root.layers.filter(vectors).map(ord), ', raster:', this._root.layers.filter(rasters).map(ord));
        console.log('change order');
        this._root.vectorFirst = true;
        console.log('vector:', this._root.layers.filter(vectors).map(ord), ', raster:', this._root.layers.filter(rasters).map(ord));
    }
}

export default Example;
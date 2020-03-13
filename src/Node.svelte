<script>
    import './Node.css';
    import './icons.css';
    import {createEventDispatcher, getContext} from 'svelte';    
    import 'regenerator-runtime';
    import 'core-js/stable';    

    const dispatch = createEventDispatcher();
    
    export let content;    
    export let type;

    let state = 0;
    let expanded = false;    
    
    $: children = content.children;
    $: properties = content.properties;
    $: title = properties.title;
    $: visible = properties.visible;

    $: {        
        if (visible === true) {
            state = 1;
        }
        else if (visible === false) {
            state = 0;
        }
        else {
            state = -1;
        }
        if (Array.isArray(children) && (typeof (visible) !== 'undefined')) {
            for (let i = 0; i < children.length; i++) {
                children[i].content.properties.visible = visible;
                dispatch('change:visible', {properties: children[i].content.properties, type, visible});
            }
        }
    }

    const expand = getContext('expand');

    async function toggleChildren () {
        if (expanded) {
            expanded = false;      
        }
        else {
            expanded = true;
            if ((!Array.isArray(children) || children.length === 0) && typeof expand === 'function') {
                const items = await expand(properties);
                children = items;                
            }
        }
    }

    function toggleVisibility () {                  
        visible = !visible;
        dispatch('change:visible', {properties, type, visible});
        dispatch('change:state', {properties, type, visible});
    }

    function onChangeState (detail, i) {
        if (Array.isArray(children) && children.length) {
            children[i].content.properties.visible = detail.visible;
            if (children.every(({content: {properties: {visible}}}) => visible === true)) {
                visible = true;
            }
            else if (children.every(({content: {properties: {visible}}}) => visible === false)) {
                visible = false;
            }
            else {
                visible = undefined;
            }
            dispatch('change:state', {properties, type, visible});
        }
    }

</script>

<div class="scanex-layer-tree-node">
    <div class="scanex-layer-tree-header">
        <i  class="scanex-layer-tree-node-visibility scanex-layer-tree-icon"
            class:check-square="{state === 1}"
            class:square="{state === 0}"
            class:minus-square="{state === -1}"
            on:click|stopPropagation="{toggleVisibility}"></i>
        {#if type === 'group'}
        <i  class="scanex-layer-tree-node-folder scanex-layer-tree-icon"
            class:folder-filled="{!expanded}"
            class:folder-open-filled="{expanded}"
            on:click|stopPropagation="{toggleChildren}"></i>        
        {:else if properties.type === 'Vector'}
        <i class="scanex-layer-tree-node-vector scanex-layer-tree-icon block"></i>
        {:else if properties.type === 'Raster'}
        <i class="scanex-layer-tree-node-raster scanex-layer-tree-icon picture"></i>
        {/if}
        <label class="scanex-layer-tree-title">{title}</label>
    </div>
    {#if Array.isArray(children) && children.length}
    <div class="scanex-layer-tree-children" class:scanex-layer-tree-hidden="{!expanded}">
        {#each children as item, i}            
            <svelte:self
                {...item}
                on:change:visible
                on:change:style
                on:change:state="{({detail}) => onChangeState(detail, i)}" />            
        {/each}
    </div>
    {/if}
</div>
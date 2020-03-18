<script>
    import './Group.css';
    import './icons.css';
    import {createEventDispatcher, getContext, afterUpdate} from 'svelte';
    import Vector from './Vector.svelte';
    import Raster from './Raster.svelte';
    import 'regenerator-runtime';
    import 'core-js/stable';    

    const dispatch = createEventDispatcher();
    
    export let properties;    
    export let children;   
    
    let expanded = false;    
    
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
        properties.visible = !properties.visible;
        for (let i = 0; i < children.length; ++i) {
            if (children[i].content.properties.visible != properties.visible) {
                children[i].content.properties.visible = properties.visible;
            }
        } 
        dispatch('change:visible', {properties, type: 'group'});
    }

    function onChangeVisible () {
        let visible_true = true;
        let visible_false = true;
        for (const {content} of children) {
            visible_true = visible_true && content.properties.visible;
            visible_false = visible_false && !content.properties.visible;
        }
        if (visible_true) {
            properties.visible = true;            
        }
        else if (visible_false) {
            properties.visible = false;            
        }
        else {
            properties.visible = undefined;
        }        
        dispatch('change:visible', {properties, type: 'group'});
    }   

</script>

<div class="scanex-layer-tree-group">
    <div class="scanex-layer-tree-header">
        <i  class="scanex-layer-tree-visibility scanex-layer-tree-icon"
            class:check-square="{typeof(properties.visible) === 'boolean' && properties.visible}"
            class:square="{typeof(properties.visible) === 'boolean' && !properties.visible}"
            class:minus-square="{typeof(properties.visible) === 'undefined'}"
            on:click|stopPropagation="{toggleVisibility}"></i>
        <i  class="scanex-layer-tree-folder scanex-layer-tree-icon"
            class:folder-filled="{!expanded}"
            class:folder-open-filled="{expanded}"
            on:click|stopPropagation="{toggleChildren}"></i>
        <label class="scanex-layer-tree-title">{properties.title}</label>
    </div>
    {#if Array.isArray(children)}
    <div class="scanex-layer-tree-children" class:scanex-layer-tree-hidden="{!expanded}">
        {#each children as {type, content}}
            {#if type === 'group'}
            <svelte:self
                properties="{content.properties}"
                children="{content.children}"                
                on:change:visible="{onChangeVisible}" />
            {:else}
            <svelte:component
                this="{content.properties.type === 'Vector' ? Vector : Raster}"
                properties="{content.properties}"                
                on:change:visible="{onChangeVisible}" />
            {/if}
        {/each}
    </div>
    {/if}
</div>
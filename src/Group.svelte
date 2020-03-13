<script>
    import './Group.css';
    import './icons.css';
    import {createEventDispatcher, getContext} from 'svelte';
    import Layer from './Layer.svelte';
    import 'regenerator-runtime';
    import 'core-js/stable';    

    const dispatch = createEventDispatcher();
        
    export let title;
    export let visible = false;
    export let properties;
    export let children;
        
    let expanded = false;
    let state = 0;
    let checked = false;

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
        checked = visible;
        state = visible ? 1 : 0;
        // properties.visible = visible;
        // for (let i = 0; i < children.length; ++i) {
        //     children[i].content.properties.visible = checked;
        // }
        dispatch('change:visible', {properties, type: 'group', visible});
    }

    function onChangeVisible (detail, i) {        
        // children[i].content.properties.visible = detail.visible;
        if (children.every(({content: {properties: {visible}}}) => typeof(visible) === 'boolean' && visible)) {
            visible = true;            
            state = 1;
            checked = true;
        }
        else if (children.every(({content: {properties: {visible}}}) => typeof(visible) === 'boolean' && !visible)) {
            visible = false;
            state = 0;
            checked = false;
        }
        else {
            visible = undefined;
            state = -1;
        }
        // properties.visible = visible;
        dispatch('change:visible', {properties, type: 'group', visible});
    }    

</script>

<div class="scanex-layer-tree-group">
    <div class="scanex-layer-tree-header">
        <i  class="scanex-layer-tree-visibility scanex-layer-tree-icon"
            class:check-square="{state === 1}"
            class:square="{state === 0}"
            class:minus-square="{state === -1}"
            on:click|stopPropagation="{toggleVisibility}"></i>        
        <i  class="scanex-layer-tree-folder scanex-layer-tree-icon"
            class:folder-filled="{!expanded}"
            class:folder-open-filled="{expanded}"
            on:click|stopPropagation="{toggleChildren}"></i>        
        <label class="scanex-layer-tree-title">{title}</label>
    </div>    
    <div class="scanex-layer-tree-children" class:scanex-layer-tree-hidden="{!expanded}">
        {#each children as item, i}
            {#if item.type === 'group'}
            <svelte:self                                
                properties="{item.content.properties}"
                title="{item.content.properties.title}"                
                bind:visible="{checked}"
                children="{item.content.children}"
                on:change:visible="{({detail}) => onChangeVisible(detail, i)}" />
            {:else}
            <Layer
                properties="{item.content.properties}"
                title="{item.content.properties.title}"                
                bind:visible="{checked}"
                on:change:visible="{({detail}) => onChangeVisible(detail, i)}" />
            {/if}
        {/each}
    </div>    
</div>
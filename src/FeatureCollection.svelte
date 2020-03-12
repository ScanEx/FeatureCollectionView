<script>
    import './FeatureCollection.css';
    import './icons.css';
    import {createEventDispatcher, getContext} from 'svelte';    
    import 'regenerator-runtime';
    import 'core-js/stable';    

    const dispatch = createEventDispatcher();
    
    export let features;    
    export let properties;
    export let type;

    let state = 0;
    let expanded = false;
    
    $: title = properties.title;
    $: visible = properties.visible;
    $: layerType = properties.type;

    $: hasChildren = Array.isArray(features) && features.some(f => f.type === 'FeatureCollection');

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
        if (Array.isArray(features) && (typeof (visible) !== 'undefined')) {
            for (let i = 0; i < features.length; i++) {
                features[i].properties.visible = visible;
                dispatch('change:visible', { properties: features[i].properties, visible, isLeaf: !Array.isArray(features) || features.every(f => f.type !== 'FeatureCollection')});
            }
        }
    }

    const expand = getContext('expand');

    function toggleChildren () {
        if (expanded) {
            expanded = false;      
        }
        else {
            expanded = true;
            if ((!Array.isArray(features) || features.length === 0) && typeof expand === 'function') {
                expand(properties).then (items => features = items);
            }
        }
    }

    function toggleVisibility () {                  
        visible = !visible;
        dispatch('change:visible', {properties, visible, isLeaf: !hasChildren});
        dispatch('change:state', {properties, visible, isLeaf: !hasChildren});
    }

    function onChangeState (detail, i) {
        if (hasChildren) {
            features[i].properties.visible = detail.visible;
            if (features.every(({properties: {visible}}) => visible === true)) {
                visible = true;
            }
            else if (features.every(({properties: {visible}}) => visible === false)) {
                visible = false;
            }
            else {
                visible = undefined;
            }
            dispatch('change:state', {properties, visible});
        }
    }

</script>

<div class="scanex-feature-collection">
    <div class="scanex-feature-collection-header">
        <i  class="scanex-feature-collection-icon"
            class:check-square="{state === 1}"
            class:square="{state === 0}"
            class:minus-square="{state === -1}"
            on:click|stopPropagation="{toggleVisibility}"></i>
        {#if hasChildren}
        <i  class="scanex-feature-collection-icon"
            class:folder="{!expanded}"
            class:folder-open="{expanded}"
            on:click|stopPropagation="{toggleChildren}"></i>        
        {:else}
        <i class="scanex-feature-collection-icon grid"></i>
        {/if}
        <label class="scanex-feature-collection-title">{title}</label>
    </div>
    {#if hasChildren}
    <div class="scanex-feature-collection-features" class:scanex-feature-collection-hidden="{!expanded}">
        {#each features as f, i}
            {#if f.type === 'FeatureCollection'}
            <svelte:self
                {...f}
                on:change:visible
                on:change:style
                on:change:state="{({detail}) => onChangeState(detail, i)}" />
            {/if}
        {/each}
    </div>
    {/if}
</div>
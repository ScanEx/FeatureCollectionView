<script>
    import {createEventDispatcher} from 'svelte'; 

    const dispatch = createEventDispatcher();

    export let title;    
    export let properties;
    export let visible = false;

    function toggleVisibility () {
        visible = !visible;
        properties.visible = visible;
        dispatch('change:visible', {properties, type: 'layer', visible});
    }

</script>

<div class="scanex-layer-tree-layer">
    <div class="scanex-layer-tree-header">
        <i  class="scanex-layer-tree-node-visibility scanex-layer-tree-icon"
        class:check-square="{visible}"
        class:square="{!visible}"            
        on:click|stopPropagation="{toggleVisibility}"></i>        
        {#if properties.type === 'Vector'}
        <i class="scanex-layer-tree-node-vector scanex-layer-tree-icon block"></i>
        {:else if properties.type === 'Raster'}
        <i class="scanex-layer-tree-node-raster scanex-layer-tree-icon picture"></i>
        {/if}
        <label class="scanex-layer-tree-title">{title}</label>
    </div>    
</div>
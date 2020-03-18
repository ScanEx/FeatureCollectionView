<script>
    import {createEventDispatcher} from 'svelte'; 

    const dispatch = createEventDispatcher();    

    export let properties;

    function toggleVisibility () {        
        properties.visible = !properties.visible;
        dispatch('change:visible', {properties, type: 'layer'});
    }    

</script>

<div class="scanex-layer-tree-layer">
    <div class="scanex-layer-tree-header">
        <i
            class="scanex-layer-tree-node-visibility scanex-layer-tree-icon"
            class:check-square="{properties.visible}"
            class:square="{!properties.visible}"
            on:click|stopPropagation="{toggleVisibility}"></i>        
        <i class="scanex-layer-tree-node-vector scanex-layer-tree-icon block"></i>        
        <label class="scanex-layer-tree-title">{properties.title}</label>
    </div>    
</div>
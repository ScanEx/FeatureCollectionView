<script>
    import Node from '../src/Node.svelte';
    import {Result} from './moskva.json';
    // import {Result} from './ais.json';
    import {setContext} from 'svelte';

    console.log(Result);    

    function onChangeVisible(e) {
        console.log(e);
    }

</script>

<Node 
    type="group"
    children="{Result.children}"
    properties="{Result.properties}"
    title="{Result.properties.title}"
    visible="{Result.properties.visible}"
    on:change:visible="{onChangeVisible}" />
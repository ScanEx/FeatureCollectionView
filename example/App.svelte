<script>
    import Node from '../src/Node.svelte';
    import {Result} from './moskva.json';
    // import {Result} from './ais.json';
    import {setContext} from 'svelte';

    console.log(Result);
    
    let data = {content: Result, type: 'group'};

    function onChangeVisible(e) {
        console.log(e);
    }

</script>

<Node {...data} on:change:visible="{onChangeVisible}" />
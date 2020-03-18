<script>
    import Group from '../src/Group.svelte';
    import {Result} from './moskva.json';
    // import {Result} from './ais.json';
    import {setContext} from 'svelte';     

    const {properties, children} = Result;

    console.log(Result);

    function onChangeVisible(e) {
        console.log(e);
    }

</script>

<Group
    properties="{properties}"    
    children="{children}"    
    on:change:visible="{onChangeVisible}" />
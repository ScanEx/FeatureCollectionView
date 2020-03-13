<script>
    import Group from '../src/Group.svelte';
    import {Result} from './moskva.json';
    // import {Result} from './ais.json';
    import {setContext} from 'svelte';

    console.log(Result);    

    function onChangeVisible(e) {
        console.log(e);
    }

</script>

<Group
    title="{Result.properties.title}"
    visible="{Result.properties.visible}"
    properties="{Result.properties}"
    children="{Result.children}"
    on:change:visible="{onChangeVisible}" />
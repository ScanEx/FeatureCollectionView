<script>
    import Tree from '../src/Tree.svelte';
    import {Result} from './moskva.json';
    // import data from './a108.json';
    import {setContext} from 'svelte';

    console.log(Result);

    function onChangeVisible(e) {
        console.log(e);
    }

</script>

<Tree {...Result} on:change:visible="{onChangeVisible}" />
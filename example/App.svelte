<script>
    import FeatureCollection from '../src/FeatureCollection.svelte';    
    import {Result} from './moskva.json';
    // import data from './a108.json';
    import {setContext} from 'svelte';

    function toFeature ({content, type}) {
        if (type === 'group') {
            return toFeatureCollection(content);
        }
        else {
            const {properties, geometry} = content;            
            return {                
                type: 'Feature',
                geometry,
                properties,
            };
        } 
    }

    function toFeatureCollection ({children, properties}) {
        const features = children.map(toFeature);        
        return {            
            type: 'FeatureCollection',
            features,
            properties,
        };
    }

    const data = toFeatureCollection(Result);

    console.log(data);

    function onChangeVisible(e) {
        console.log(e);
    }

</script>

<FeatureCollection {...data} on:change:visible="{onChangeVisible}" />
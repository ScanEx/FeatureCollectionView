<script>
    import Node from './Node.svelte';

    export let children;

</script>

<div class="scanex-layer-tree">
    {#if Array.isArray(children)}
    {#each children as node}
    <Node {...node} on:change:visible />
    {/each}
    {/if}
</div>
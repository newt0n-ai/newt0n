<script lang="ts">
import "./layout.css";

// biome-ignore lint/correctness/noUnusedVariables: used in template
let { children } = $props();
</script>

{@render children()}

<script lang="ts">
	let { data } = $props();
</script>

<h1>Welcome to hei</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<pre>
  {JSON.stringify(data.rows, null, 2)}
</pre>

<form method="post">
	<label>
		Name
		<input type="text" name="name" required />
	</label>

	<input type="submit" value="new list" />
</form>

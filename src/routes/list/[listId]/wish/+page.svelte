<script lang="ts">
	import TablerX from '~icons/tabler/x';
	import TablerPlus from '~icons/tabler/plus';
	import { Button } from '$ui/button';
	import { Input } from '$ui/input';
	import * as Table from '$ui/table';
	import { Badge } from '$ui/badge/index.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>My wishes - {data.list.name}</title>
</svelte:head>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Name*</Table.Head>
			<Table.Head class="w-0">Price</Table.Head>
			<Table.Head class="w-0"></Table.Head>
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#each data.wishes as wish (wish.id)}
			<Table.Row>
				<Table.Cell>
					<p class="text-base font-semibold leading-none">{wish.name}</p>
				</Table.Cell>
				<Table.Cell>
					{#if wish.price}
						<Badge>{wish.price}</Badge>
					{/if}
				</Table.Cell>
				<Table.Cell class="text-right">
					<form method="post" class="contents" action="?/delete_wish">
						<input type="hidden" name="id" value={wish.id} />
						<Button variant="ghost" size="icon" type="submit">
							<TablerX class="size-4" />
						</Button>
					</form>
				</Table.Cell>
			</Table.Row>
		{/each}

		<Table.Row>
			<Table.Cell>
				<Input
					form="new_row_form"
					required
					name="name"
					class="bg-card"
					placeholder="Headphones, socks, ..."
				/>
			</Table.Cell>
			<Table.Cell>
				<Input form="new_row_form" name="price" class="w-20 bg-card" placeholder="0 €" />
			</Table.Cell>
			<Table.Cell>
				<Button form="new_row_form" type="submit">
					<span class="hidden sm:inline">Add</span>
					<TablerPlus class="size-4" />
				</Button>
			</Table.Cell>
		</Table.Row>
	</Table.Body>
</Table.Root>

<form id="new_row_form" class="contents" method="post" action="?/add_wish"></form>

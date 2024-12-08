<script lang="ts">
	import TablerArrowLeft from '~icons/tabler/arrow-left';
	import { page } from '$app/stores';
	import Button from '$ui/button/button.svelte';
	import * as Card from '$ui/card';
	import { Input } from '$ui/input';
	import { Label } from '$ui/label/index.js';
	import { enhance } from '$app/forms';

	let { data } = $props();
</script>

<main>
	<Card.Root class="absolute left-1/2 top-1/2 mx-auto max-w-lg -translate-x-1/2 -translate-y-1/2">
		<Card.Header>
			<Card.Title>Invite others to {data.list.name}</Card.Title>
			<Card.Description>Make sure to give this link only to people you trust!</Card.Description>
		</Card.Header>
		<Card.Content>
			<Label>
				Invite link
				<Input
					type="url"
					value="{$page.url.origin}/list/{data.list.id}"
					readonly
					onfocus={(e) => e.currentTarget.select()}
				/>
			</Label>

			<h3 class="mt-8 text-sm text-muted-foreground">Members ({data.list.users.length})</h3>

			<div class="overflow-hidden rounded-md border">
				<table class="w-full text-left">
					<tbody>
						{#each data.list.users as member (member.userId)}
							{@const isOwner = data.list.authorId === member.userId}
							{@const isMe = data.user?.id === member.userId}
							<tr class="border-b bg-slate-100 text-sm last:border-b-0 hover:bg-slate-200">
								<td class="p-1 pl-3">
									{isMe ? 'You' : member.user.name}
									{#if isOwner}
										<span class="text-muted-foreground"> (Owner) </span>
									{/if}
								</td>
								<td class="w-0 p-1 pl-3">
									{#if isMe}
										<form method="post" action="?/leave" class="contents" use:enhance>
											<Button
												variant={isOwner ? 'ghost' : 'destructive'}
												size="sm"
												disabled={isOwner}
												class={isMe ? 'visible' : 'invisible'}
												type="submit"
												onclick={(e) => !confirm('Are you sure?') && e.preventDefault()}
											>
												{isOwner ? 'Owner cannot leave' : 'Leave'}
											</Button>
										</form>
									{:else}
										<div class="h-8"></div>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</Card.Content>
		<Card.Footer>
			<Button class="w-full" variant="outline" href="/list/{data.list.id}">
				<TablerArrowLeft class="size-4" />
				Back to wishlist
			</Button>
		</Card.Footer>
	</Card.Root>
</main>

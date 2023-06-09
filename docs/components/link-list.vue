<script setup lang="ts">
type Link = {
	href: string;
	title: string;
	description: string;
}

defineProps<{
	links: Link[]
}>();
</script>

<template>
	<div class="link-list">
		<article
			class="article-link"
			v-for="link in links"
			:key="link.href"
		>
			<h3 class="link-title">
				<a
					class="link stretched-link"
					:href="link.href"
				>
					{{ link.title }}
					<br>
				</a>
			</h3>
			<p class="link-description">
				{{ link.description }}
			</p>
		</article>
	</div>
</template>

<style scoped>
.link-list {
	display: grid;
	grid-template-columns: 1fr;
	gap: 10px;
}

.article-link {
	position: relative;
	display: block;
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
	padding: 11px 16px 13px;
	transition: border-color 0.25s, background-color 0.25s;
	background-color: var(--vp-c-bg-soft);
}

.article-link:hover {
	border-color: var(--vp-c-brand);
	background-color: var(--vp-c-bg-soft-up);
}

.link-title {
	position: static;
}

.link:hover {
	text-decoration: none;
}

@media (min-width: 960px) {
	.link-list {
		grid-template-columns: repeat(3, 1fr);
	}
}

.stretched-link:after {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 1;
	content: "";
}
</style>

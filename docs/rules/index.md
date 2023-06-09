---
title: Rules
next: false
---

<script setup lang="ts">
import LinkList from '../components/link-list.vue';
import { data as rules } from './rules.data';

const ruleLinks = rules.filter(({ url }) => !url.includes('index.html')).map((rule) => ({
  title: rule.frontmatter.title,
  href: rule.url,
  description: rule.frontmatter.description,
}));
</script>

<h1>Rules</h1>
<br>
<LinkList :links="ruleLinks" />

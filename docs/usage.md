# Usage & API

It is a standard custom element, so it works with no wrapper in plain HTML, React, Vue, Svelte and Astro.

## Plain HTML

```html
<script src="palette-generator.js"></script>
<palette-generator></palette-generator>
```

## React

```jsx
import "@sgbp/palette-generator";
export default function Page() { return <palette-generator />; }
```

## Vue

```vue
<script setup>
import "@sgbp/palette-generator";
</script>

<template>
  <palette-generator />
</template>
```

---

Prefer to just use it without installing anything? The
[live Color Palette Generator](https://sgbp.tech/tools/color-palette-generator) is hosted and ready to go.

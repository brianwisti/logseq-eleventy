---
layout: base.njk
---
Hello there!

Blocks!

{% for block in graph.blocks -%}
<li>{{ block["page-name"] }}</li>
{% endfor -%}

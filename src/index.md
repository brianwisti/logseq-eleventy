---
title: My Public Brain
layout: base.njk
---
{% from "macro/graph.njk" import render_page_note %}

See [All Pages](/page/) for every public page, but here's some recent notes from the journal.

{% for block in journals -%}
  {{ render_page_note(block) }}
{% else %}
There aren't any?
{% endfor -%}
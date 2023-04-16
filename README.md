# Logseq Eleventy

An experiment using [Eleventy][eleventy] to publish a static site from [Logseq][logseq] JSON export.

[eleventy]: https://www.11ty.dev
[logseq]: https://logseq.com

## Synopsis

Assuming you have Git, Node.js, Logseq with a graph to export:

- clone / fork this repo
- `npm install`
- In Logseq, *Export Graph > Export as JSON* to `src/_data/graph.json`
- `npm start`
- marvel at how little it does

`npm build` builds a site, but there isn't much there yet.

## Description

Since this is an exploratory experiment, the goals are not concrete yet. It's just me wondering how much work it would take to publish my public Logseq graph with Eleventy.

I'm keeping it my version of simple for now, preferring JavaScript, Sass, and Nunjucks building static HTML and CSS over say for example TypeScript, Tailwind, and WebC building dynamic islands of interactivity. Or something. Maybe later.

## Constraint / Feature

### JSON export

Currently uses a JSON export file (assumed to be `src/_data/graph.json`) and nothing else. I'm still deciding how I want to handle assets. A good first step would just be to copy them over, but that makes a window of opportunity to view sensitive assets if you know what you're looking for.

That's another thing. Since it's a raw export of *all* notes, you probably don't want to put your export file in the repo.

### Public content

The current flow focuses on public content: pages and blocks with `public:: true`. Everything is private by default, but it's a toggle that can be flipped.

If you have a page you'd like to share, mark that page as public.

If you have a block in your journal you'd like to share, mark that block as public. Eleventy will produce a page for that journal entry containing only the public block. Currently only works for top-level blocks, as I wasn't in the mood to do recursive processing of branches.

If you have a note in your public page that's just for you, mark that block with `public:: false`. Eleventy will not render its content or children. This *does* work anywhere, because it's checked when rendering any given block.

## See Also

- Many ideas grabbed from Rickard Natt och Dag's [devlog][devlog]

[devlog]: https://github.com/believer/devlog

## Author

[Brian Wisti][rgb-home]

[rgb-home]: https://randomgeekery.org

## License

I'm making the work in this experiment available to the public via the [Unlicense][unlicense]. You are free to do whatever you like with the code, templates, and content. That comes with the standard NO WARRANTY disclaimers. See [LICENSE.txt](./LICENSE.txt) for the text.

[unlicense]: https://unlicense.org

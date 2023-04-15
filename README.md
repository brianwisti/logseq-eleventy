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

## See Also

- Many ideas grabbed from Rickard Natt och Dag's [devlog][devlog]

[devlog]: https://github.com/believer/devlog

## Author

[Brian Wisti][rgb-home]

[rgb-home]: https://randomgeekery.org

## License

I'm making the work in this experiment available to the public via the [Unlicense][unlicense]. You are free to do whatever you like with the code, templates, and content. That comes with the standard NO WARRANTY disclaimers. See [LICENSE.txt](./LICENSE.txt) for the text.

[unlicense]: https://unlicense.org

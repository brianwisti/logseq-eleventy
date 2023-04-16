// A Nunjucks filter to filter block content through LogseqMarkdownHandler
const XRegExp = require("xregexp");
const LogseqMarkdownHandler = require("../handlers/LogseqMarkdownHandler.js");
const pages = require("../../_data/pages.js")();

const pageLink = XRegExp(`
  \\[\\[
    (?<pageName> [^|\\]]+ )
    (?<label> \\| (?<textLabel> [^\\]]+ ) )?
  \\]\\]
`, 'xg');

const admonitionBlock = XRegExp(`
  ^ \\#\\+ BEGIN_(?<category> [A-Z]+?) \\n
  (?<content> .+? )
  \\n \\#\\+ END_\\k<category> $
`, 'xm');

const md = LogseqMarkdownHandler();

function getPagePermalink(pageName) {
  const target = pages.find((page) => page["page-name"] === pageName);

  return (target == undefined) ? "/missing/" : `/page/${target.id}`;
}

function handleAdmonitions(content) {
  return XRegExp.replace(content, admonitionBlock, (match, ...args) => {
    const groups = args.pop();
    const admonitionClass = groups.category.toLowerCase();
    const mdContent = md.render(groups.content);
    return `<aside class="${admonitionClass}"><header>${admonitionClass}</header>${mdContent}</aside>`;
  });
}

// I use ID as permalink, which confuses [[WikiLink]] assumptions.
// Do a regex replace until I better understand markdown-it
// TODO: Also, this kind of action is best when loading the collection
function handleWikiLinks(content) {
  return XRegExp.replace(content, pageLink, (match, ...args) => {
    const groups = args.pop();
    const permalink = getPagePermalink(groups.pageName);
    const label = (groups.textLabel) ? groups.textLabel : groups.pageName;
    return `[${label}]({permalink})`;
  });
}

module.exports = function(content) {
  content = handleWikiLinks(content);
  content = handleAdmonitions(content);

  return md.render(content);
}
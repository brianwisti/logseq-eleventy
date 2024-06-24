// A Nunjucks filter to filter block content through LogseqMarkdownHandler
const XRegExp = require("xregexp");
const LogseqMarkdownHandler = require("../handlers/LogseqMarkdownHandler.js");
const pages = require("../../_data/pages.js")();

const pageLink = XRegExp(
  `
  \\[\\[
    (?<pageName> [^|\\]]+ )
    (?<label> \\| (?<textLabel> [^\\]]+ ) )?
  \\]\\]
`,
  "xg"
);

const admonitionBlock = XRegExp(
  `
  ^ \\#\\+ BEGIN_(?<category> [A-Z]+?) \\n
  (?<content> .+? )
  \\n \\#\\+ END_\\k<category> $
`,
  "xm"
);

const videoBlock = XRegExp(
  `
  {{video \\s https://www\\.youtube\\.com/watch\\?v=(?<videoId> .+?)}}
`,
  "x"
);

const md = LogseqMarkdownHandler();

function getPagePermalink(pageName) {
  const target = pages.find((page) => page["page-name"] === pageName);

  return target == undefined ? null : `/${target.permalink}`;
}

function handleAdmonitions(content) {
  return XRegExp.replace(content, admonitionBlock, (match, ...args) => {
    const groups = args.pop();
    const admonitionClass = groups.category.toLowerCase();
    const mdContent = md.render(groups.content);
    return `<aside class="${admonitionClass}"><header>${admonitionClass}</header>${mdContent}</aside>`;
  });
}

function handleVideoEmbeds(content) {
  return XRegExp.replace(content, videoBlock, (match, ...args) => {
    const groups = args.pop();
    const videoId = groups.videoId;
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const embed = `<iframe width="560" height="315" src="${embedUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    return embed;
  });
}

// I use ID as permalink, which confuses [[WikiLink]] assumptions.
// Do a regex replace until I better understand markdown-it
// TODO: Also, this kind of action is best when loading the collection
function handleWikiLinks(content) {
  if (content.startsWith("```")) {
    return content;
  }

  return XRegExp.replace(content, pageLink, (match, ...args) => {
    const groups = args.pop();
    const label = groups.textLabel ? groups.textLabel : groups.pageName;
    const permalink = getPagePermalink(groups.pageName);

    if (!permalink) {
      return `<em>${label}</em>`;
    }
    return `<a href="${permalink}" class="page-link">${label}</a>`;
  });
}

module.exports = function (content) {
  if (content instanceof Array) {
    // This happens with block properties that are page links.
    // In my exact situation that array holds a single string which should link to a page
    content = `[[${content}]]`;
  }

  content = handleWikiLinks(content);
  content = handleAdmonitions(content);
  content = handleVideoEmbeds(content);
  content = md.render(content);

  return content;
};

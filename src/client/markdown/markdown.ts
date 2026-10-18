import MarkdownIt from 'markdown-it';
import {translateText} from '@/client/directives/i18n';

/**
 * Icon kinds available to markdown as `:kind:name:` shortcodes, e.g. `:expansion:venus:`.
 * Each kind maps a name to the CSS classes of nested spans, outermost first. Unknown kinds
 * are left as plain text; names aren't checked, so a misspelled name renders an empty icon.
 */
const MARKDOWN_ICON_KINDS: Record<string, (name: string) => ReadonlyArray<string>> = {
  expansion: (name) => [`expansion-icon expansion-icon-${name}`],
  tag: (name) => [`markdown-tag tag-${name}`],
  icon: (name) => [`markdown-icon markdown-icon-${name}`],
  r: (name) => [`markdown-resource resource_icon--${name}`],
  p: (name) => ['markdown-production', `markdown-resource resource_icon--${name}`],
  cr: (name) => [`markdown-resource card-resource-${name}`],
};

const COLON = ':'.charCodeAt(0);
const ICON = /^:([a-z]+):([a-zA-Z0-9-]+):/;

function create() {
  const md = new MarkdownIt({html: false, linkify: false, breaks: false});

  // Creates a rule called 'icon' before 'emphasis'.
  // Parses `:kind:name:` into an icon token when `kind` is in MARKDOWN_ICON_KINDS.
  md.inline.ruler.before('emphasis', 'icon', (state, silent) => {
    if (state.src.charCodeAt(state.pos) !== COLON) {
      return false;
    }
    const match = ICON.exec(state.src.slice(state.pos));
    if (match === null || !Object.hasOwn(MARKDOWN_ICON_KINDS, match[1])) {
      return false;
    }
    if (!silent) {
      const token = state.push('icon', '', 0);
      token.content = iconHtml(match[1], match[2]);
    }
    state.pos += match[0].length;
    return true;
  });

  // Translates each block's inline source (a paragraph, list item, or heading) before
  // inline parsing, so a whole sentence, icon shortcodes and emphasis included, is one
  // translation key.
  md.core.ruler.before('inline', 'translate', (state) => {
    if ((state.env as MarkdownOptions).translate === false) {
      return;
    }
    for (const token of state.tokens) {
      if (token.type === 'inline') {
        token.content = translateText(token.content);
      }
    }
  });

  // Turns the different icons into its HTML.
  md.renderer.rules.icon = (tokens, idx) => tokens[idx].content;

  // Makes all anchors open on new tabs.
  md.renderer.rules.link_open = (tokens, idx, options, _env, self) => {
    tokens[idx].attrSet('target', '_blank');
    return self.renderToken(tokens, idx, options);
  };

  return md;
}

const md = create();

function iconHtml(kind: string, name: string): string {
  const classes = MARKDOWN_ICON_KINDS[kind](name);
  return classes.map((c) => `<span class="${md.utils.escapeHtml(c)}">`).join('') + '</span>'.repeat(classes.length);
}

export type MarkdownOptions = {
  /** Renders without block wrapping (no `<p>`) and keeps leading and trailing whitespace. Default false. */
  inline?: boolean;
  /** Translates the source before rendering. Turn off for text that's already translated. Default true. */
  translate?: boolean;
};

/**
 * Renders translated markdown with `:icon:` shortcodes as HTML.
 *
 * `:expansion:<name>:`, e.g. :expansion:venus: :expansion:themoon: :expansion:CE:
 *
 * `:tag:<name>:`, e.g. :tag:building:  :tag:space:  :tag:mars:
 *
 * `:r:<name>:` e.g. :r:steel:, :r:megacredits:
 * `:p:<name>:` e.g. :p:steel:, :p:plants:
 * `:cr:<name>:` e.g. :cr:ware:, :cr:syndicate-fleet:
 * Other special icons:
 *  :icon:tr:
 */
export function renderMarkdown(source: string, options: MarkdownOptions = {}): string {
  // Copied because markdown-it stores parse state (e.g. references) on env.
  const env = {...options};
  return options.inline === true ? md.renderInline(source, env) : md.render(source, env);
}

const ICONS = /:([a-z]+):([a-zA-Z0-9-]+):/g;

/**
 * Lighter alternative to renderMarkdown for text that is only icons: escapes `text` and
 * renders its `:icon:` shortcodes, but no other markdown and no translation.
 */
export function renderIcons(text: string): string {
  // Escaping leaves shortcodes intact, since it never touches `:` or name characters.
  return md.utils.escapeHtml(text).replace(ICONS, (match, kind: string, name: string) =>
    Object.hasOwn(MARKDOWN_ICON_KINDS, kind) ? iconHtml(kind, name) : match);
}

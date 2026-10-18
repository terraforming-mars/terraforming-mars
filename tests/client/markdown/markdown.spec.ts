import {expect} from 'chai';
import {renderIcons, renderMarkdown} from '@/client/markdown/markdown';
import {PreferencesManager} from '@/client/utils/PreferencesManager';

describe('markdown', () => {
  afterEach(() => {
    localStorage.removeItem('lang');
    PreferencesManager.resetForTest();
    delete (window as any)._translations;
  });

  it('renders icon shortcodes', () => {
    expect(renderMarkdown('Venus :expansion:venus: rules')).eq(
      '<p>Venus <span class="expansion-icon expansion-icon-venus"></span> rules</p>\n');
  });

  it('allows uppercase names', () => {
    expect(renderMarkdown(':expansion:deltaProject:')).eq(
      '<p><span class="expansion-icon expansion-icon-deltaProject"></span></p>\n');
  });

  it('renders standard resources', () => {
    expect(renderMarkdown(':r:steel:')).eq(
      '<p><span class="markdown-resource resource_icon--steel"></span></p>\n');
  });

  it('renders card resources', () => {
    expect(renderMarkdown(':cr:syndicate-fleet:')).eq(
      '<p><span class="markdown-resource card-resource-syndicate-fleet"></span></p>\n');
  });

  it('renders production', () => {
    expect(renderMarkdown(':p:plants: :p:heat:')).eq(
      '<p><span class="markdown-production"><span class="markdown-resource resource_icon--plants"></span></span> ' +
      '<span class="markdown-production"><span class="markdown-resource resource_icon--heat"></span></span></p>\n');
  });

  it('leaves unknown kinds as text', () => {
    expect(renderMarkdown('Time: 10:30: :unknown:venus:')).eq('<p>Time: 10:30: :unknown:venus:</p>\n');
  });

  it('does not render raw HTML', () => {
    expect(renderMarkdown('<b>bold</b>')).eq('<p>&lt;b&gt;bold&lt;/b&gt;</p>\n');
  });

  it('opens links in a new tab', () => {
    expect(renderMarkdown('[a](https://example.com)')).eq(
      '<p><a href="https://example.com" target="_blank">a</a></p>\n');
  });

  it('inline keeps surrounding whitespace and has no block wrapping', () => {
    expect(renderMarkdown(' spent :r:energy: and :cr:ware: <b>:unknown:x:</b> ', {inline: true})).eq(
      ' spent <span class="markdown-resource resource_icon--energy"></span> and ' +
      '<span class="markdown-resource card-resource-ware"></span> &lt;b&gt;:unknown:x:&lt;/b&gt; ');
  });

  it('inline renders production', () => {
    expect(renderMarkdown('Gain 1:p:steel:', {inline: true})).eq(
      'Gain 1<span class="markdown-production"><span class="markdown-resource resource_icon--steel"></span></span>');
  });

  it('translate: false skips translation', () => {
    PreferencesManager.INSTANCE.set('lang', 'de');
    (window as any)._translations = {'Goal': 'Ziel'};

    expect(renderMarkdown('Goal', {inline: true, translate: false})).eq('Goal');
    expect(renderMarkdown('Goal', {inline: true})).eq('Ziel');
  });

  it('renderIcons renders icons, escapes HTML, and ignores other markdown', () => {
    expect(renderIcons(' spent 3:p:heat: *and* <b>:unknown:x:</b> 10:30: ')).eq(
      ' spent 3<span class="markdown-production"><span class="markdown-resource resource_icon--heat"></span></span> ' +
      '*and* &lt;b&gt;:unknown:x:&lt;/b&gt; 10:30: ');
  });

  it('translates each block, icons included', () => {
    PreferencesManager.INSTANCE.set('lang', 'de');
    (window as any)._translations = {
      'Goal': 'Ziel',
      'Standard Mode (:tag:mars:): you win.': ':tag:mars: Standardmodus: du gewinnst.',
    };

    expect(renderMarkdown('### Goal\n\n- Standard Mode (:tag:mars:): you win.\n')).eq(
      '<h3>Ziel</h3>\n' +
      '<ul>\n<li><span class="markdown-tag tag-mars"></span> Standardmodus: du gewinnst.</li>\n</ul>\n');
  });
});

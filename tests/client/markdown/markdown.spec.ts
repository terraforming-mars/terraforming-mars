import {expect} from 'chai';
import {renderMarkdown} from '@/client/markdown/markdown';
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

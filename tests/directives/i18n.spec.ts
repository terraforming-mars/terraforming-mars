import {expect} from 'chai';

import {translateText} from '../../src/directives/i18n';
import {PreferencesManager} from '../../src/components/PreferencesManager';

describe('i18n', function() {
  let expectedLanguage = '';
  const originalLoadValue = PreferencesManager.loadValue;
  before(function() {
    PreferencesManager.loadValue = function() {
      return expectedLanguage;
    };
  });
  after(function() {
    PreferencesManager.loadValue = originalLoadValue;
  });
  it('can translate regular expression number patterns', function() {
    expectedLanguage = 'fr';
    const n = Math.floor(Math.random() * 100);
    expect(translateText(`Player ${n} name`)).to.eq(`Nom du joueur ${n}`);
  });
});


import {expect} from 'chai';
import {FakeLocalStorage} from '../components/FakeLocalStorage';
import {PreferencesManager} from '../../src/client/utils/PreferencesManager';

describe('PreferencesManager', () => {
  let localStorage: FakeLocalStorage;
  let instance: PreferencesManager;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
    PreferencesManager.resetForTest();
    instance = PreferencesManager.INSTANCE;
  });
  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('default values', () => {
    const values = instance.values();
    expect(values.hide_active_cards).eq(false);
    expect(values.lang).eq('en');
    expect(values.enable_sounds).eq(true);
  });
});

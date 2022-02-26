import {expect} from 'chai';
import {FakeLocalStorage} from './components/FakeLocalStorage';
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

  it('setter updates storage and references', () => {
    const values = instance.values();

    expect(values.hide_active_cards).eq(false);
    expect(localStorage.hasItem('hide_active_cards')).is.false;
    expect(localStorage.getItem('hide_active_cards')).is.null;

    instance.set('hide_active_cards', true);

    expect(localStorage.getItem('hide_active_cards')).eq('1');
    expect(localStorage.hasItem('hide_active_cards')).is.true;
    expect(values.hide_active_cards).eq(true);

    instance.set('hide_active_cards', false);

    expect(localStorage.getItem('hide_active_cards')).eq('0');
    expect(values.hide_active_cards).eq(false);
  });

  it('setter does not update when setOnChange is true', () => {
    const values = instance.values();

    expect(values.hide_active_cards).eq(false);
    expect(localStorage.hasItem('hide_active_cards')).is.false;
    expect(localStorage.getItem('hide_active_cards')).is.null;

    instance.set('hide_active_cards', false, /* setOnChange */ true);

    expect(localStorage.hasItem('hide_active_cards')).is.false;
    expect(values.hide_active_cards).eq(false);
  });

  it('initially stored values override defaults', () => {
    localStorage.setItem('lang', 'fr');
    PreferencesManager.resetForTest();

    const values = PreferencesManager.INSTANCE.values();

    expect(values.lang).eq('fr');
  });
});

import {expect} from 'chai';
import {useFakeLocalStorage} from './components/FakeLocalStorage';
import {PreferencesManager} from '../../src/client/utils/PreferencesManager';

describe('PreferencesManager', () => {
  useFakeLocalStorage();
  let instance: PreferencesManager;

  beforeEach(() => {
    PreferencesManager.resetForTest();
    instance = PreferencesManager.INSTANCE;
  });
  afterEach(() => {
    PreferencesManager.resetForTest();
  });

  it('default values', () => {
    const values = instance.values();
    expect(values.hide_active_cards).eq(false);
    expect(values.lang).eq('en');
    expect(values.enable_sounds).eq(true);
    expect(values.animated_title).eq(true);
  });

  it('setter updates storage and references', () => {
    const values = instance.values();

    expect(values.hide_active_cards).eq(false);
    expect(global.localStorage.hasItem('hide_active_cards')).is.false;
    expect(global.localStorage.getItem('hide_active_cards')).is.null;

    instance.set('hide_active_cards', true);

    expect(global.localStorage.getItem('hide_active_cards')).eq('1');
    expect(global.localStorage.hasItem('hide_active_cards')).is.true;
    expect(values.hide_active_cards).eq(true);

    instance.set('hide_active_cards', false);

    expect(global.localStorage.getItem('hide_active_cards')).eq('0');
    expect(values.hide_active_cards).eq(false);
  });

  it('setter does not update when setOnChange is true', () => {
    const values = instance.values();

    expect(values.hide_active_cards).eq(false);
    expect(global.localStorage.hasItem('hide_active_cards')).is.false;
    expect(global.localStorage.getItem('hide_active_cards')).is.null;

    instance.set('hide_active_cards', false, /* setOnChange */ true);

    expect(global.localStorage.hasItem('hide_active_cards')).is.false;
    expect(values.hide_active_cards).eq(false);
  });

  it('initially stored values override defaults', () => {
    global.localStorage.setItem('lang', 'fr');
    PreferencesManager.resetForTest();

    const values = PreferencesManager.INSTANCE.values();

    expect(values.lang).eq('fr');
  });
});

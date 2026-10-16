import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import LoadGameForm from '@/client/components/LoadGameForm.vue';

describe('LoadGameForm', () => {
  let originalFetch: typeof global.fetch;
  let originalUrl: string;

  beforeEach(() => {
    originalFetch = global.fetch;
    originalUrl = window.location.href;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    window.history.replaceState(null, '', originalUrl);
  });

  function mount() {
    return shallowMount(LoadGameForm, {
      ...globalConfig,
      parentComponent: {
        data() {
          return {
            game: undefined,
            screen: 'empty',
          };
        },
        methods: {
          getVisibilityState: () => false,
          setVisibilityState: () => {},
        },
      } as any,
    });
  }

  it('mounts without errors', () => {
    const wrapper = mount();
    expect(wrapper.exists()).to.be.true;
  });

  it('forwards the server id to load_game', () => {
    const urls: Array<string> = [];
    global.fetch = (url) => {
      urls.push(String(url));
      return new Promise(() => {});
    };
    window.history.replaceState(null, '', '/load?serverId=abc%2F1');
    const wrapper = mount();

    wrapper.setData({gameId: 'g123', rollbackCount: 1});
    (wrapper.vm as any).loadGame();

    expect(urls).deep.eq(['load_game?serverId=abc%2F1']);
  });

  it('sends an empty server id when the page has none', () => {
    const urls: Array<string> = [];
    global.fetch = (url) => {
      urls.push(String(url));
      return new Promise(() => {});
    };
    window.history.replaceState(null, '', '/load');
    const wrapper = mount();

    wrapper.setData({gameId: 'g123', rollbackCount: 1});
    (wrapper.vm as any).loadGame();

    expect(urls).deep.eq(['load_game?serverId=']);
  });
});

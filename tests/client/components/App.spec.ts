import {flushPromises, shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {afterEach, vi} from 'vitest';
import {defineAsyncComponent} from 'vue';
import {globalConfig} from '@tests/client/components/getLocalVue';
import App from '@/client/components/App.vue';

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('mounts without errors', () => {
    const wrapper = shallowMount(App, globalConfig);
    expect(wrapper.exists()).to.be.true;
  });

  // Mounts the start screen with an import() that rejects with `err`. Returns the alert spy and
  // the errors that went past App to the app's error handler.
  async function mountWithFailingStartScreen(err: Error) {
    const showAlert = vi.spyOn((App as any).methods, 'showAlert').mockImplementation(() => {});
    const unhandled: Array<unknown> = [];
    shallowMount(App, {
      ...globalConfig,
      global: {
        ...globalConfig.global,
        config: {...globalConfig.global.config, errorHandler: (e: unknown) => unhandled.push(e)},
        stubs: {StartScreen: defineAsyncComponent(() => Promise.reject(err))},
      },
    });
    await flushPromises();
    return {showAlert, unhandled};
  }

  it('asks for a refresh when a screen fails to load', async () => {
    const err = Object.assign(new Error('Loading chunk 996 failed.'), {name: 'ChunkLoadError'});
    const {showAlert, unhandled} = await mountWithFailingStartScreen(err);
    expect(showAlert.mock.calls).has.length(1);
    expect(showAlert.mock.calls[0][1]).eq('This page is out of date. Click OK to refresh it.');
    // Still logged as usual.
    expect(unhandled).deep.eq([err]);
  });

  it('leaves other errors alone', async () => {
    const err = new Error('boom');
    const {showAlert, unhandled} = await mountWithFailingStartScreen(err);
    expect(showAlert.mock.calls).is.empty;
    expect(unhandled).deep.eq([err]);
  });
});

import {mount, shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import PopupPanel from '@/client/components/common/PopupPanel.vue';

function mountPanel(props: {closeOnOutsideClick?: boolean} = {}) {
  return mount(PopupPanel, {
    ...globalConfig,
    props,
    slots: {default: '<p class="content">Content</p>'},
  });
}

type Where = 'inside' | 'outside';

function target(wrapper: ReturnType<typeof mountPanel>, where: Where) {
  return wrapper.find(where === 'outside' ? '.popup-outer' : '.content');
}

/*
 * Simulates a mouse press on `down` released on `up`.
 *
 * Like a browser, sends the click to `up` when both are the same element, otherwise to the backdrop,
 * their nearest common ancestor here.
 */
async function press(wrapper: ReturnType<typeof mountPanel>, down: Where, up: Where) {
  await target(wrapper, down).trigger('mousedown');
  await target(wrapper, up).trigger('mouseup');
  await target(wrapper, down === up ? up : 'outside').trigger('click');
}

describe('PopupPanel', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(PopupPanel, {
      ...globalConfig,
    });
    expect(wrapper.exists()).to.be.true;
  });

  for (const run of [
    {down: 'outside', up: 'outside', closes: true},
    {down: 'inside', up: 'inside', closes: false},
    {down: 'inside', up: 'outside', closes: false},
    {down: 'outside', up: 'inside', closes: false},
  ] as const) {
    it(`closes only on a click fully outside the panel ${JSON.stringify(run)}`, async () => {
      const wrapper = mountPanel();
      await press(wrapper, run.down, run.up);
      expect(wrapper.emitted('close') !== undefined).eq(run.closes);
    });
  }

  it('does not close when clicking outside if closeOnOutsideClick is false', async () => {
    const wrapper = mountPanel({closeOnOutsideClick: false});
    await press(wrapper, 'outside', 'outside');
    expect(wrapper.emitted('close')).is.undefined;
  });

  it('closes with the Close button', async () => {
    const wrapper = mountPanel();
    await wrapper.find('.close-button').trigger('click');
    expect(wrapper.emitted('close')).to.have.length(1);
  });
});

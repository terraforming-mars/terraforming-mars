import {shallowMount} from '@vue/test-utils';
import {getLocalVue} from '../getLocalVue';
import {expect} from 'chai';
import Button from '@/client/components/common/Button.vue';

describe('Button', () => {
  it('emits click event on click', async () => {
    const wrapper = shallowMount(Button, {
      localVue: getLocalVue(),
    });

    await wrapper.trigger('click');
    expect(wrapper.emitted('click')?.length).to.eq(1);
  });

  it('renders title', () => {
    const title = 'test';
    const wrapper = shallowMount(Button, {
      localVue: getLocalVue(),
      propsData: {title},
    });

    expect(wrapper.text()).to.eq(title);
  });

  it('not renders title if type close|back|plus|minus is passed', () => {
    const title = 'test';
    const types = ['close', 'back', 'plus', 'minus'];

    types.forEach((type) => {
      const wrapper = shallowMount(Button, {
        localVue: getLocalVue(),
        propsData: {title, type},
      });

      expect(wrapper.text()).to.not.include(title);
    });
  });

  it('is disabled if disabled is passed', () => {
    const wrapper = shallowMount(Button, {
      localVue: getLocalVue(),
      propsData: {disabled: true},
    });

    expect(wrapper.attributes('disabled')).to.eq('disabled');
  });

  it('is not disabled if no disabled is passed', () => {
    const wrapper = shallowMount(Button, {
      localVue: getLocalVue(),
    });

    expect(wrapper.attributes('disabled')).to.eq(undefined);
  });

  // TODO - why mock $root doesn't work?
  // (info: $root in vue app and $root in test environment are not the same)

  // it('is disabled if disableOnServerBusy is passed and server is busy', async () => {
  //   const wrapper = shallowMount(Button, {
  //     localVue: getLocalVue(),
  //     propsData: {disableOnServerBusy: true},
  //     mocks: {
  //       $root: {isServerSideRequestInProgress: true},
  //     },
  //   });

  //   expect(wrapper.attributes('disabled')).to.eq('disabled');
  // });

  // it('is not disabled if disableOnServerBusy is passed and server is not busy', async () => {
  //   const wrapper = shallowMount(Button, {
  //     localVue: getLocalVue(),
  //     propsData: {disableOnServerBusy: true},
  //     mocks: {
  //       $root: {isServerSideRequestInProgress: true},
  //     },
  //   });

  //   expect(wrapper.attributes('disabled')).to.eq(undefined);
  // });

  // it('has loading class if disableOnServerBusy is passed and server is busy', () => {});

  /**
   * Align classes
   */
  it('has float-left class if align left is passed', () => {
    const wrapper = shallowMount(Button, {
      localVue: getLocalVue(),
      propsData: {align: 'left'},
    });

    expect(wrapper.classes()).to.include('float-left');
  });

  it('has float-right class if align right is passed', () => {
    const wrapper = shallowMount(Button, {
      localVue: getLocalVue(),
      propsData: {align: 'right'},
    });

    expect(wrapper.classes()).to.include('float-right');
  });

  /**
   * Size classes
   */
  it('has btn-tiny class if size tiny is passed', () => {
    const wrapper = shallowMount(Button, {
      localVue: getLocalVue(),
      propsData: {size: 'tiny'},
    });

    expect(wrapper.classes()).to.include('btn-tiny');
  });

  it('has btn-sm class if size small is passed', () => {
    const wrapper = shallowMount(Button, {
      localVue: getLocalVue(),
      propsData: {size: 'small'},
    });

    expect(wrapper.classes()).to.include('btn-sm');
  });

  it('has btn-lg class if size big is passed', () => {
    const wrapper = shallowMount(Button, {
      localVue: getLocalVue(),
      propsData: {size: 'big'},
    });

    expect(wrapper.classes()).to.include('btn-lg');
  });

  /**
   * Type classes
   */
  it('has btn-X class if type X is passed', () => {
    // Not every type prop results with own class
    // This is a collective test to not repeat the code like above
    const types = [
      // 'normal'
      'action',
      'max',
      'success',
      'error',
      'submit',
      // 'close'
      // 'back',
      'minus',
      'plus',
    ];

    types.forEach((type) => {
      const wrapper = shallowMount(Button, {
        localVue: getLocalVue(),
        propsData: {type},
      });

      expect(wrapper.classes()).to.include(`btn-${type}`);
    });
  });

  it('has icon class if type of icon is passed', () => {
    const iconTypes = [
      'close',
      'back',
      'minus',
      'plus',
    ];

    iconTypes.forEach((iconType) => {
      const wrapper = shallowMount(Button, {
        localVue: getLocalVue(),
        propsData: {type: iconType},
      });

      if (iconType === 'close') {
        iconType = 'cross';
      }

      expect(wrapper.find('[data-test="icon"]').classes()).to.include(`icon-${iconType}`);
    });
  });
});

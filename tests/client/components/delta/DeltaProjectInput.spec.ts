import {mount, shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from '../getLocalVue';
import DeltaProjectInput from '@/client/components/delta/DeltaProjectInput.vue';
import {DeltaProjectInputModel} from '@/common/models/PlayerInputModel';
import {DeltaProjectInputResponse, InputResponse} from '@/common/inputs/InputResponse';
import {fakePlayerViewModel} from '../testHelpers';
import {FakeLocalStorage} from '../FakeLocalStorage';

function inputModel(validSteps: ReadonlyArray<number>): DeltaProjectInputModel {
  return {
    title: 'Select energy to spend',
    buttonLabel: 'Advance',
    type: 'deltaProject',
    validSteps,
  };
}

describe('DeltaProjectInput', () => {
  let localStorage: FakeLocalStorage;

  let saved: InputResponse | undefined;

  const DEFAULT_PROPS = {
    playerView: fakePlayerViewModel(),
    playerinput: inputModel([1, 2, 3]),
    onsave: (out: InputResponse) => {
      saved = out;
    },
    showsave: true,
    showtitle: true,
  };

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });

  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('mounts and renders one option per valid step', () => {
    const wrapper = shallowMount(DeltaProjectInput, {
      ...globalConfig,
      props: DEFAULT_PROPS,
    });
    expect(wrapper.findAll('option')).to.have.length(3);
  });

  it('default amount is the first valid step', () => {
    const wrapper = shallowMount(DeltaProjectInput, {
      ...globalConfig,
      props: {
        ...DEFAULT_PROPS,
        playerinput: inputModel([2, 4]),
      },
    });
    expect((wrapper.vm as unknown as {amount: number}).amount).to.eq(2);
  });

  it('setMaxValue selects the last valid step', () => {
    const wrapper = shallowMount(DeltaProjectInput, {
      ...globalConfig,
      props: {
        ...DEFAULT_PROPS,
        playerinput: inputModel([1, 3, 5]),
      },
    });
    const vm = wrapper.vm as unknown as {amount: number, setMaxValue(): void};
    vm.setMaxValue();
    expect(vm.amount).to.eq(5);
  });

  it('saveData emits the selected amount as a deltaProject response', () => {
    const wrapper = shallowMount(DeltaProjectInput, {
      ...globalConfig,
      props: {
        ...DEFAULT_PROPS,
        playerinput: inputModel([1, 2, 3]),
      },
    });
    const vm = wrapper.vm as unknown as {amount: number, saveData(): void};
    vm.amount = 3;
    vm.saveData();
    expect(saved).to.deep.eq({type: 'deltaProject', amount: 3} as DeltaProjectInputResponse);
  });

  it('clicking the advance button submits the response', async () => {
    const wrapper = mount(DeltaProjectInput, {
      ...globalConfig,
      props: {
        ...DEFAULT_PROPS,
        playerinput: inputModel([1, 2]),
      },
    });
    const buttons = wrapper.findAllComponents({name: 'AppButton'});
    // Buttons: [MAX, Advance].
    await buttons[buttons.length - 1].trigger('click');
    expect(saved).to.deep.eq({type: 'deltaProject', amount: 1});
  });
});

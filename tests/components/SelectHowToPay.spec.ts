import {createLocalVue, mount} from '@vue/test-utils';
import {expect} from 'chai';
import {SelectHowToPay, SelectHowToPayModel} from '../../src/components/SelectHowToPay';
import {PlayerInputModel} from '../../src/models/PlayerInputModel';
import {PlayerModel} from '../../src/models/PlayerModel';

export type Unit = 'heat' | 'steel' | 'titanium' | 'floaters' | 'microbes' | 'megaCredits';

describe('SelectHowToPay', () => {
  function getLocalVue() {
    const localVue = createLocalVue();
    localVue.directive('i18n', {});
    localVue.directive('trim-whitespace', {});
    return localVue;
  }

  it('select how to pay uses heat', async () => {
    const wrapper = setupBill(
      10,
      {heat: 5, megaCredits: 7},
      {canUseHeat: true});

    const vm = wrapper.vm;
    await vm.$nextTick();

    expectValue(vm, wrapper, 'heat', 3);
    expectValue(vm, wrapper, 'megaCredits', 7);

    clickMax(wrapper, 'heat');
    await vm.$nextTick();

    expectValue(vm, wrapper, 'heat', 5);
    expectValue(vm, wrapper, 'megaCredits', 5);

    clickMinus(wrapper, 'heat');
    await vm.$nextTick();

    expectValue(vm, wrapper, 'heat', 4);
    expectValue(vm, wrapper, 'megaCredits', 6);

    clickMinus(wrapper, 'heat');
    await vm.$nextTick();

    expectValue(vm, wrapper, 'heat', 3);
    expectValue(vm, wrapper, 'megaCredits', 7);

    clickPlus(wrapper, 'heat');
    await vm.$nextTick();

    expectValue(vm, wrapper, 'heat', 4);
    expectValue(vm, wrapper, 'megaCredits', 6);
  });

  it('select how to pay uses steel', async () => {
    const wrapper = setupBill(
      10,
      {steel: 4, megaCredits: 7, steelValue: 2},
      {canUseSteel: true});

    const vm = wrapper.vm;
    await vm.$nextTick();

    expectValue(vm, wrapper, 'steel', 4);
    expectValue(vm, wrapper, 'megaCredits', 2);
  });

  it('select how to pay uses titanium metal bonus', async () => {
    const wrapper = setupBill(
      10,
      {megaCredits: 2, titanium: 4, titaniumValue: 7},
      {canUseTitanium: true});

    const vm = wrapper.vm;
    await vm.$nextTick();

    expectValue(vm, wrapper, 'titanium', 2);
    expectValue(vm, wrapper, 'megaCredits', 0);
  });

  const setupBill = function(
    amount: number,
    playerFields: Partial<PlayerModel>,
    playerInputFields: Partial<PlayerInputModel>) {
    const player: Partial<PlayerModel> = Object.assign({
      id: 'foo',
      steel: 0,
      titanium: 0,
      heat: 0,
      steelValue: 2,
      titaniumValue: 3,
    }, playerFields);

    const playerInput: Partial<PlayerInputModel> = Object.assign({
      amount: amount,
      title: 'foo',
      microbes: 0,
      floaters: 0,
      science: 0,
    }, playerInputFields);

    return mount(SelectHowToPay, {
      localVue: getLocalVue(),
      propsData: {
        player: player,
        playerinput: playerInput,
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
  };

  const selector = function(type: Unit) {
    const re = type === 'megaCredits' ? 'Megacredits' : (type.charAt(0).toUpperCase() + type.slice(1)); // (eg steel -> Steel)
    return '[title~=' + re + ']';
  };

  const clickMax = async function(wrapper: any, type: Unit) {
    const button = wrapper.find(selector(type) + ' ~ .btn-max');
    await button.trigger('click');
  };

  const clickMinus = async function(wrapper: any, type: Unit) {
    const button = wrapper.find(selector(type) + ' ~ .btn-minus');
    await button.trigger('click');
  };

  const clickPlus = async function(wrapper: any, type: Unit) {
    const button = wrapper.find(selector(type) + ' ~ .btn-plus');
    await button.trigger('click');
  };

  const expectValue = function(model: SelectHowToPayModel, wrapper: any, type: Unit, amount: number) {
    let vmVal: number | undefined;
    switch (type) {
    case 'heat':
      vmVal = model.heat;
      break;
    case 'steel':
      vmVal = model.steel;
      break;
    case 'titanium':
      vmVal = model.titanium;
      break;
    case 'floaters':
      vmVal = model.floaters;
      break;
    case 'microbes':
      vmVal = model.microbes;
      break;
    case 'megaCredits':
      vmVal = model.megaCredits;
      break;
    }
    const textBox = wrapper.find(selector(type) + ' ~ input').element as HTMLInputElement;
    expect(textBox.value, 'text box value for ' + type).eq(String(amount));
    expect(vmVal, 'VM box value for ' + type).eq(amount);
  };
});

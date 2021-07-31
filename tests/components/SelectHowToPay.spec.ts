import {createLocalVue, mount} from '@vue/test-utils';
import SelectHowToPay from '../../src/components/SelectHowToPay.vue';
import {PlayerInputModel} from '../../src/models/PlayerInputModel';
import {PlayerModel} from '../../src/models/PlayerModel';
import {PaymentTester} from './PaymentTester';

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

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('heat', 3);
    tester.expectValue('megaCredits', 7);

    await tester.clickMax('heat');

    tester.expectValue('heat', 5);
    tester.expectValue('megaCredits', 5);

    await tester.clickMinus('heat');

    tester.expectValue('heat', 4);
    tester.expectValue('megaCredits', 6);

    await tester.clickMinus('heat');

    tester.expectValue('heat', 3);
    tester.expectValue('megaCredits', 7);

    await tester.clickPlus('heat');

    tester.expectValue('heat', 4);
    tester.expectValue('megaCredits', 6);
  });

  it('select how to pay uses steel', async () => {
    const wrapper = setupBill(
      10,
      {steel: 4, megaCredits: 7, steelValue: 2},
      {canUseSteel: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('steel', 4);
    tester.expectValue('megaCredits', 2);
  });

  it('select how to pay uses titanium metal bonus', async () => {
    const wrapper = setupBill(
      10,
      {megaCredits: 2, titanium: 4, titaniumValue: 7},
      {canUseTitanium: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('titanium', 2);
    tester.expectValue('megaCredits', 0);
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
});

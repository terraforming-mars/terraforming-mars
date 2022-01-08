import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import SelectHowToPay from '@/client/components/SelectHowToPay.vue';
import {PlayerInputModel} from '@/models/PlayerInputModel';
import {PlayerViewModel, PublicPlayerModel} from '@/models/PlayerModel';
import {PaymentTester} from './PaymentTester';

describe('SelectHowToPay', () => {
  it('Uses heat', async () => {
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

  it('Uses steel', async () => {
    const wrapper = setupBill(
      10,
      {steel: 4, megaCredits: 7, steelValue: 2},
      {canUseSteel: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('steel', 4);
    tester.expectValue('megaCredits', 2);
  });

  it('Check initial value, use steel and titanium, but not enough steel', async () => {
    const wrapper = setupBill(
      10,
      {steel: 1, titanium: 2, megaCredits: 7, steelValue: 2, titaniumValue: 3},
      {canUseSteel: true, canUseTitanium: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('steel', 1);
    tester.expectValue('titanium', 2);
    tester.expectValue('megaCredits', 2);
  });

  it('Uses titanium bonus', async () => {
    const wrapper = setupBill(
      10,
      {megaCredits: 2, titanium: 4, titaniumValue: 7},
      {canUseTitanium: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('titanium', 2);
    tester.expectValue('megaCredits', 0);
  });

  it('Uses seeds', async () => {
    const wrapper = setupBill(
      14,
      {megaCredits: 6},
      {canUseSeeds: true, seeds: 4});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('seeds', 2);
    tester.expectValue('megaCredits', 4);
  });

  it('Default seed value uses more than minimum when there are not enough MC', async () => {
    const wrapper = setupBill(
      14,
      {megaCredits: 2},
      {canUseSeeds: true, seeds: 4});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('seeds', 3);
    tester.expectValue('megaCredits', 0);
  });

  it('initial values, multiple values', async () => {
    const wrapper = setupBill(
      10,
      {megaCredits: 2, titanium: 4, titaniumValue: 4, heat: 3},
      {canUseTitanium: true, canUseHeat: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    // Using this as a chance to test that other components aren't visible.
    tester.expectIsAvailable('steel', false);
    tester.expectIsAvailable('titanium', true);
    tester.expectIsAvailable('heat', true);
    tester.expectIsAvailable('megaCredits', true);
    tester.expectIsAvailable('science', false);
    tester.expectIsAvailable('seeds', false);

    tester.expectValue('titanium', 2);
    tester.expectValue('heat', 0);
    tester.expectValue('megaCredits', 2);
  });

  it('can pay, no resources', async () => {
    const wrapper = setupBill(
      10,
      {megaCredits: 12, titanium: 0, titaniumValue: 3, steelValue: 2, heat: 0},
      {canUseTitanium: true, canUseHeat: true, canUseSteel: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectIsAvailable('seeds', false);
    tester.expectValue('titanium', 0);
    tester.expectValue('steel', 0);
    tester.expectValue('heat', 0);
    tester.expectValue('megaCredits', 10);
  });

  const setupBill = function(
    amount: number,
    playerFields: Partial<PublicPlayerModel>,
    playerInputFields: Partial<PlayerInputModel>) {
    const thisPlayer: Partial<PublicPlayerModel> = Object.assign({
      steel: 0,
      titanium: 0,
      heat: 0,
      steelValue: 2,
      titaniumValue: 3,
    }, playerFields);
    const playerView: Partial<PlayerViewModel> = {
      thisPlayer: thisPlayer as PublicPlayerModel,
      id: 'foo',
    };

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
        playerView: playerView,
        playerinput: playerInput,
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
  };
});

import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import SelectPayment from '@/client/components/SelectPayment.vue';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {PaymentTester} from './PaymentTester';
import {CardName} from '@/common/cards/CardName';
import {CardModel} from '@/common/models/CardModel';

describe('SelectPayment', () => {
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

  it('Uses data', async () => {
    const wrapper = setupBill(
      14,
      {megaCredits: 6},
      {canUseData: true, data: 4});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('data', 4);
    tester.expectValue('megaCredits', 2);
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
    tester.expectIsAvailable('data', false);

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
    tester.expectIsAvailable('data', false);
    tester.expectValue('titanium', 0);
    tester.expectValue('steel', 0);
    tester.expectValue('heat', 0);
    tester.expectValue('megaCredits', 10);
  });

  it('max megacredits', async () => {
    const wrapper = setupBill(
      9,
      {megaCredits: 16, heat: 3},
      {canUseHeat: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('heat', 0);
    tester.expectValue('megaCredits', 9);

    await tester.clickMax('heat');
    await tester.nextTick();

    tester.expectValue('heat', 3);
    tester.expectValue('megaCredits', 6);

    await tester.clickMax('megaCredits');
    await tester.nextTick();

    tester.expectValue('heat', 0);
    tester.expectValue('megaCredits', 9);
  });

  it('max megacredits, 2', async () => {
    const wrapper = setupBill(
      10,
      {megaCredits: 5, titanium: 4, titaniumValue: 4, heat: 3},
      {canUseTitanium: true, canUseHeat: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('titanium', 2);
    tester.expectValue('heat', 0);
    tester.expectValue('megaCredits', 2);

    await tester.clickMax('megaCredits');
    await tester.nextTick();

    tester.expectValue('titanium', 2);
    tester.expectValue('heat', 0);
    tester.expectValue('megaCredits', 5);
  });

  it('Stormcraft floaters count for heat', async () => {
    // Must spend 10. Player has 7M€ and will use 3 of the 4 available heat units.
    const wrapper = setupBill(
      10,
      {
        heat: 2,
        megaCredits: 3,
        tableau: [
          {
            name: CardName.STORMCRAFT_INCORPORATED,
            resources: 5,
          } as CardModel,
          {
            // Dirigibles is here to show that it's got floaters, but is ignored.
            name: CardName.DIRIGIBLES,
            resources: 3,
          } as CardModel,
        ]},
      {canUseHeat: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectIsAvailable('heat', true);
    tester.expectValue('heat', 7);
    tester.clickSave();
  });

  it('Max includes Stormcraft floaters', async () => {
    // Action costs 10. Player has 10 MC, 3 heat, and 1 floaters.
    //
    // Initial setup will be that it selects 10MC.
    //
    // Then when clicking the 'max' button for heat, the algorithm will switch to 5M€ and 5 heat.

    const wrapper = setupBill(
      10,
      {
        heat: 3, megaCredits: 10, titaniumValue: 1, steelValue: 1,
        tableau: [
          {
            name: CardName.STORMCRAFT_INCORPORATED,
            resources: 1,
          } as CardModel,
        ],
      },
      {canUseHeat: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('megaCredits', 10);
    tester.expectValue('heat', 0);

    await tester.clickMax('heat');

    tester.expectValue('megaCredits', 5);
    tester.expectValue('heat', 5);
  });

  it('Luna Trade Federation: Can use titanium by default', async () => {
    const wrapper = setupBill(
      10,
      {
        megaCredits: 10, titanium: 2, titaniumValue: 4,
      },
      {canUseLunaTradeFederationTitanium: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('megaCredits', 10);
    tester.expectValue('titanium', 0);

    await tester.clickMax('titanium');

    tester.expectValue('megaCredits', 4);
    tester.expectValue('titanium', 2);
  });

  it('Luna Trade Federation: Can use titanium at normal rate when canUseTitanium is true', async () => {
    const wrapper = setupBill(
      10,
      {
        megaCredits: 10, titanium: 2, titaniumValue: 4,
      },
      {canUseLunaTradeFederationTitanium: true, canUseTitanium: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('megaCredits', 2);
    tester.expectValue('titanium', 2);

    await(tester.clickMinus('titanium'));

    tester.expectValue('megaCredits', 6);
    tester.expectValue('titanium', 1);

    await tester.clickMax('titanium');

    tester.expectValue('megaCredits', 2);
    tester.expectValue('titanium', 2);
  });

  const setupBill = function(
    amount: number,
    playerFields: Partial<PublicPlayerModel>,
    playerInputFields: Partial<PlayerInputModel>) {
    const thisPlayer: Partial<PublicPlayerModel> = {
      steel: 0,
      titanium: 0,
      heat: 0,
      steelValue: 2,
      titaniumValue: 3,
      tableau: [],
      ...playerFields};

    const playerView: Partial<PlayerViewModel> = {
      thisPlayer: thisPlayer as PublicPlayerModel,
      id: 'playerid-foo',
    };

    const playerInput: Partial<PlayerInputModel> = {
      amount: amount,
      title: 'foo',
      microbes: 0,
      floaters: 0,
      science: 0,
      ...playerInputFields,
    };

    return mount(SelectPayment, {
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

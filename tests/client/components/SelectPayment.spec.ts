import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import SelectPayment from '@/client/components/SelectPayment.vue';
import {SelectPaymentModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {PaymentTester} from './PaymentTester';
import {CardName} from '@/common/cards/CardName';
import {CardModel} from '@/common/models/CardModel';

describe('SelectPayment', () => {
  it('Uses heat', async () => {
    const wrapper = setupBill(
      10,
      {heat: 5, megaCredits: 7},
      {paymentOptions: {heat: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({heat: 3, megaCredits: 7});

    await tester.clickMax('heat');
    tester.expectPayment({heat: 5, megaCredits: 5});

    await tester.clickMinus('heat');
    tester.expectPayment({heat: 4, megaCredits: 6});

    await tester.clickMinus('heat');
    tester.expectPayment({heat: 3, megaCredits: 7});

    await tester.clickPlus('heat');
    tester.expectPayment({heat: 4, megaCredits: 6});
  });

  it('Uses steel', async () => {
    const wrapper = setupBill(
      10,
      {steel: 4, megaCredits: 7, steelValue: 2},
      {paymentOptions: {steel: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({steel: 4, megaCredits: 2});
  });

  it('Check initial value, use steel and titanium, but not enough steel', async () => {
    const wrapper = setupBill(
      10,
      {steel: 1, titanium: 2, megaCredits: 7, steelValue: 2, titaniumValue: 3},
      {paymentOptions: {steel: true, titanium: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({steel: 1, titanium: 2, megaCredits: 2});
  });

  it('Uses titanium bonus', async () => {
    const wrapper = setupBill(
      10,
      {megaCredits: 2, titanium: 4, titaniumValue: 7},
      {paymentOptions: {titanium: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({titanium: 2, megaCredits: 0});
  });

  it('Uses seeds', async () => {
    const wrapper = setupBill(
      14,
      {megaCredits: 6},
      {paymentOptions: {seeds: true}, seeds: 4});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({seeds: 2, megaCredits: 4});
  });

  it('Default seed value uses more than minimum when there are not enough MC', async () => {
    const wrapper = setupBill(
      14,
      {megaCredits: 2},
      {paymentOptions: {seeds: true}, seeds: 4});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({seeds: 3, megaCredits: 0});
  });

  it('Uses auroraiData', async () => {
    const wrapper = setupBill(
      14,
      {megaCredits: 6},
      {paymentOptions: {auroraiData: true}, auroraiData: 4});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({auroraiData: 4, megaCredits: 2});
  });

  it('initial values, multiple values', async () => {
    const wrapper = setupBill(
      10,
      {megaCredits: 2, titanium: 4, titaniumValue: 4, heat: 3},
      {paymentOptions: {titanium: true, heat: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    // Using this as a chance to test that other components aren't visible.
    tester.expectAvailablePaymentComponents('titanium', 'heat', 'megaCredits');
    tester.expectPayment({titanium: 2, heat: 0, megaCredits: 2});
  });

  it('can pay, no resources', async () => {
    const wrapper = setupBill(
      10,
      {megaCredits: 12, titanium: 0, titaniumValue: 3, steelValue: 2, heat: 0},
      {paymentOptions: {titanium: true, heat: true, steel: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectAvailablePaymentComponents('megaCredits');
    tester.expectValue('megaCredits', 10);
  });

  it('max megacredits', async () => {
    const wrapper = setupBill(
      9,
      {megaCredits: 16, heat: 3},
      {paymentOptions: {heat: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({heat: 0, megaCredits: 9});

    await tester.clickMax('heat');
    await tester.nextTick();
    tester.expectPayment({heat: 3, megaCredits: 6});

    await tester.clickMax('megaCredits');
    await tester.nextTick();
    tester.expectPayment({heat: 0, megaCredits: 9});
  });

  it('max megacredits, 2', async () => {
    const wrapper = setupBill(
      10,
      {megaCredits: 5, titanium: 4, titaniumValue: 4, heat: 3},
      {paymentOptions: {titanium: true, heat: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({titanium: 2, heat: 0, megaCredits: 2});

    await tester.clickMax('megaCredits');
    await tester.nextTick();
    tester.expectPayment({titanium: 2, heat: 0, megaCredits: 5});
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
      {paymentOptions: {heat: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectIsAvailable('heat');
    tester.expectPayment({heat: 7, megaCredits: 3});
    await tester.clickSave();
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
      {paymentOptions: {heat: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({heat: 0, megaCredits: 10});

    await tester.clickMax('heat');
    tester.expectPayment({heat: 5, megaCredits: 5});
  });

  it('Luna Trade Federation: Can use titanium by default', async () => {
    const wrapper = setupBill(
      10,
      // Note here that titanium is valued at 4, so LTF titanium will be valued at 3.
      {megaCredits: 10, titanium: 2, titaniumValue: 4},
      {paymentOptions: {titanium: false, lunaTradeFederationTitanium: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({titanium: 2, megaCredits: 4});

    await tester.clickMinus('titanium');
    tester.expectPayment({titanium: 1, megaCredits: 7});
  });

  it('Pay with titanium', async () => {
    const wrapper = setupBill(
      10,
      {
        megaCredits: 10, titanium: 2, titaniumValue: 4,
      },
      {paymentOptions: {titanium: true, lunaTradeFederationTitanium: false}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({titanium: 2, megaCredits: 2});
  });

  it('Luna Trade Federation: Can use titanium at normal rate when paymentOptions{titanium} is true', async () => {
    const wrapper = setupBill(
      10,
      {
        megaCredits: 10, titanium: 2, titaniumValue: 4,
      },
      {paymentOptions: {lunaTradeFederationTitanium: true, titanium: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({titanium: 2, megaCredits: 2});

    await(tester.clickMinus('titanium'));
    tester.expectPayment({titanium: 1, megaCredits: 6});

    await tester.clickMax('titanium');
    tester.expectPayment({titanium: 2, megaCredits: 2});
  });

  function setupBill(
    amount: number,
    playerFields: Partial<PublicPlayerModel>,
    playerInputFields: Partial<SelectPaymentModel>) {
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

    const playerInput: SelectPaymentModel = {
      type: 'payment',
      buttonLabel: '',
      title: 'foo',
      amount: amount,
      paymentOptions: {},
      auroraiData: 0,
      kuiperAsteroids: 0,
      seeds: 0,
      spireScience: 0,
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
  }
});

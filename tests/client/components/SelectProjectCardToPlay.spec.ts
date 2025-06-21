import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import SelectProjectCardToPlay from '@/client/components/SelectProjectCardToPlay.vue';
import {SelectProjectCardToPlayModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {Units} from '@/common/Units';
import {FakeLocalStorage} from './FakeLocalStorage';
import {PaymentTester} from './PaymentTester';
import {Payment} from '@/common/inputs/Payment';
import {CardModel} from '@/common/models/CardModel';
import {PreferencesManager} from '@/client/utils/PreferencesManager';
import {SelectProjectCardToPlayResponse} from '@/common/inputs/InputResponse';
import {SelectProjectCardToPlayDataModel} from '@/client/mixins/PaymentWidgetMixin';

describe('SelectProjectCardToPlay', () => {
  let localStorage: FakeLocalStorage;
  let saveResponse: SelectProjectCardToPlayResponse;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
    PreferencesManager.INSTANCE.set('show_alerts', false);
  });
  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  it('using sort order for cards', async () => {
    localStorage.setItem('cardOrderfoo', JSON.stringify({
      [CardName.ANTS]: 2,
      [CardName.BIRDS]: 1,
    }));
    const sortable = mount(SelectProjectCardToPlay, {
      localVue: getLocalVue(),
      propsData: {
        playerView: {
          cardsInHand: [{
            calculatedCost: 4,
            name: CardName.ANTS,
          }, {
            calculatedCost: 3,
            name: CardName.BIRDS,
          }],
          id: 'foo',
          selfReplicatingRobotCards: [],
          thisPlayer: {
            steel: 0,
            tableau: [],
          },
        },
        playerinput: {
          title: 'foo',
          cards: [{
            name: CardName.ANTS,
            reserveUnits: {},
          }, {
            name: CardName.BIRDS,
            reserveUnits: {},
          }],
          paymentOptions: {},
        },
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
    const cards = sortable.findAllComponents({
      name: 'Card',
    });
    expect(cards).has.length(2);
    expect(cards.at(0).props().card.name).to.eq(CardName.BIRDS);
    expect(cards.at(1).props().card.name).to.eq(CardName.ANTS);
  });

  it('using heat', async () => {
    // Birds will cost 10. Player has 7M€ and will use 3 of the 4 available heat units.
    const wrapper = setupCardForPurchase(
      CardName.BIRDS, 10,
      {heat: 4, megaCredits: 7},
      {paymentOptions: {heat: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectIsAvailable('heat');
    tester.expectPayment({heat: 3, megaCredits: 7});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({heat: 3, megaCredits: 7}));
  });

  it('max heat', async () => {
    const wrapper = setupCardForPurchase(
      CardName.BIRDS, 10,
      {heat: 4, megaCredits: 10, titaniumValue: 1, steelValue: 1},
      {paymentOptions: {heat: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({heat: 0, megaCredits: 10});

    await tester.clickMax('heat');
    tester.expectPayment({heat: 4, megaCredits: 6});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({heat: 4, megaCredits: 6}));
  });

  it('max heat, heat in reserve', async () => {
    const wrapper = setupCardForPurchase(
      CardName.BIRDS, 10,
      {heat: 4, megaCredits: 10, titaniumValue: 1, steelValue: 1},
      {paymentOptions: {heat: true}},
      {reserveUnits: Units.of({heat: 2})});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({heat: 0, megaCredits: 10});

    await tester.clickMax('heat');
    // Only 2 heat available since two are in reserve.
    tester.expectPayment({heat: 2, megaCredits: 8});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({heat: 2, megaCredits: 8}));
  });

  it('using microbes', async () => {
    // Moss will cost 10. Player has 7M€ and will 2 of the 4 available microbes units.
    const wrapper = setupCardForPurchase(
      CardName.MOSS, 10,
      {megaCredits: 7},
      {microbes: 4});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({microbes: 2, megaCredits: 6});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({microbes: 2, megaCredits: 6}));
  });

  it('using floaters', async () => {
    // Forced Precipitation will cost 10. Player has 7M€ and will 2 of the 4 available floaters.
    const wrapper = setupCardForPurchase(
      CardName.FORCED_PRECIPITATION, 10,
      {megaCredits: 6},
      {floaters: 4});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({floaters: 2, megaCredits: 4});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({floaters: 2, megaCredits: 4}));
  });

  it('Paying for Stratospheric Birds without floaters', async () => {
    const wrapper = setupCardForPurchase(
      CardName.STRATOSPHERIC_BIRDS, 12,
      {megaCredits: 12},
      {});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megaCredits: 12});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({megaCredits: 12}));
  });

  it('Paying for Stratospheric Birds with Dirigibles', async () => {
    const wrapper = setupCardForPurchase(
      CardName.STRATOSPHERIC_BIRDS, 12,
      {megaCredits: 9},
      {floaters: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({floaters: 1, megaCredits: 9});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({floaters: 1, megaCredits: 9}));

    await tester.clickMax('floaters');
    tester.expectPayment({floaters: 2, megaCredits: 6});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({floaters: 2, megaCredits: 6}));
  });

  it('Paying for Stratospheric Birds with Dirigibles while another card has floaters (#4052)', async () => {
    const tableau: Array<Partial<CardModel>> = [
      {name: CardName.DIRIGIBLES, resources: 3},
      {name: CardName.AERIAL_MAPPERS, resources: 1},
    ];
    const wrapper = setupCardForPurchase(
      CardName.STRATOSPHERIC_BIRDS, 12,
      {megaCredits: 9, tableau: tableau as Array<CardModel>},
      {floaters: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({floaters: 1, megaCredits: 9}));

    await tester.clickMax('floaters');

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({floaters: 3, megaCredits: 3}));
  });

  it('Paying for other card with Dirigibles uses all floaters', async () => {
    const wrapper = setupCardForPurchase(
      CardName.FORCED_PRECIPITATION, 12,
      {megaCredits: 9},
      {floaters: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({floaters: 1, megaCredits: 9}));

    await tester.clickMax('floaters');

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({floaters: 3, megaCredits: 3}));
  });

  it('Paying for Soil Enrichment without microbes', async () => {
    const wrapper = setupCardForPurchase(
      CardName.SOIL_ENRICHMENT, 6,
      {megaCredits: 6},
      {});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megaCredits: 6});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({megaCredits: 6}));
  });

  it('Paying for Soil Enrichment with Psychophriles', async () => {
    const wrapper = setupCardForPurchase(
      CardName.SOIL_ENRICHMENT, 6,
      {megaCredits: 5},
      {microbes: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({microbes: 1, megaCredits: 4});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({microbes: 1, megaCredits: 4}));

    await tester.clickMax('microbes');
    tester.expectPayment({microbes: 2, megaCredits: 2});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({microbes: 2, megaCredits: 2}));
  });

  it('Paying for Soil Enrichment with Psychophriles while another card has microbes', async () => {
    const tableau: Array<Partial<CardModel>> = [
      {name: CardName.PSYCHROPHILES, resources: 3},
      {name: CardName.TARDIGRADES, resources: 1},
    ];
    const wrapper = setupCardForPurchase(
      CardName.SOIL_ENRICHMENT, 6,
      {megaCredits: 4, tableau: tableau as Array<CardModel>},
      {microbes: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({microbes: 1, megaCredits: 4}));

    await tester.clickMax('microbes');

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({microbes: 3, megaCredits: 0}));
  });

  it('Paying for other card with Psychophriles uses all microbes', async () => {
    const wrapper = setupCardForPurchase(
      CardName.BUSHES, 10,
      {megaCredits: 8},
      {microbes: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({microbes: 1, megaCredits: 8}));

    await tester.clickMax('microbes');

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({microbes: 3, megaCredits: 4}));
  });

  it('using steel', async () => {
    // Rego Plastics will cost 10. Player has 7M€ and 4 steels.
    // They should spend at least enough to pay for the card, that is 6 M€ and 2 steel.
    const wrapper = setupCardForPurchase(
      CardName.REGO_PLASTICS, 10,
      {steel: 4, megaCredits: 7, steelValue: 2},
      {paymentOptions: {steel: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megaCredits: 6, steel: 2});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({steel: 2, megaCredits: 6}));
  });

  it('using titanium metal bonus', async () => {
    // Solar Wind Power will cost 11. Player has 2M€ and 4 Ti. The titanium is
    // artificially inflated to be worth 7M€ each.
    // The algorithm will try to spend 2 mc. Then spend as much Ti as possible.
    // This will come down to 2 M€ and 2 Ti (at value 7). So we are effectively spending 16.
    // That is overspending by 5 mc. The algorithm will try to spend 5 M€ less if possible.
    // It is not, so it will try to overspend as little mc as it can.
    // The final answer should be 0M€ and 2 Ti (at value 7).
    const wrapper = setupCardForPurchase(
      CardName.SOLAR_WIND_POWER, 11,
      {megaCredits: 2, titanium: 4, titaniumValue: 7},
      {paymentOptions: {titanium: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megaCredits: 0, titanium: 2});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({titanium: 2, megaCredits: 0}));
  });

  it('using steel and titanium with metal bonus', async () => {
    // Space Elevator will cost 27. Player has 1MC, 4 steels (at value 3), and 6 Ti. The titanium is
    // artificially inflated to be worth 6M€ each.
    // The algorithm will try to spend 1 mc. Then spend as much steel as possible. Then spend as much Ti as possible.
    // This will come down to 1 MC, 4 steels (at value 3), and 3 Ti (at value 6). So we are effectively spending 31.
    // That is overspending by 4 mc.
    // It will try to save the resources. It will first save 1 steel and then 1 mc.
    // The final answer should be 0mc, 3 steels (at value 3) and 3 Ti (at value 6).
    const wrapper = setupCardForPurchase(
      CardName.SPACE_ELEVATOR, 27,
      {megaCredits: 1, steel: 4, steelValue: 3, titanium: 6, titaniumValue: 6},
      {paymentOptions: {steel: true, titanium: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megaCredits: 0, steel: 3, titanium: 3});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({steel: 3, titanium: 3, megaCredits: 0}));
  });

  it('using steel and microbes', async () => {
    // Protected Valley will cost 23. Player has no mc, 5 microbes, and 10 steels The steel is
    // artificially inflated to be worth 4M€ each.
    // The algorithm will try to spend no mc. Then spend as much microbes as possible. Then spend as much steel as possible.
    // This will come down to 0 MC, 5 microbes (at value 2), and 4 steels (at value 4). So we are effectively spending 26.
    // That is overspending by 4 mc.
    // It will try to reduce the amount of overspending resources.
    // The final answer should be 0mc, 4 microbes (at value 2) and 4 steels (at value 4).
    const wrapper = setupCardForPurchase(
      CardName.PROTECTED_VALLEY, 23,
      {megaCredits: 0, steel: 10, steelValue: 4},
      {paymentOptions: {steel: true}, microbes: 5});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectAvailablePaymentComponents('steel', 'microbes');
    tester.expectPayment({steel: 4, microbes: 4});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({microbes: 4, steel: 4}));
  });

  it('using floater and microbes', async () => {
    // Freyja Biodomes will cost 14. Player has 1 mc, 6 microbes, and 4 floater.
    // The algorithm will try to spend 1 mc. Then spend as much microbes as possible. Then spend as much floater as possible.
    // This will come down to 1 MC, 6 microbes (at value 2), and 1 floater (at value 3). So we are effectively spending 16.
    // That is overspending by 2 mc.
    // It will try to reduce the overspending resources. Then reduce the amount of mc if possible.
    // The final answer should be 1mc, 5 microbes (at value 2) and 1 floater (at value 3).
    const wrapper = setupCardForPurchase(
      CardName.FREYJA_BIODOMES, 14,
      {megaCredits: 1},
      {microbes: 5, floaters: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megaCredits: 1, microbes: 5, floaters: 1});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({floaters: 1, microbes: 5, megaCredits: 1}));
  });

  it('using floater and titanium', async () => {
    // Giant Solar Shade will cost 27. Player has 1 mc, 8 floaters, and 6 ti.
    // The algorithm will try to spend 1 mc. Then spend as much floaters as possible. Then spend as much ti as possible.
    // This will come down to 1 MC, 8 floaters (at value 3), and 1 ti (at value 7). So we are effectively spending 32.
    // That is overspending by 5 mc.
    // It will try to reduce the overspending resources. Then reduce the amount of mc if possible.
    // The final answer should be 0 mc, 7 floaters (at value 3) and 1 ti (at value 7).
    const wrapper = setupCardForPurchase(
      CardName.GIANT_SOLAR_SHADE, 27,
      {megaCredits: 1, titanium: 6, titaniumValue: 7},
      {paymentOptions: {titanium: true}, floaters: 8});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megaCredits: 0, floaters: 7, titanium: 1});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({titanium: 1, floaters: 7, megaCredits: 0}));
  });

  it('Luna Train Station limits how much steel you can use', async () => {
    const wrapper = setupCardForPurchase(
      CardName.LUNA_TRAIN_STATION, 20,
      {
        megaCredits: 20,
        steel: 4,
        steelValue: 2,
      },
      {paymentOptions: {steel: true}},
      {reserveUnits: Units.of({steel: 2})});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megaCredits: 20, steel: 0});

    await tester.clickMax('steel');
    // 2 units of steel are in reserve
    tester.expectPayment({megaCredits: 16, steel: 2});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({steel: 2, megaCredits: 16}));
  });

  it('using titanium metal bonus without using steel', async () => {
    // Io Mining Industries cost 41 mc. Player has 10 MC, 2 steel and 13 Ti.
    // The steel is artificially inflated to be worth 4 M€ each.
    // The titanium is artificially inflated to be worth 5 M€ each.
    // The algorithm will try to spend 10 mc. Then spend as much Ti as possible.
    // This will come down to 10 M€ and 7 Ti (at value 5). So we are effectively spending 45 MC.
    // That is overspending by 4 mc. The algorithm will try to spend 4 M€ less if possible.
    // IT WILL NOT TRY TO SPEND LESS STEEL EVEN IF IT HAS STEEL AND STEEL VALUE IS 4.
    // It will reduce the amount of MC.
    // The final answer should be 6M€ and 7 Ti (at value 5).
    const wrapper = setupCardForPurchase(
      CardName.IO_MINING_INDUSTRIES, 41,
      {megaCredits: 10, titanium: 13, titaniumValue: 5, steel: 2, steelValue: 4},
      {paymentOptions: {titanium: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megaCredits: 6, titanium: 7});

    expect((wrapper.vm as unknown as SelectProjectCardToPlayDataModel).payment.steel).eq(0);
    tester.expectIsNotAvailable('steel');

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({titanium: 7, megaCredits: 6}));
  });

  it('using luna archive science', async () => {
    // ARISTARCHUS_ROAD_NETWORK costs 15. Player has 7M€ and will use 8 science units.
    const wrapper = setupCardForPurchase(
      CardName.ARISTARCHUS_ROAD_NETWORK, 15,
      {megaCredits: 7, steel: 0},
      {lunaArchivesScience: 10});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megaCredits: 5, lunaArchivesScience: 10});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({lunaArchivesScience: 10, megaCredits: 5}));
  });

  it('using seeds', async () => {
    // ARCTIC_ALGAE costs 12. Player has 7M€ and will use 2 seeds (Seeds are 5 MC each)
    const wrapper = setupCardForPurchase(
      CardName.ARCTIC_ALGAE, 12,
      {megaCredits: 7},
      {seeds: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megaCredits: 2, seeds: 2});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({seeds: 2, megaCredits: 2}));
  });

  it('using graphene', async () => {
    // ASTEROID_MINING costs 30. Player has 11M€ and will use 7 graphene units. (Graphene are 4MC each)
    const wrapper = setupCardForPurchase(
      CardName.ASTEROID_MINING, 30,
      {megaCredits: 17, titanium: 0},
      {graphene: 7, paymentOptions: {graphene: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megaCredits: 2, graphene: 7});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({graphene: 7, megaCredits: 2}));
  });

  it('initial setup allows for steel and titanium when using Last Restort Ingenuity', async () => {
    // Earth Office costs 1, but has no building tag or space tag.
    const wrapper = setupCardForPurchase(
      CardName.EARTH_OFFICE, 0,
      {megaCredits: 0, steel: 4, titanium: 4, lastCardPlayed: CardName.LAST_RESORT_INGENUITY},
      {paymentOptions: {steel: false, titanium: false}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectIsAvailable('steel');
    tester.expectIsAvailable('titanium');
  });

  it('Stormcraft floaters count for heat', async () => {
    // Birds will cost 10. Player has 7M€ and will use 3 of the 4 available heat units.
    const wrapper = setupCardForPurchase(
      CardName.BIRDS, 10,
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
    tester.expectPayment({megaCredits: 3, heat: 7});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({heat: 7, megaCredits: 3}));
  });

  it('Max heat includes Stormcraft floaters', async () => {
    // Birds will cost 10. Player has 10 MC, 3 heat, and 1 floaters. It also is reserving one unit of heat.
    //
    // Initial setup will be that it selects 10MC.
    //
    // Then when clicking the 'max' button for heat, the algorithm will switch to 6M€ and 4 heat.

    const wrapper = setupCardForPurchase(
      CardName.BIRDS, 10,
      {
        heat: 3, megaCredits: 10, titaniumValue: 1, steelValue: 1,
        tableau: [
          {
            name: CardName.STORMCRAFT_INCORPORATED,
            resources: 1,
          } as CardModel,
        ],
      },
      {paymentOptions: {heat: true}},
      {reserveUnits: Units.of({heat: 1})});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megaCredits: 10, heat: 0});

    await tester.clickMax('heat');
    // One heat is in reserve
    tester.expectPayment({heat: 4, megaCredits: 6});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({heat: 4, megaCredits: 6}));
  });

  it('Luna Trade Federation: Can use titanium by default', async () => {
    const wrapper = setupCardForPurchase(
      CardName.BIRDS, 10,
      {megaCredits: 10, titanium: 2, titaniumValue: 4},
      {paymentOptions: {lunaTradeFederationTitanium: true, titanium: false}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megaCredits: 10, titanium: 0});

    await tester.clickMax('titanium');
    tester.expectPayment({megaCredits: 4, titanium: 2});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({titanium: 2, megaCredits: 4}));
  });

  it('Luna Trade Federation: Can use titanium at normal rate when titanium is true', async () => {
    const wrapper = setupCardForPurchase(
      CardName.SPACE_ELEVATOR, 27,
      {megaCredits: 15, titanium: 5, titaniumValue: 4},
      {paymentOptions: {lunaTradeFederationTitanium: true, titanium: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megaCredits: 15, titanium: 3});

    await tester.clickMax('titanium');
    tester.expectPayment({megaCredits: 7, titanium: 5});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({titanium: 5, megaCredits: 7}));
  });

  it('using corruption', async () => {
    // Imported Nitrogen costs 23, and has an Earth tag. Player has 4M€ and will use 2 corruption units.
    const wrapper = setupCardForPurchase(
      CardName.IMPORTED_NITROGEN, 23,
      {megaCredits: 4},
      {corruption: 3, paymentOptions: {corruption: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    await tester.clickMax('corruption');
    tester.expectPayment({megaCredits: 3, corruption: 2});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({corruption: 2, megaCredits: 3}));
  });

  const setupCardForPurchase = function(
    cardName: CardName,
    cardCost: number,
    playerFields: Partial<PublicPlayerModel>,
    playerInputFields: Partial<SelectProjectCardToPlayModel>,
    options?: {reserveUnits?: Units}) {
    const thisPlayer: Partial<PublicPlayerModel> = Object.assign({
      cards: [{name: cardName, calculatedCost: cardCost}],
      steel: 0,
      titanium: 0,
      steelValue: 2,
      titaniumValue: 3,
      tableau: [],
    }, playerFields);

    const playerView: Partial<PlayerViewModel>= {
      id: 'playerid-foo',
      thisPlayer: thisPlayer as PublicPlayerModel,
    };
    const playerInput: SelectProjectCardToPlayModel = {
      type: 'projectCard',
      title: 'foo',
      buttonLabel: 'bar',
      cards: [{
        name: cardName,
        resources: undefined,
        calculatedCost: cardCost,
      }],
      paymentOptions: {},
      floaters: 0,
      graphene: 0,
      kuiperAsteroids: 0,
      lunaArchivesScience: 0,
      microbes: 0,
      seeds: 0,
      corruption: 0,
      ...playerInputFields,
    };
    if (options !== undefined) {
      playerInput.cards![0].reserveUnits = options.reserveUnits;
    }

    return mount(SelectProjectCardToPlay, {
      localVue: getLocalVue(),
      propsData: {
        playerView: playerView,
        playerinput: playerInput,
        onsave: (response: SelectProjectCardToPlayResponse) => {
          saveResponse = response;
        },
        showsave: true,
        showtitle: true,
      },
    });
  };
});

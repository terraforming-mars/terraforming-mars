import {mount} from '@vue/test-utils';
import {globalConfig} from './getLocalVue';
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
      ...globalConfig,
      props: {
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
    expect(cards[0].props().card.name).to.eq(CardName.BIRDS);
    expect(cards[1].props().card.name).to.eq(CardName.ANTS);
  });

  it('using heat', async () => {
    // Birds will cost 10. Player has 7M€ and will use 3 of the 4 available heat units.
    const wrapper = setupCardForPurchase(
      CardName.BIRDS, 10,
      {heat: 4, megacredits: 7},
      {paymentOptions: {heat: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectIsAvailable('heat');
    tester.expectPayment({heat: 3, megacredits: 7});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({heat: 3, megacredits: 7}));
  });

  it('max heat', async () => {
    const wrapper = setupCardForPurchase(
      CardName.BIRDS, 10,
      {heat: 4, megacredits: 10, titaniumValue: 1, steelValue: 1},
      {paymentOptions: {heat: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({heat: 0, megacredits: 10});

    await tester.clickMax('heat');
    tester.expectPayment({heat: 4, megacredits: 6});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({heat: 4, megacredits: 6}));
  });

  it('max heat, heat in reserve', async () => {
    const wrapper = setupCardForPurchase(
      CardName.BIRDS, 10,
      {heat: 4, megacredits: 10, titaniumValue: 1, steelValue: 1},
      {paymentOptions: {heat: true}},
      {reserveUnits: Units.of({heat: 2})});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({heat: 0, megacredits: 10});

    await tester.clickMax('heat');
    // Only 2 heat available since two are in reserve.
    tester.expectPayment({heat: 2, megacredits: 8});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({heat: 2, megacredits: 8}));
  });

  it('using microbes', async () => {
    // Moss will cost 10. Player has 7M€ and 4 available microbes units.
    // Greedy: uses all 4 microbes (=8 MC), MC fills remaining 2.
    const wrapper = setupCardForPurchase(
      CardName.MOSS, 10,
      {megacredits: 7},
      {microbes: 4});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({microbes: 4, megacredits: 2});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({microbes: 4, megacredits: 2}));
  });

  it('using floaters', async () => {
    // Forced Precipitation will cost 10. Player has 6M€ and 4 available floaters (rate 3).
    // Greedy: uses 3 floaters (=9 MC), MC fills remaining 1.
    const wrapper = setupCardForPurchase(
      CardName.FORCED_PRECIPITATION, 10,
      {megacredits: 6},
      {floaters: 4});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({floaters: 3, megacredits: 1});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({floaters: 3, megacredits: 1}));
  });

  it('Paying for Stratospheric Birds without floaters', async () => {
    const wrapper = setupCardForPurchase(
      CardName.STRATOSPHERIC_BIRDS, 12,
      {megacredits: 12},
      {});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megacredits: 12});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({megacredits: 12}));
  });

  it('Paying for Stratospheric Birds with Dirigibles', async () => {
    // Stratospheric Birds reserves 1 floater for itself, so only 2 floaters available.
    // Greedy: uses 2 floaters (=6 MC), MC fills remaining 6.
    const wrapper = setupCardForPurchase(
      CardName.STRATOSPHERIC_BIRDS, 12,
      {megacredits: 9},
      {floaters: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({floaters: 2, megacredits: 6});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({floaters: 2, megacredits: 6}));

    await tester.clickMax('floaters');
    tester.expectPayment({floaters: 2, megacredits: 6});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({floaters: 2, megacredits: 6}));
  });

  it('Paying for Stratospheric Birds with Dirigibles while another card has floaters (#4052)', async () => {
    // Aerial Mappers provides a spare floater, so all 3 floaters from Dirigibles are available.
    // Greedy: uses all 3 floaters (=9 MC), MC fills remaining 3.
    const tableau: Array<Partial<CardModel>> = [
      {name: CardName.DIRIGIBLES, resources: 3},
      {name: CardName.AERIAL_MAPPERS, resources: 1},
    ];
    const wrapper = setupCardForPurchase(
      CardName.STRATOSPHERIC_BIRDS, 12,
      {megacredits: 9, tableau: tableau as Array<CardModel>},
      {floaters: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({floaters: 3, megacredits: 3}));

    await tester.clickMax('floaters');

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({floaters: 3, megacredits: 3}));
  });

  it('Paying for other card with Dirigibles uses all floaters', async () => {
    // Greedy: uses all 3 floaters (=9 MC), MC fills remaining 3.
    const wrapper = setupCardForPurchase(
      CardName.FORCED_PRECIPITATION, 12,
      {megacredits: 9},
      {floaters: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({floaters: 3, megacredits: 3}));

    await tester.clickMax('floaters');

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({floaters: 3, megacredits: 3}));
  });

  it('Paying for Soil Enrichment without microbes', async () => {
    const wrapper = setupCardForPurchase(
      CardName.SOIL_ENRICHMENT, 6,
      {megacredits: 6},
      {});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megacredits: 6});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({megacredits: 6}));
  });

  it('Paying for Soil Enrichment with Psychophriles', async () => {
    // Soil Enrichment reserves 1 microbe for itself, so only 2 microbes available.
    // Greedy: uses both available microbes (=4 MC), MC fills remaining 2.
    const wrapper = setupCardForPurchase(
      CardName.SOIL_ENRICHMENT, 6,
      {megacredits: 5},
      {microbes: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({microbes: 2, megacredits: 2});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({microbes: 2, megacredits: 2}));

    await tester.clickMax('microbes');
    tester.expectPayment({microbes: 2, megacredits: 2});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({microbes: 2, megacredits: 2}));
  });

  it('Paying for Soil Enrichment with Psychophriles while another card has microbes', async () => {
    // Tardigrades provides a spare microbe, so all 3 microbes from Psychrophiles are available.
    // Greedy: uses all 3 microbes (=6 MC), MC=0.
    const tableau: Array<Partial<CardModel>> = [
      {name: CardName.PSYCHROPHILES, resources: 3},
      {name: CardName.TARDIGRADES, resources: 1},
    ];
    const wrapper = setupCardForPurchase(
      CardName.SOIL_ENRICHMENT, 6,
      {megacredits: 4, tableau: tableau as Array<CardModel>},
      {microbes: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({microbes: 3, megacredits: 0}));

    await tester.clickMax('microbes');

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({microbes: 3, megacredits: 0}));
  });

  it('Paying for other card with Psychophriles uses all microbes', async () => {
    // Greedy: uses all 3 microbes (=6 MC), MC fills remaining 4.
    const wrapper = setupCardForPurchase(
      CardName.BUSHES, 10,
      {megacredits: 8},
      {microbes: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({microbes: 3, megacredits: 4}));

    await tester.clickMax('microbes');

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({microbes: 3, megacredits: 4}));
  });

  it('using steel', async () => {
    // Rego Plastics will cost 10. Player has 7M€ and 4 steels (rate 2).
    // Greedy: uses all 4 steel (=8 MC), MC fills remaining 2.
    const wrapper = setupCardForPurchase(
      CardName.REGO_PLASTICS, 10,
      {steel: 4, megacredits: 7, steelValue: 2},
      {paymentOptions: {steel: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megacredits: 2, steel: 4});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({steel: 4, megacredits: 2}));
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
      {megacredits: 2, titanium: 4, titaniumValue: 7},
      {paymentOptions: {titanium: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megacredits: 0, titanium: 2});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({titanium: 2, megacredits: 0}));
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
      {megacredits: 1, steel: 4, steelValue: 3, titanium: 6, titaniumValue: 6},
      {paymentOptions: {steel: true, titanium: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megacredits: 0, steel: 3, titanium: 3});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({steel: 3, titanium: 3, megacredits: 0}));
  });

  it('using steel and microbes', async () => {
    // Protected Valley will cost 23. Player has no MC, 5 microbes, and 10 steels (rate 4).
    // Greedy: steel (first in order) fills to 6 (=24 MC, just over cost). Post-pass cannot
    // reduce steel (24-4=20 < 23), so steel=6 and microbes=0. Overpays by 1.
    const wrapper = setupCardForPurchase(
      CardName.PROTECTED_VALLEY, 23,
      {megacredits: 0, steel: 10, steelValue: 4},
      {paymentOptions: {steel: true}, microbes: 5});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectAvailablePaymentComponents('steel', 'microbes');
    tester.expectPayment({steel: 6, microbes: 0});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({steel: 6}));
  });

  it('using floater and microbes', async () => {
    // Freyja Biodomes will cost 14. Player has 1 MC, 5 microbes (rate 2), and 3 floaters (rate 3).
    // Greedy: microbes (first in order) fill to 5 (=10 MC). Then floaters: ceil(max(14-1-10,0)/3)=1.
    // floaters=1 (=3 MC). Total=14. MC=min(1,1)=1.
    const wrapper = setupCardForPurchase(
      CardName.FREYJA_BIODOMES, 14,
      {megacredits: 1},
      {microbes: 5, floaters: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megacredits: 1, microbes: 5, floaters: 1});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({floaters: 1, microbes: 5, megacredits: 1}));
  });

  it('using floater and titanium', async () => {
    // Giant Solar Shade will cost 27. Player has 1 MC, 8 floaters (rate 3), and 6 Ti (rate 7).
    // Titanium is first in order; greedy fills to 4 Ti (=28 MC, just over cost). Post-pass
    // cannot reduce Ti (28-7=21 < 27), so titanium=4, floaters=0, MC=0. Overpays by 1.
    const wrapper = setupCardForPurchase(
      CardName.GIANT_SOLAR_SHADE, 27,
      {megacredits: 1, titanium: 6, titaniumValue: 7},
      {paymentOptions: {titanium: true}, floaters: 8});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megacredits: 0, floaters: 0, titanium: 4});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({titanium: 4}));
  });

  it('Luna Train Station limits how much steel you can use', async () => {
    // 2 units of steel are reserved for the card, so only 2 are available for payment.
    // Greedy: uses both available steel (=4 MC), MC fills remaining 16.
    const wrapper = setupCardForPurchase(
      CardName.LUNA_TRAIN_STATION, 20,
      {
        megacredits: 20,
        steel: 4,
        steelValue: 2,
      },
      {paymentOptions: {steel: true}},
      {reserveUnits: Units.of({steel: 2})});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megacredits: 16, steel: 2});

    await tester.clickMax('steel');
    tester.expectPayment({megacredits: 16, steel: 2});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({steel: 2, megacredits: 16}));
  });

  it('using titanium metal bonus without using steel', async () => {
    // Io Mining Industries costs 41 MC. Player has 10 MC, 2 steel (not usable — no building tag),
    // and 13 Ti (rate 5). Greedy: Ti fills to 8 (=40 MC), MC fills remaining 1.
    const wrapper = setupCardForPurchase(
      CardName.IO_MINING_INDUSTRIES, 41,
      {megacredits: 10, titanium: 13, titaniumValue: 5, steel: 2, steelValue: 4},
      {paymentOptions: {titanium: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megacredits: 1, titanium: 8});

    tester.expectIsNotAvailable('steel');

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({titanium: 8, megacredits: 1}));
  });

  it('using luna archive science', async () => {
    // ARISTARCHUS_ROAD_NETWORK costs 15. Player has 7M€ and will use 8 science units.
    const wrapper = setupCardForPurchase(
      CardName.ARISTARCHUS_ROAD_NETWORK, 15,
      {megacredits: 7, steel: 0},
      {lunaArchivesScience: 10});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megacredits: 5, lunaArchivesScience: 10});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({lunaArchivesScience: 10, megacredits: 5}));
  });

  it('using seeds', async () => {
    // ARCTIC_ALGAE costs 12. Player has 7M€ and will use 2 seeds (Seeds are 5 MC each)
    const wrapper = setupCardForPurchase(
      CardName.ARCTIC_ALGAE, 12,
      {megacredits: 7},
      {seeds: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megacredits: 2, seeds: 2});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({seeds: 2, megacredits: 2}));
  });

  it('using graphene', async () => {
    // ASTEROID_MINING costs 30. Player has 11M€ and will use 7 graphene units. (Graphene are 4MC each)
    const wrapper = setupCardForPurchase(
      CardName.ASTEROID_MINING, 30,
      {megacredits: 17, titanium: 0},
      {graphene: 7, paymentOptions: {graphene: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megacredits: 2, graphene: 7});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({graphene: 7, megacredits: 2}));
  });

  it('initial setup allows for steel and titanium when using Last Restort Ingenuity', async () => {
    // Earth Office costs 1, but has no building tag or space tag.
    const wrapper = setupCardForPurchase(
      CardName.EARTH_OFFICE, 0,
      {megacredits: 0, steel: 4, titanium: 4, lastCardPlayed: CardName.LAST_RESORT_INGENUITY},
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
        megacredits: 3,
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
    tester.expectPayment({megacredits: 3, heat: 7});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({heat: 7, megacredits: 3}));
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
        heat: 3, megacredits: 10, titaniumValue: 1, steelValue: 1,
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
    tester.expectPayment({megacredits: 10, heat: 0});

    await tester.clickMax('heat');
    // One heat is in reserve
    tester.expectPayment({heat: 4, megacredits: 6});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({heat: 4, megacredits: 6}));
  });

  it('Luna Trade Federation: Can use titanium by default', async () => {
    // Luna Trade Federation rate is titaniumValue-1=3. Greedy: uses both Ti (=6 MC), MC fills 4.
    const wrapper = setupCardForPurchase(
      CardName.BIRDS, 10,
      {megacredits: 10, titanium: 2, titaniumValue: 4},
      {paymentOptions: {lunaTradeFederationTitanium: true, titanium: false}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megacredits: 4, titanium: 2});

    await tester.clickMax('titanium');
    tester.expectPayment({megacredits: 4, titanium: 2});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({titanium: 2, megacredits: 4}));
  });

  it('Luna Trade Federation: Can use titanium at normal rate when titanium is true', async () => {
    // When paymentOptions.titanium=true, full rate=4 applies. Greedy: fills all 5 Ti (=20 MC), MC fills 7.
    const wrapper = setupCardForPurchase(
      CardName.SPACE_ELEVATOR, 27,
      {megacredits: 15, titanium: 5, titaniumValue: 4},
      {paymentOptions: {lunaTradeFederationTitanium: true, titanium: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megacredits: 7, titanium: 5});

    await tester.clickMax('titanium');
    tester.expectPayment({megacredits: 7, titanium: 5});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({titanium: 5, megacredits: 7}));
  });

  it('saveData() via PlayerInputFactory includes payment in response', async () => {
    // Reproduces: when OrOptions -> PlayerInputFactory calls saveData() with no arguments,
    // payment must still be included. Before the fix, payment was undefined in the response.
    const wrapper = setupCardForPurchase(
      CardName.BIRDS, 10,
      {heat: 4, megacredits: 7},
      {paymentOptions: {heat: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    (wrapper.vm as any).saveData();

    expect(saveResponse.payment).deep.eq(Payment.of({heat: 3, megacredits: 7}));
  });

  it('Luna Trade Federation: standard project with canPayWith.titanium uses full titanium rate', async () => {
    // Moon Habitat Variant 1 costs 23 MC, canPayWith.titanium = true.
    // With Luna Trade Federation, titanium should still be valued at the full 3 MC each,
    // not the reduced 2 MC that Luna Trade Federation normally provides.
    // Greedy: fills to 7 Ti (=21 MC), MC fills remaining 2.
    const wrapper = setupCardForPurchase(
      CardName.MOON_HABITAT_STANDARD_PROJECT_VARIANT_1, 23,
      {megacredits: 5, titanium: 8, titaniumValue: 3},
      {paymentOptions: {lunaTradeFederationTitanium: true}},
      {canPayWith: {titanium: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();
    tester.expectPayment({megacredits: 2, titanium: 7});

    await tester.clickMax('titanium');
    tester.expectPayment({megacredits: 2, titanium: 7});

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({titanium: 7, megacredits: 2}));
  });

  it('standard project with zero cost still shows save button (b8079)', async () => {
    // Underworld Standard Technology discounts Excavate (cost 7) by 8, flooring at 0.
    // The save button must still render and accept a zero payment.
    const wrapper = setupCardForPurchase(
      CardName.EXCAVATE_STANDARD_PROJECT, 0,
      {megacredits: 0},
      {},
      {canPayWith: {steel: true}});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    expect(wrapper.find('[data-test=save]').exists()).is.true;

    await tester.clickSave();
    expect(saveResponse.payment).deep.eq(Payment.of({megacredits: 0}));
  });

  it('switching cards updates payment defaults to match new card cost', async () => {
    // Regression: the cardName watch (flush:'pre') must update available units before
    // PaymentForm remounts via :key, so the new instance computes correct greedy defaults.
    const playerInput: SelectProjectCardToPlayModel = {
      type: 'projectCard',
      title: 'foo',
      buttonLabel: 'bar',
      cards: [
        {name: CardName.BIRDS, calculatedCost: 10},
        {name: CardName.ANTS, calculatedCost: 3},
      ],
      paymentOptions: {},
      floaters: 0, graphene: 0, kuiperAsteroids: 0, lunaArchivesScience: 0,
      microbes: 0, seeds: 0, auroraiData: 0, spireScience: 0,
    };
    const playerView: Partial<PlayerViewModel> = {
      id: 'playerid-foo',
      thisPlayer: {
        megacredits: 10, steel: 0, titanium: 0, steelValue: 2, titaniumValue: 3, tableau: [],
      } as unknown as PublicPlayerModel,
    };

    const wrapper = mount(SelectProjectCardToPlay, {
      ...globalConfig,
      props: {
        playerView: playerView as PlayerViewModel,
        playerinput: playerInput,
        onsave: (response: SelectProjectCardToPlayResponse) => { saveResponse = response; },
        showsave: true,
        showtitle: true,
      },
    });

    await wrapper.vm.$nextTick();

    const vm = wrapper.vm as any;
    const tester = new PaymentTester(wrapper);
    expect(vm.cardName).to.eq(CardName.BIRDS);
    tester.expectValue('megacredits', 10);

    // Setting cardName simulates what v-model does when the radio changes.
    // The watch fires (pre-flush) before PaymentForm remounts.
    vm.cardName = CardName.ANTS;
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();

    expect(vm.cardName).to.eq(CardName.ANTS);
    tester.expectValue('megacredits', 3);
  });

  const setupCardForPurchase = function(
    cardName: CardName,
    cardCost: number,
    playerFields: Partial<PublicPlayerModel>,
    playerInputFields: Partial<SelectProjectCardToPlayModel>,
    options?: {reserveUnits?: Units, canPayWith?: CardModel['standardProjectCanPayWith']}) {
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
      auroraiData: 0,
      spireScience: 0,
      ...playerInputFields,
    };
    if (options !== undefined) {
      playerInput.cards![0].reserveUnits = options.reserveUnits;
      playerInput.cards![0].standardProjectCanPayWith = options.canPayWith;
    }

    return mount(SelectProjectCardToPlay, {
      ...globalConfig,
      props: {
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

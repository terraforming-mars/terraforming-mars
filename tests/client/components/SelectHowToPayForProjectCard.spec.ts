import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {CardType} from '@/common/cards/CardType';
import SelectHowToPayForProjectCard from '@/client/components/SelectHowToPayForProjectCard.vue';
import {PlayerInputModel} from '@/common/models/PlayerInputModel';
import {PlayerViewModel, PublicPlayerModel} from '@/common/models/PlayerModel';
import {Units} from '@/common/Units';
import {FakeLocalStorage} from './FakeLocalStorage';
import {PaymentTester} from './PaymentTester';
import {HowToPay} from '@/common/inputs/HowToPay';
import {CardResource} from '@/common/CardResource';
import {CardModel} from '@/common/models/CardModel';
import {PreferencesManager} from '@/client/utils/PreferencesManager';

describe('SelectHowToPayForProjectCard', () => {
  let localStorage: FakeLocalStorage;
  let saveResponse: HowToPay;

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
    const sortable = mount(SelectHowToPayForProjectCard, {
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
        },
        playerinput: {
          title: 'foo',
          cards: [{
            name: CardName.ANTS,
            reserveUnits: Units.of({}),
          }, {
            name: CardName.BIRDS,
            reserveUnits: Units.of({}),
          }],
        },
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
    const cards = sortable.findAllComponents({
      name: 'Card',
    });
    expect(cards.length).to.eq(2);
    expect(cards.at(0).props().card.name).to.eq(CardName.BIRDS);
    expect(cards.at(1).props().card.name).to.eq(CardName.ANTS);
  });

  it('using heat', async () => {
    // Birds will cost 10. Player has 7M€ and will use 3 of the 4 available heat units.
    const wrapper = setupCardForPurchase(
      CardName.BIRDS, 10,
      {heat: 4, megaCredits: 7},
      {canUseHeat: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectIsAvailable('heat', true);
    tester.expectValue('heat', 3);

    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({heat: 3, megaCredits: 7}));
  });

  it('using max button with heat', async () => {
    // Birds will cost 10. Player has 10 MC and 4 heat. It will select 10MC
    //
    // Then when clicking the 'max' button for heat, the algorithm will switch to 8 M€ and 2 heat.

    const wrapper = setupCardForPurchase(
      CardName.BIRDS, 10,
      {heat: 4, megaCredits: 10, titaniumValue: 1, steelValue: 1},
      {canUseHeat: true},
      Units.of({heat: 2}));

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('megaCredits', 10);
    tester.expectValue('heat', 0);

    await tester.clickMax('heat');

    tester.expectValue('megaCredits', 8);
    tester.expectValue('heat', 2);

    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({heat: 2, megaCredits: 8}));
  });

  it('using microbes', async () => {
    // Moss will cost 10. Player has 7M€ and will 2 of the 4 available microbes units.
    const wrapper = setupCardForPurchase(
      CardName.MOSS, 10,
      {megaCredits: 7},
      {microbes: 4});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('microbes', 2);

    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({microbes: 2, megaCredits: 6}));
  });

  it('using floaters', async () => {
    // Forced Precipitation will cost 10. Player has 7M€ and will 2 of the 4 available floaters.
    const wrapper = setupCardForPurchase(
      CardName.FORCED_PRECIPITATION, 10,
      {megaCredits: 6},
      {floaters: 4});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('floaters', 2);

    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({floaters: 2, megaCredits: 4}));
  });

  it('Paying for Stratospheric Birds without floaters', async () => {
    const wrapper = setupCardForPurchase(
      CardName.STRATOSPHERIC_BIRDS, 12, {
        megaCredits: 12,
      },
      {});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();


    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({megaCredits: 12}));
  });

  it('Paying for Stratospheric Birds with Dirigibles', async () => {
    const wrapper = setupCardForPurchase(
      CardName.STRATOSPHERIC_BIRDS, 12, {
        megaCredits: 9,
      },
      {floaters: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({floaters: 1, megaCredits: 9}));

    tester.clickMax('floaters');

    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({floaters: 2, megaCredits: 6}));
  });

  it('Paying for Stratospheric Birds with Dirigibles while another card has floaters (#4052)', async () => {
    const playedCards: Array<Partial<CardModel>> = [
      {name: CardName.DIRIGIBLES, resourceType: CardResource.FLOATER, resources: 3},
      {name: CardName.AERIAL_MAPPERS, resourceType: CardResource.FLOATER, resources: 1},
    ];
    const wrapper = setupCardForPurchase(
      CardName.STRATOSPHERIC_BIRDS, 12, {
        megaCredits: 9,
        playedCards: playedCards as Array<CardModel>,
      },
      {floaters: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({floaters: 1, megaCredits: 9}));

    tester.clickMax('floaters');

    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({floaters: 3, megaCredits: 3}));
  });

  it('Paying for other card with Dirigibles uses all floaters', async () => {
    const wrapper = setupCardForPurchase(
      CardName.FORCED_PRECIPITATION, 12, {
        megaCredits: 9,
      },
      {floaters: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({floaters: 1, megaCredits: 9}));

    tester.clickMax('floaters');

    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({floaters: 3, megaCredits: 3}));
  });

  it('using steel', async () => {
    // Rego Plastics will cost 10. Player has 7M€ and 4 steels.
    // They should spend at least enough to pay for the card, that is 6 M€ and 2 steel.
    const wrapper = setupCardForPurchase(
      CardName.REGO_PLASTICS, 10,
      {steel: 4, megaCredits: 7, steelValue: 2},
      {canUseSteel: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('steel', 2);


    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({steel: 2, megaCredits: 6}));
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
      {canUseTitanium: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('megaCredits', 0);
    tester.expectValue('titanium', 2);


    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({titanium: 2, megaCredits: 0}));
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
      {canUseSteel: true, canUseTitanium: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('megaCredits', 0);
    tester.expectValue('steel', 3);
    tester.expectValue('titanium', 3);

    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({steel: 3, titanium: 3, megaCredits: 0}));
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
      {canUseSteel: true, microbes: 5});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('megaCredits', 0);
    tester.expectValue('steel', 4);
    tester.expectValue('microbes', 4);

    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({microbes: 4, steel: 4, megaCredits: 0}));
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

    tester.expectValue('megaCredits', 1);
    tester.expectValue('microbes', 5);
    tester.expectValue('floaters', 1);

    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({floaters: 1, microbes: 5, megaCredits: 1}));
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
      {canUseTitanium: true, floaters: 8});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('megaCredits', 0);
    tester.expectValue('floaters', 7);
    tester.expectValue('titanium', 1);

    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({titanium: 1, floaters: 7, megaCredits: 0}));
  });

  it('Luna Train Station limits how much steel you can use', async () => {
    // Luna Train Station costs 20, and will need 2 steel. Player has 20 M€ and 4 steel.
    //
    // The algorithm will select 20 MC,
    //
    // Then when clicking the 'max' button for steel, the algorithm will switch to 16 M€ and 2 steel.
    const wrapper = setupCardForPurchase(
      CardName.LUNA_TRAIN_STATION, 20,
      {
        megaCredits: 20,
        steel: 4,
        steelValue: 2,
        titaniumValue: 0, // Needed for when setReminingMCValue is called.
      },
      {canUseSteel: true},
      Units.of({steel: 2}));

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('megaCredits', 20);
    tester.expectValue('steel', 0);
    await tester.clickMax('steel');

    tester.expectValue('megaCredits', 16);
    tester.expectValue('steel', 2);

    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({steel: 2, megaCredits: 16}));
  });

  it('using titanium metal bonus without using steel', async () => {
    // Io Mining Industries cost 41 mc. Player has 10 MC, 2 Steel and 13 Ti.
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
      {canUseTitanium: true});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectValue('megaCredits', 6);
    tester.expectValue('titanium', 7);
    expect((wrapper.vm as any).steel).eq(0);
    tester.expectIsAvailable('steel', false);

    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({titanium: 7, megaCredits: 6}));
  });

  // TODO(kberg): Be greedy with science units.
  it('using science', async () => {
    // ARISTARCHUS_ROAD_NETWORK costs 15. Player has 7M€ and will use 8 science units.
    const wrapper = setupCardForPurchase(
      CardName.ARISTARCHUS_ROAD_NETWORK, 15,
      {
        megaCredits: 7,
        steel: 0,
      },
      {science: 10});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectIsAvailable('science', true);
    tester.expectValue('science', 8);
    tester.expectValue('megaCredits', 7);

    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({science: 8, megaCredits: 7}));
  });

  // TODO(kberg): be greedy with seeds.
  it('using seeds', async () => {
    // ARCTIC_ALGAE costs 12. Player has 7M€ and will use 2 seeds.
    const wrapper = setupCardForPurchase(
      CardName.ARCTIC_ALGAE, 12,
      {
        megaCredits: 7,
      },
      {seeds: 3});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectIsAvailable('seeds', true);
    tester.expectValue('seeds', 1);
    tester.expectValue('megaCredits', 7);

    tester.clickSave();
    expect(saveResponse).deep.eq(howToPay({seeds: 1, megaCredits: 7}));
  });

  it('initial setup allows for steel and titanium when using Last Restort Ingenuity', async () => {
    // Earth Office costs 1, but has no building tag or space tag.
    const wrapper = setupCardForPurchase(
      CardName.EARTH_OFFICE, 0, {
        megaCredits: 0,
        steel: 4,
        titanium: 4,
        lastCardPlayed: CardName.LAST_RESORT_INGENUITY,
      },
      {canUseSteel: false, canUseTitanium: false});

    const tester = new PaymentTester(wrapper);
    await tester.nextTick();

    tester.expectIsAvailable('steel', true);
    tester.expectIsAvailable('titanium', true);
  });

  const howToPay = function(htp: Partial<HowToPay>) : HowToPay {
    return {
      data: htp.data ?? 0,
      floaters: htp.floaters ?? 0,
      heat: htp.heat ?? 0,
      megaCredits: htp.megaCredits ?? 0,
      microbes: htp.microbes ?? 0,
      science: htp.science ?? 0,
      seeds: htp.seeds ?? 0,
      steel: htp.steel ?? 0,
      titanium: htp.titanium ?? 0,
    };
  };

  const setupCardForPurchase = function(
    cardName: CardName,
    cardCost: number,
    playerFields: Partial<PublicPlayerModel>,
    playerInputFields: Partial<PlayerInputModel>,
    reserveUnits: Units = Units.EMPTY) {
    const thisPlayer: Partial<PublicPlayerModel> = Object.assign({
      cards: [{name: cardName, calculatedCost: cardCost}],
      steel: 0,
      titanium: 0,
      steelValue: 2,
      titaniumValue: 3,
      playedCards: [],
    }, playerFields);

    const playerView: Partial<PlayerViewModel>= {
      id: 'foo',
      thisPlayer: thisPlayer as PublicPlayerModel,
    };
    const playerInput: Partial<PlayerInputModel> = {
      title: 'foo',
      cards: [{
        name: cardName,
        resources: undefined,
        resourceType: undefined,
        cardType: CardType.ACTIVE,
        isDisabled: false,
        reserveUnits: reserveUnits,
        calculatedCost: cardCost,
      }],
    };
    Object.assign(playerInput, playerInputFields);

    return mount(SelectHowToPayForProjectCard, {
      localVue: getLocalVue(),
      propsData: {
        playerView: playerView,
        playerinput: playerInput,
        onsave: (response: Array<[CardName, string]>) => {
          saveResponse = JSON.parse(response[0][1]);
        },
        showsave: true,
        showtitle: true,
      },
    });
  };
});

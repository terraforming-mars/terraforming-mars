import {createLocalVue, mount} from '@vue/test-utils';

import {expect} from 'chai';
import {CardName} from '../../src/CardName';
import {CardType} from '../../src/cards/CardType';
import {SelectHowToPayForProjectCardModel} from '../../src/components/PaymentWidgetMixin';
import SelectHowToPayForProjectCard from '../../src/components/SelectHowToPayForProjectCard.vue';
import {PlayerInputModel} from '../../src/models/PlayerInputModel';
import {PlayerModel} from '../../src/models/PlayerModel';
import {Units} from '../../src/Units';
import {FakeLocalStorage} from './FakeLocalStorage';

type Unit = 'heat' | 'steel' | 'titanium' | 'floaters' | 'microbes' | 'megaCredits' | 'science';

describe('SelectHowToPayForProjectCard', () => {
  let localStorage: FakeLocalStorage;

  beforeEach(() => {
    localStorage = new FakeLocalStorage();
    FakeLocalStorage.register(localStorage);
  });
  afterEach(() => {
    FakeLocalStorage.deregister(localStorage);
  });

  function getLocalVue() {
    const localVue = createLocalVue();
    localVue.directive('i18n', {});
    localVue.directive('trim-whitespace', {});
    return localVue;
  }

  it('uses sort order for cards', async () => {
    localStorage.setItem('cardOrderfoo', JSON.stringify({
      [CardName.ANTS]: 2,
      [CardName.BIRDS]: 1,
    }));
    const sortable = mount(SelectHowToPayForProjectCard, {
      localVue: getLocalVue(),
      propsData: {
        player: {
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

  it('select how to pay uses heat', async () => {
    // Birds will cost 10. Player has 7M€ and will use 3 of the 4 available heat units.
    const wrapper = setupCardForPurchase(
      CardName.BIRDS, 10,
      {heat: 4, megaCredits: 7},
      {canUseHeat: true});

    await wrapper.vm.$nextTick();

    expectValue(wrapper, 'heat', 3);
  });

  it('select how to pay uses heat with reserve', async () => {
    // Birds will cost 10. Player has 10 MC and 4 heat. It will select 10MC
    //
    // Then when clicking the 'max' button for heat, the algorithm will switch to 8 M€ and 2 heat.

    const wrapper = setupCardForPurchase(
      CardName.BIRDS, 10,
      {heat: 4, megaCredits: 10, titaniumValue: 1, steelValue: 1},
      {canUseHeat: true},
      Units.of({heat: 2}));

    await wrapper.vm.$nextTick();

    expectValue(wrapper, 'megaCredits', 10);
    expectValue(wrapper, 'heat', 0);

    clickMax(wrapper, 'heat');
    await wrapper.vm.$nextTick();

    expectValue(wrapper, 'megaCredits', 8);
    expectValue(wrapper, 'heat', 2);
  });

  it('select how to pay uses microbes', async () => {
    // Moss will cost 10. Player has 7M€ and will 2 of the 4 available microbes units.
    const wrapper = setupCardForPurchase(
      CardName.MOSS, 10,
      {megaCredits: 7},
      {microbes: 4});

    await wrapper.vm.$nextTick();

    expectValue(wrapper, 'microbes', 2);
  });

  it('select how to pay uses floaters', async () => {
    // Forced Precipitation will cost 10. Player has 7M€ and will 2 of the 4 available floaters.
    const wrapper = setupCardForPurchase(
      CardName.FORCED_PRECIPITATION, 10,
      {megaCredits: 6},
      {floaters: 4});

    await wrapper.vm.$nextTick();

    expectValue(wrapper, 'floaters', 2);
  });

  it('select how to pay uses steel', async () => {
    // Regoplastic will cost 10. Player has 7M€ and 4 steels.
    // They should spend at least enough to pay for the card, that is 6 M€ and 2 steel.
    const wrapper = setupCardForPurchase(
      CardName.REGO_PLASTICS, 10,
      {steel: 4, megaCredits: 7, steelValue: 2},
      {canUseSteel: true});

    await wrapper.vm.$nextTick();

    expectValue(wrapper, 'steel', 2);
  });

  it('select how to pay uses titanium metal bonus', async () => {
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

    await wrapper.vm.$nextTick();

    expectValue(wrapper, 'megaCredits', 0);
    expectValue(wrapper, 'titanium', 2);
  });

  it('select how to pay uses steel and titanium with metal bonus', async () => {
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

    await wrapper.vm.$nextTick();

    expectValue(wrapper, 'megaCredits', 0);
    expectValue(wrapper, 'steel', 3);
    expectValue(wrapper, 'titanium', 3);
  });

  it('select how to pay uses steel and microbes', async () => {
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

    await wrapper.vm.$nextTick();

    expectValue(wrapper, 'megaCredits', 0);
    expectValue(wrapper, 'steel', 4);
    expectValue(wrapper, 'microbes', 4);
  });

  it('select how to pay uses floater and microbes', async () => {
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

    await wrapper.vm.$nextTick();

    expectValue(wrapper, 'megaCredits', 1);
    expectValue(wrapper, 'microbes', 5);
    expectValue(wrapper, 'floaters', 1);
  });

  it('select how to pay uses floater and titanium', async () => {
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

    await wrapper.vm.$nextTick();

    expectValue(wrapper, 'megaCredits', 0);
    expectValue(wrapper, 'floaters', 7);
    expectValue(wrapper, 'titanium', 1);
  });

  it('select Luna Train Station limits how much steel you can use', async () => {
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

    await wrapper.vm.$nextTick();

    expectValue(wrapper, 'megaCredits', 20);
    expectValue(wrapper, 'steel', 0);
    clickMax(wrapper, 'steel');
    await wrapper.vm.$nextTick();

    expectValue(wrapper, 'megaCredits', 16);
    expectValue(wrapper, 'steel', 2);
  });

  it('select how to pay uses titanium metal bonus without using steel', async () => {
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

    await wrapper.vm.$nextTick();

    expectValue(wrapper, 'megaCredits', 6);
    expectValue(wrapper, 'titanium', 7);
    expect((wrapper.vm as any).steel).eq(0);
    expectIsAvailable(wrapper, 'steel', false);
  });

  it('select how to pay uses science', async () => {
    // ARISTARCHUS_ROAD_NETWORK costs 15. Player has 7M€ and will use 8 science units.
    const wrapper = setupCardForPurchase(
      CardName.ARISTARCHUS_ROAD_NETWORK, 15,
      {
        megaCredits: 7,
        steel: 0,
      },
      {science: 10});

    await wrapper.vm.$nextTick();

    expectIsAvailable(wrapper, 'science', true);
    expectValue(wrapper, 'science', 8);
  });

  const setupCardForPurchase = function(
    cardName: CardName,
    cardCost: number,
    playerFields: Partial<PlayerModel>,
    playerInputFields: Partial<PlayerInputModel>,
    reserveUnits: Units = Units.EMPTY) {
    const player: Partial<PlayerModel> = Object.assign({
      cards: [{name: cardName, calculatedCost: cardCost}],
      id: 'foo',
      steel: 0,
      titanium: 0,
    }, playerFields);

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
        player: player,
        playerinput: playerInput,
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
  };

  const clickMax = async function(wrapper: any, type: Unit) {
    const button = wrapper.find(selector(type) + ' ~ .btn-max');
    await button.trigger('click');
  };

  // const clickMinus = async function(wrapper: any, type: Unit) {
  //   const button = wrapper.find(selector(type) + ' ~ .btn-minus');
  //   await button.trigger('click');
  // };

  // const clickPlus = async function(wrapper: any, type: Unit) {
  //   const button = wrapper.find(selector(type) + ' ~ .btn-plus');
  //   await button.trigger('click');
  // };

  const selector = function(type: Unit) {
    const re = type === 'megaCredits' ? 'Megacredits' : (type.charAt(0).toUpperCase() + type.slice(1)); // (eg steel -> Steel)
    return '[title~=' + re + ']';
  };

  const expectValue = function(wrapper: any, type: Unit, amount: number) {
    const model = wrapper.vm as SelectHowToPayForProjectCardModel;
    let modelVal: number | undefined;
    switch (type) {
    case 'heat':
      modelVal = model.heat;
      break;
    case 'steel':
      modelVal = model.steel;
      break;
    case 'titanium':
      modelVal = model.titanium;
      break;
    case 'floaters':
      modelVal = model.floaters;
      break;
    case 'microbes':
      modelVal = model.microbes;
      break;
    case 'megaCredits':
      modelVal = model.megaCredits;
      break;
    case 'science':
      modelVal = model.science;
      break;
    }
    const textBox = wrapper.find(selector(type) + ' ~ input').element as HTMLInputElement;
    expect(textBox.value, 'text box value for ' + type).eq(String(amount));
    expect(modelVal, 'Model value for ' + type).eq(amount);
  };

  const expectIsAvailable = function(wrapper: any, type: Unit, expected: boolean) {
    const w = wrapper.find(selector(type) + ' ~ input');
    if (expected) {
      expect(w.element, `Expect input for ${type} to be visible`).is.not.undefined;
    } else {
      expect(w.element, `Expect input for ${type} to be invisible`).is.undefined;
    }
  };
});

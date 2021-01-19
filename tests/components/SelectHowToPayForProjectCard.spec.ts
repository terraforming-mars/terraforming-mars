
import {createLocalVue, mount} from '@vue/test-utils';

import {expect} from 'chai';
import {CardName} from '../../src/CardName';
import {SelectHowToPayForProjectCard} from '../../src/components/SelectHowToPayForProjectCard';
import {Units} from '../../src/Units';

describe('SelectHowToPayForProjectCard', function() {
  function getLocalVue() {
    const localVue = createLocalVue();
    localVue.directive('i18n', {});
    localVue.directive('trim-whitespace', {});
    return localVue;
  }
  let expectedStorage: {[x: string]: string} = {};
  before(function() {
    (global as any).localStorage = {
      getItem: function(key: string) {
        if (expectedStorage[key] === undefined) {
          return null;
        }
        return expectedStorage[key];
      },
      setItem: function(key: string, value: string) {
        expectedStorage[key] = value;
      },
    };
  });
  after(function() {
    (global as any).localStorage = undefined;
  });
  beforeEach(function() {
    expectedStorage = {};
  });
  it('uses sort order for cards', async function() {
    expectedStorage['cardOrderfoo'] = JSON.stringify({
      [CardName.ANTS]: 2,
      [CardName.BIRDS]: 1,
    });
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
          }, {
            name: CardName.BIRDS,
          }],
        },
        onsave: function() {},
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

  it('select how to pay uses heat', async function() {
    // Birds will cost 10. Player has 7MC and will use 3 of the 4 available heat units.
    const wrapper = setupCardForPurchase(
      CardName.BIRDS, 10,
      {heat: 4, megaCredits: 7},
      {canUseHeat: true});

    const vm = wrapper.vm;
    await vm.$nextTick();

    expect(vm.heat).eq(3);
    const heatTextBox = wrapper.find('[title~=Heat] ~ input').element as HTMLInputElement;
    expect(heatTextBox.value).eq('3');
  });

  it('select how to pay uses microbes', async function() {
    // Moss will cost 10. Player has 7MC and will 2 of the 4 available microbes units.
    const wrapper = setupCardForPurchase(
      CardName.MOSS, 10,
      {megaCredits: 7},
      {microbes: 4});

    const vm = wrapper.vm;
    await vm.$nextTick();

    expect(vm.microbes).eq(2);
    const microbesTextBox = wrapper.find('[title~=Microbes] ~ input').element as HTMLInputElement;
    expect(microbesTextBox.value).eq('2');
  });

  it('select how to pay uses floaters', async function() {
    // Forced Precipitation will cost 10. Player has 7MC and will 2 of the 4 available floaters.
    const wrapper = setupCardForPurchase(
      CardName.FORCED_PRECIPITATION, 10,
      {megaCredits: 6},
      {floaters: 4});

    const vm = wrapper.vm;
    await vm.$nextTick();

    expect(vm.floaters).eq(2);
    const floatersTextBox = wrapper.find('[title~=Floaters] ~ input').element as HTMLInputElement;
    expect(floatersTextBox.value).eq('2');
  });

  it('select how to pay uses steel', async function() {
    // Forced Precipitation will cost 10. Player has 7MC and will 1 of the 4 available units of steel even though
    // that leaves the player 1MC short.
    const wrapper = setupCardForPurchase(
      CardName.COMMERCIAL_DISTRICT, 10,
      {steel: 4, megaCredits: 7, steelValue: 2},
      {canUseSteel: true});

    const vm = wrapper.vm;
    await vm.$nextTick();

    expect(vm.steel).eq(1);
    const steelTextBox = wrapper.find('[title~=Steel] ~ input').element as HTMLInputElement;
    expect(steelTextBox.value).eq('1');
  });

  const setupCardForPurchase = function(
    cardName: CardName, cardCost: number, playerFields: object, playerInputFields: object) {
    const player = Object.assign({
      cardsInHand: [{name: cardName, calculatedCost: cardCost, reserveUnits: Units.of({})}],
      id: 'foo',
      selfReplicatingRobotCards: [],
    }, playerFields);
    const playerInput = Object.assign({title: 'foo', cards: [{name: cardName}]}, playerInputFields);

    return mount(SelectHowToPayForProjectCard, {
      localVue: getLocalVue(),
      propsData: {
        player: player,
        playerinput: playerInput,
        onsave: function() {},
        showsave: true,
        showtitle: true,
      },
    });
  };
});

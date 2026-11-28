import {shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import SelectCard from '@/client/components/SelectCard.vue';
import Card from '@/client/components/card/Card.vue';
import {CardName} from '@/common/cards/CardName';
import {fakePlayerViewModel, fakePublicPlayerModel} from './testHelpers';

describe('SelectCard', () => {
  it('mounts without errors', () => {
    const wrapper = shallowMount(SelectCard, {
      ...globalConfig,
      props: {
        playerView: fakePlayerViewModel(),
        playerinput: {
          title: 'Select a card',
          buttonLabel: 'Save',
          type: 'card',
          cards: [],
          max: 1,
          min: 1,
          showOnlyInLearnerMode: false,
          selectBlueCardAction: false,
          showOwner: false,
          showSelectAll: false,
        },
        onsave: () => {},
        showsave: true,
        showtitle: true,
      },
    });
    expect(wrapper.exists()).to.be.true;
  });

  it('labels cards with their owners and shows your own cards last', () => {
    const me = fakePublicPlayerModel({color: 'blue', name: 'Me', tableau: [{name: CardName.ANTS}]});
    const opponent = fakePublicPlayerModel({color: 'red', name: 'Opponent', tableau: [{name: CardName.TARDIGRADES}]});
    const wrapper = shallowMount(SelectCard, {
      ...globalConfig,
      props: {
        playerView: fakePlayerViewModel({thisPlayer: me, players: [me, opponent]}),
        playerinput: {
          title: 'Select a card',
          buttonLabel: 'Save',
          type: 'card',
          cards: [{name: CardName.ANTS}, {name: CardName.TARDIGRADES}],
          max: 1,
          min: 1,
          showOnlyInLearnerMode: false,
          selectBlueCardAction: false,
          showOwner: true,
          showSelectAll: false,
        },
        onsave: () => {},
      },
    });

    const cards = wrapper.findAllComponents(Card).map((card) => card.props('card').name);
    expect(cards).deep.eq([CardName.TARDIGRADES, CardName.ANTS]);
    const labels = wrapper.findAll('.cardbox > .card-owner-label').map((label) => label.text());
    expect(labels).deep.eq(['Opponent', 'Your card']);
  });
});

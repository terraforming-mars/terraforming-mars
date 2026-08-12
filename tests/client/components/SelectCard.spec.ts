import {mount, shallowMount} from '@vue/test-utils';
import {expect} from 'chai';
import {globalConfig} from './getLocalVue';
import SelectCard from '@/client/components/SelectCard.vue';
import {fakePlayerViewModel} from './testHelpers';
import {CardName} from '@/common/cards/CardName';
import {CardModel} from '@/common/models/CardModel';

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

  it('mouseup and touchend on a card toggle its selection, mirroring a label click', async () => {
    const wrapper = mount(SelectCard, {
      ...globalConfig,
      props: {
        playerView: fakePlayerViewModel(),
        playerinput: {
          title: 'Select a card',
          buttonLabel: 'Save',
          type: 'card',
          cards: [{name: CardName.ANTS}, {name: CardName.BIRDS}] as Array<CardModel>,
          max: 2,
          min: 0,
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

    const cardBoxes = wrapper.findAll('.cardbox');
    expect(cardBoxes).to.have.length(2);
    const checkboxes = cardBoxes.map((box) => box.find('input[type=checkbox]').element as HTMLInputElement);

    await cardBoxes[0].trigger('mouseup');
    expect(checkboxes[0].checked).to.be.true;

    await cardBoxes[0].trigger('mouseup');
    expect(checkboxes[0].checked).to.be.false;

    await cardBoxes[1].trigger('touchend');
    expect(checkboxes[1].checked).to.be.true;
  });
});

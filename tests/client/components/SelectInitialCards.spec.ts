
import {mount} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import SelectInitialCards from '@/client/components/SelectInitialCards.vue';

describe('SelectInitialCards', function() {
  it('saves data without prelude', async function() {
    let savedData: Array<Array<string>> | undefined;
    const component = mount(SelectInitialCards, {
      localVue: getLocalVue(),
      propsData: {
        playerView: {
          id: 'foo',
        },
        playerinput: {
          title: 'foo',
          options: [{
            title: 'select corporation',
            cards: [{name: CardName.ECOLINE}],
          }, {
            title: 'select cards',
            cards: [{name: CardName.ANTS}],
          }],
        },
        onsave: function(data: Array<Array<string>>) {
          savedData = data;
        },
        showsave: true,
      },
    });
    expect(component).not.is.undefined;
    const selectCards = component.findAllComponents({name: 'select-card'});
    expect(selectCards.length).to.eq(2);
    await selectCards.at(0).vm.$emit('cardschanged', [CardName.ECOLINE]);
    await selectCards.at(1).vm.$emit('cardschanged', [CardName.ANTS]);
    const buttons = component.findAllComponents({name: 'Button'});
    await buttons.at(0).findAllComponents({
      name: 'button',
    }).at(0).trigger('click');
    expect(savedData).to.deep.eq([[CardName.ECOLINE], [CardName.ANTS]]);
  });
  it('saves data with prelude', async function() {
    let savedData: Array<Array<string>> | undefined;
    const component = mount(SelectInitialCards, {
      localVue: getLocalVue(),
      propsData: {
        playerView: {
          id: 'foo',
        },
        playerinput: {
          title: 'foo',
          options: [{
            title: 'select corporation',
            cards: [{name: CardName.ECOLINE}],
          }, {
            title: 'select prelude',
            cards: [{name: CardName.ALLIED_BANKS}],
          }, {
            title: 'select cards',
            cards: [{name: CardName.ANTS}],
          }],
        },
        onsave: function(data: Array<Array<string>>) {
          savedData = data;
        },
        showsave: true,
      },
    });
    expect(component).not.is.undefined;
    const selectCards = component.findAllComponents({name: 'select-card'});
    expect(selectCards.length).to.eq(3);
    await selectCards.at(0).vm.$emit('cardschanged', [CardName.ECOLINE]);
    await selectCards.at(1).vm.$emit('cardschanged', [CardName.ALLIED_BANKS]);
    await selectCards.at(2).vm.$emit('cardschanged', [CardName.ANTS]);
    const buttons = component.findAllComponents({name: 'Button'});
    await buttons.at(0).findAllComponents({
      name: 'button',
    }).at(0).trigger('click');
    expect(savedData).to.deep.eq([[CardName.ECOLINE], [CardName.ALLIED_BANKS], [CardName.ANTS]]);
  });
});

import {mount, Wrapper} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import SelectInitialCards from '@/client/components/SelectInitialCards.vue';
import {InputResponse} from '@/common/inputs/InputResponse';
import ConfirmDialog from '@/client/components/common/ConfirmDialog.vue';
import {Preferences} from '@/client/utils/PreferencesManager';

let savedData: InputResponse | undefined;

describe('SelectInitialCards', function() {
  beforeEach(() => {
    savedData = [];
  });

  it('saves data without prelude', async function() {
    const component = createComponent([CardName.ECOLINE], [CardName.ANTS]);
    expect(component).not.is.undefined;

    const button = getButton(component);
    expect(button.attributes().disabled).eq('disabled');

    const selectCards = component.findAllComponents({name: 'select-card'});
    expect(selectCards.length).to.eq(2);
    selectCards.at(0).vm.$emit('cardschanged', [CardName.ECOLINE]);

    await component.vm.$nextTick();
    expect(button.attributes().disabled).is.undefined;

    selectCards.at(1).vm.$emit('cardschanged', [CardName.ANTS]);
    await component.vm.$nextTick();

    await button.trigger('click');

    expect(savedData).to.deep.eq([[CardName.ECOLINE], [CardName.ANTS]]);
  });

  it('Cannot save with only one prelude', async function() {
    const component = createComponent([CardName.ECOLINE], [CardName.ANTS], [CardName.ALLIED_BANK]);
    expect(component).not.is.undefined;

    const selectCards = component.findAllComponents({name: 'select-card'});
    expect(selectCards.length).to.eq(3);
    selectCards.at(0).vm.$emit('cardschanged', [CardName.ECOLINE]);
    selectCards.at(1).vm.$emit('cardschanged', [CardName.ALLIED_BANK]);
    selectCards.at(2).vm.$emit('cardschanged', [CardName.ANTS]);
    await component.vm.$nextTick();

    const button = getButton(component);
    expect(button.attributes().disabled).eq('disabled');
  });

  it('saves data with prelude', async function() {
    const component = createComponent(
      [CardName.ECOLINE],
      [CardName.ANTS],
      [CardName.ALLIED_BANK, CardName.SUPPLY_DROP]);
    expect(component).not.is.undefined;

    const button = getButton(component);
    expect(button.attributes().disabled).eq('disabled');

    const selectCards = component.findAllComponents({name: 'select-card'});
    expect(selectCards.length).to.eq(3);

    selectCards.at(0).vm.$emit('cardschanged', [CardName.ECOLINE]);
    await component.vm.$nextTick();
    expect(button.attributes().disabled).eq('disabled');

    selectCards.at(1).vm.$emit('cardschanged', [CardName.ALLIED_BANK, CardName.SUPPLY_DROP]);

    await component.vm.$nextTick();
    expect(button.attributes().disabled).is.undefined;

    selectCards.at(2).vm.$emit('cardschanged', [CardName.ANTS]);
    await component.vm.$nextTick();

    await button.trigger('click');

    expect(savedData).to.deep.eq([[CardName.ECOLINE], [CardName.ALLIED_BANK, CardName.SUPPLY_DROP], [CardName.ANTS]]);

    await component.vm.$nextTick();
    const confirmationDialog = component.vm.$refs.confirmation as InstanceType<typeof ConfirmDialog>;
    expect(confirmationDialog.$data.shown).is.false;
  });

  it('shows error when no project cards selected', async function() {
    const component = createComponent([CardName.ECOLINE], [CardName.ANTS]);
    const selectCards = component.findAllComponents({name: 'select-card'});
    selectCards.at(0).vm.$emit('cardschanged', [CardName.ECOLINE]);
    await component.vm.$nextTick();

    const button = getButton(component);
    await button.trigger('click');

    expect(savedData).is.empty;

    await component.vm.$nextTick();
    const confirmationDialog = component.vm.$refs.confirmation as InstanceType<typeof ConfirmDialog>;
    expect(confirmationDialog.$data.shown).is.true;
  });

  it('shows error when prelude cards are selected but not project cards', async function() {
    const component = createComponent(
      [CardName.ECOLINE],
      [CardName.ANTS],
      [CardName.ALLIED_BANK, CardName.SUPPLY_DROP]);

    const selectCards = component.findAllComponents({name: 'select-card'});
    selectCards.at(0).vm.$emit('cardschanged', [CardName.ECOLINE]);
    selectCards.at(1).vm.$emit('cardschanged', [CardName.ALLIED_BANK, CardName.SUPPLY_DROP]);
    await component.vm.$nextTick();
    const button = getButton(component);
    await button.trigger('click');
    expect(savedData).is.empty;

    await component.vm.$nextTick();
    const confirmationDialog = component.vm.$refs.confirmation as InstanceType<typeof ConfirmDialog>;
    expect(confirmationDialog.$data.shown).is.true;
  });
});

function getButton(component: Wrapper<SelectInitialCards>) {
  const button = component.findAllComponents({name: 'Button'}).at(0);
  return button.findAllComponents({name: 'button'}).at(0);
}

function createComponent(corpCards: Array<CardName>, projectCards: Array<CardName>, preludeCards?: Array<CardName>) {
  const toObject = (cards: Array<CardName>) => cards.map((name) => {
    return {name};
  });
  const options = [{
    title: 'select corporation',
    cards: toObject(corpCards),
  }, {
    title: 'select cards',
    cards: toObject(projectCards),
  }];

  if (preludeCards) {
    options.splice(1, 0, {
      title: 'select prelude',
      cards: toObject(preludeCards),
    });
  }

  return mount(SelectInitialCards, {
    localVue: getLocalVue(),
    propsData: {
      playerView: {
        id: 'foo',
        dealtCorporationCards: [],
        thisPlayer: {actionsThisGeneration: []},
      },
      playerinput: {
        title: 'foo',
        options,
      },
      onsave: function(data: Array<Array<string>>) {
        savedData = data;
      },
      showsave: true,
      preferences: {
        show_alerts: true,
      } as Readonly<Preferences>,
    },
  });
}

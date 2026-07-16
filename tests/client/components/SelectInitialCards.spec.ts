import {mount, Wrapper} from '@vue/test-utils';
import {getLocalVue} from './getLocalVue';
import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import SelectInitialCards from '@/client/components/SelectInitialCards.vue';
import {SelectInitialCardsResponse, InputResponse} from '@/common/inputs/InputResponse';
import ConfirmDialog from '@/client/components/common/ConfirmDialog.vue';
import {Preferences} from '@/client/utils/PreferencesManager';
import * as titles from '@/common/inputs/SelectInitialCards';
import {SelectCardModel} from '@/common/models/PlayerInputModel';
import {CardModel} from '@/common/models/CardModel';

let savedData: InputResponse | undefined;

describe('SelectInitialCards', () => {
  beforeEach(() => {
    savedData = undefined;
  });

  it('saves data without prelude', async () => {
    const component = createComponent([CardName.ECOLINE], [CardName.ANTS]);
    expect(component).not.is.undefined;

    const button = getButton(component);
    expect(button.attributes().disabled).eq('disabled');

    const selectCards = component.findAllComponents({name: 'select-card'});
    expect(selectCards).has.length(2);
    selectCards.at(0).vm.$emit('cardschanged', [CardName.ECOLINE]);

    await component.vm.$nextTick();
    expect(button.attributes().disabled).is.undefined;

    selectCards.at(1).vm.$emit('cardschanged', [CardName.ANTS]);
    await component.vm.$nextTick();

    await button.trigger('click');

    expect(savedData).to.deep.eq({type: 'initialCards', responses: [
      {type: 'card', cards: [CardName.ECOLINE]},
      {type: 'card', cards: [CardName.ANTS]},
    ]});
  });

  it('Cannot save with only one prelude', async () => {
    const component = createComponent([CardName.ECOLINE], [CardName.ANTS], [CardName.ALLIED_BANK]);
    expect(component).not.is.undefined;

    const selectCards = component.findAllComponents({name: 'select-card'});
    expect(selectCards).has.length(3);
    selectCards.at(0).vm.$emit('cardschanged', [CardName.ECOLINE]);
    selectCards.at(1).vm.$emit('cardschanged', [CardName.ALLIED_BANK]);
    selectCards.at(2).vm.$emit('cardschanged', [CardName.ANTS]);
    await component.vm.$nextTick();

    const button = getButton(component);
    expect(button.attributes().disabled).eq('disabled');
  });

  it('saves data with prelude', async () => {
    const component = createComponent(
      [CardName.ECOLINE],
      [CardName.ANTS],
      [CardName.ALLIED_BANK, CardName.SUPPLY_DROP]);
    expect(component).not.is.undefined;

    const button = getButton(component);
    expect(button.attributes().disabled).eq('disabled');

    const selectCards = component.findAllComponents({name: 'select-card'});
    expect(selectCards).has.length(3);

    selectCards.at(0).vm.$emit('cardschanged', [CardName.ECOLINE]);
    await component.vm.$nextTick();
    expect(button.attributes().disabled).eq('disabled');

    selectCards.at(1).vm.$emit('cardschanged', [CardName.ALLIED_BANK, CardName.SUPPLY_DROP]);

    await component.vm.$nextTick();
    expect(button.attributes().disabled).is.undefined;

    selectCards.at(2).vm.$emit('cardschanged', [CardName.ANTS]);
    await component.vm.$nextTick();

    await button.trigger('click');

    expect(savedData).to.deep.eq({type: 'initialCards', responses: [
      {type: 'card', cards: [CardName.ECOLINE]},
      {type: 'card', cards: [CardName.ALLIED_BANK, CardName.SUPPLY_DROP]},
      {type: 'card', cards: [CardName.ANTS]},
    ]});

    await component.vm.$nextTick();
    const confirmationDialog = component.vm.$refs.confirmation as InstanceType<typeof ConfirmDialog>;
    expect(confirmationDialog.$data.shown).is.false;
  });

  it('shows error when no project cards selected', async () => {
    const component = createComponent([CardName.ECOLINE], [CardName.ANTS]);
    const selectCards = component.findAllComponents({name: 'select-card'});
    selectCards.at(0).vm.$emit('cardschanged', [CardName.ECOLINE]);
    await component.vm.$nextTick();

    const button = getButton(component);
    await button.trigger('click');

    expect(savedData).is.undefined;

    await component.vm.$nextTick();
    const confirmationDialog = getConfirmDialog(component);
    expect(confirmationDialog.$data.shown).is.true;
  });

  it('shows error when prelude cards are selected but not project cards', async () => {
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
    expect(savedData).is.undefined;

    await component.vm.$nextTick();
    const confirmationDialog = getConfirmDialog(component);
    expect(confirmationDialog.$data.shown).is.true;
  });

  it('Cannot select two ceos', async () => {
    const component = createComponent([CardName.ECOLINE], [CardName.ANTS], undefined, [CardName.FLOYD, CardName.HAL9000, CardName.ENDER]);
    expect(component).not.is.undefined;

    const selectCards = component.findAllComponents({name: 'select-card'});
    expect(selectCards).has.length(3);
    selectCards.at(0).vm.$emit('cardschanged', [CardName.ECOLINE]);
    selectCards.at(1).vm.$emit('cardschanged', [CardName.FLOYD, CardName.HAL9000]);
    selectCards.at(2).vm.$emit('cardschanged', [CardName.ANTS]);
    await component.vm.$nextTick();

    const button = getButton(component);
    expect(button.attributes().disabled).eq('disabled');
  });
});

function getButton(component: Wrapper<SelectInitialCards>) {
  const button = component.findAllComponents({name: 'AppButton'}).at(0);
  return button.findAllComponents({name: 'AppButton'}).at(0);
}

function getConfirmDialog(component: Wrapper<SelectInitialCards>): InstanceType<typeof ConfirmDialog> {
  return component.vm.$refs.confirmation as InstanceType<typeof ConfirmDialog>;
}

function createComponent(corpCards: Array<CardName>, projectCards: Array<CardName>, preludeCards?: Array<CardName>, ceoCards?: Array<CardName>) {
  const toObject = (cards: Array<CardName>) => cards.map((name) => {
    return {name} as CardModel;
  });
  const options: Array<SelectCardModel> = [{
    type: 'card',
    title: titles.SELECT_CORPORATION_TITLE,
    buttonLabel: 'x',
    cards: toObject(corpCards),
    max: 1,
    min: 1,
    showOnlyInLearnerMode: false,
    selectBlueCardAction: false,
    showOwner: false,
  }, {
    type: 'card',
    title: titles.SELECT_PROJECTS_TITLE,
    buttonLabel: 'x',
    cards: toObject(projectCards),
    max: projectCards.length,
    min: 1,
    showOnlyInLearnerMode: false,
    selectBlueCardAction: false,
    showOwner: false,
  }];

  if (preludeCards) {
    options.splice(1, 0, {
      type: 'card',
      title: titles.SELECT_PRELUDE_TITLE,
      buttonLabel: 'x',
      cards: toObject(preludeCards),
      max: 2,
      min: 2,
      showOnlyInLearnerMode: false,
      selectBlueCardAction: false,
      showOwner: false,
    });
  }
  if (ceoCards) {
    options.push({
      type: 'card',
      title: titles.SELECT_CEO_TITLE,
      buttonLabel: 'x',
      cards: toObject(ceoCards),
      max: 1,
      min: 1,
      showOnlyInLearnerMode: false,
      selectBlueCardAction: false,
      showOwner: false,
    });
  }

  return mount(SelectInitialCards, {
    localVue: getLocalVue(),
    propsData: {
      playerView: {
        id: 'foo',
        dealtCorporationCards: [],
        thisPlayer: {actionsThisGeneration: []},
        game: {},
      },
      playerinput: {
        title: 'selectInitialCards',
        options,
      },
      onsave: function(data: SelectInitialCardsResponse) {
        savedData = data;
      },
      showsave: true,
      preferences: {
        show_alerts: true,
      } as Readonly<Preferences>,
    },
  });
}

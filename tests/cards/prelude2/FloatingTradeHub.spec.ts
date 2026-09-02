import {expect} from 'chai';
import {cast} from '@/common/utils/utils';
import {toName} from '../../../src/common/utils/utils';
import {FloatingTradeHub} from '../../../src/server/cards/prelude2/FloatingTradeHub';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {SelectOption} from '../../../src/server/inputs/SelectOption';
import {newProjectCard} from '../../../src/server/createCard';
import {CardName} from '../../../src/common/cards/CardName';
import {AndOptions} from '../../../src/server/inputs/AndOptions';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';
import {SelectResource} from '../../../src/server/inputs/SelectResource';
import {Units} from '../../../src/common/Units';

describe('FloatingTradeHub', () => {
  let card: FloatingTradeHub;
  let player: TestPlayer;

  beforeEach(() => {
    card = new FloatingTradeHub();
    [/* game */, player] = testGame(2, {preludeExtension: true});
    player.playedCards.push(card);
  });

  it('canAct', () => {
    expect(card.canAct()).is.true;
  });

  it('adds floaters immediately when Floating Trade Hub is the only target', () => {
    cast(card.action(player), undefined);

    expect(card.resourceCount).eq(2);
  });

  it('prompts for a floater card when multiple targets are available', () => {
    player.playedCards.push(newProjectCard(CardName.TARDIGRADES)!);
    player.playedCards.push(newProjectCard(CardName.AERIAL_MAPPERS)!);
    const selectCard = cast(card.action(player), SelectCard);

    expect(selectCard.cards.map(toName)).deep.eq([card.name, CardName.AERIAL_MAPPERS]);

    selectCard.cb([card]);

    expect(card.resourceCount).eq(2);
  });

  it('act - select resource', () => {
    card.resourceCount = 5;

    const orOptions = cast(card.action(player), OrOptions);

    expect(orOptions.options).has.length(2);
    const andOptions = cast(orOptions.options[1], AndOptions);
    const selectAmount = cast(andOptions.options[0], SelectAmount);
    const selectResource = cast(andOptions.options[1], SelectResource);

    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(5);
    expect(selectResource.include).deep.eq(Units.keys);

    andOptions.process({type: 'and', responses: [
      {type: 'amount', amount: 4},
      {type: 'resource', resource: 'plants'},
    ]}, player);

    expect(player.stock.asUnits()).deep.eq(Units.of({plants: 4}));
    expect(card.resourceCount).to.eq(1);
  });

  it('act - add resources branch autoselects the only target card when converting floaters is available', () => {
    card.resourceCount = 5;

    const orOptions = cast(card.action(player), OrOptions);
    const selectOption = cast(orOptions.options[0], SelectOption);

    selectOption.cb(undefined);

    expect(card.resourceCount).eq(7);
  });

  it('act - add resources branch prompts when multiple targets and converting floaters are available', () => {
    card.resourceCount = 5;
    player.playedCards.push(newProjectCard(CardName.AERIAL_MAPPERS)!);

    const orOptions = cast(card.action(player), OrOptions);
    const selectCard = cast(orOptions.options[0], SelectCard);

    expect(selectCard.cards.map(toName)).deep.eq([card.name, CardName.AERIAL_MAPPERS]);

    selectCard.cb([card]);

    expect(card.resourceCount).eq(7);
  });
});

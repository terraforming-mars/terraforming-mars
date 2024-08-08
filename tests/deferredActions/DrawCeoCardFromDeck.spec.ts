import {expect} from 'chai';
import {ICeoCard} from '../../src/server/cards/ceos/ICeoCard';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {formatMessage, cast, runAllActions} from '../TestingUtils';
import {testGame} from '../TestGame';
import {CeoCard} from '../../src/server/cards/ceos/CeoCard';
import {CardName} from '../../src/common/cards/CardName';
import {DrawCeoCardFromDeck} from '../../src/server/deferredActions/DrawCeoCardFromDeck';
class UnPlayableCeo extends CeoCard {
  constructor() {
    super({
      name: 'unplayable' as CardName,
      metadata: {},
    });
  }

  override canPlay(): boolean {
    return false;
  }
}

describe('DrawCeoCardFromDeck', () => {
  it('execute', () => {
    const [game, player] = testGame(1, {ceoExtension: true});
    let card: ICeoCard | undefined;
    const action = new DrawCeoCardFromDeck(player, 3).andThen((c) => card = c);

    const selectCard = cast(action.execute(), SelectCard<ICeoCard>);
    expect(selectCard.cards).has.length(3);
    const selected = selectCard.cards[0];
    selectCard.cb([selected]);

    expect(card).eq(selected);
    expect(game.ceoDeck.discardPile).has.length(2);
  });

  it('one unplauable CEO', () => {
    const [game, player] = testGame(1, {ceoExtension: true});
    game.ceoDeck.drawPile.push(new UnPlayableCeo());
    let card: ICeoCard | undefined;
    const action = new DrawCeoCardFromDeck(player, 3).andThen((c) => card = c);

    const selectCard = cast(action.execute(), SelectCard<ICeoCard>);
    expect(selectCard.cards).has.length(2);
    expect(game.ceoDeck.discardPile).has.length(1);
    const selected = selectCard.cards[0];
    selectCard.cb([selected]);

    expect(card).eq(selected);
    expect(game.ceoDeck.discardPile).has.length(2);
  });

  it('No playable CEOs', () => {
    const [game, player] = testGame(1, {ceoExtension: true});
    expect(game.ceoDeck.discardPile).is.empty;
    game.ceoDeck.drawPile.push(new UnPlayableCeo(), new UnPlayableCeo(), new UnPlayableCeo());

    let card: ICeoCard | undefined;
    const action = new DrawCeoCardFromDeck(player, 3).andThen((c) => card = c);
    cast(action.execute(), undefined);

    runAllActions(game);

    expect(card).is.undefined;
    expect(game.ceoDeck.discardPile).has.length(3);
    expect(formatMessage(game.gameLog[game.gameLog.length - 1])).matches(/drew no playable CEO cards/);
  });
});

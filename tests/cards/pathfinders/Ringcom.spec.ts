import {expect} from 'chai';
import {Ringcom} from '../../../src/server/cards/pathfinders/Ringcom';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {fakeCard, runAllActions} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';

describe('Ringcom', () => {
  let card: Ringcom;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Ringcom();
    [game, player, player2] = testGame(2);
  });

  it('play', () => {
    expect(player.titanium).eq(0);
    expect(player.production.megacredits).eq(0);
    player.playCard(card);
    expect(player.titanium).eq(1);
    expect(player.production.megacredits).eq(3);
  });

  it('initialAction', () => {
    const a = fakeCard({name: 'A' as CardName, tags: [Tag.JOVIAN]});
    const b = fakeCard({name: 'B' as CardName, tags: []});
    const c = fakeCard({name: 'C' as CardName, tags: [Tag.EARTH]});
    const d = fakeCard({name: 'D' as CardName, tags: [Tag.JOVIAN]});
    game.projectDeck.drawPile.push(a, b, c, d);

    player.defer(card.initialAction(player));
    runAllActions(game);

    expect(player.cardsInHand).has.members([a, d]);
  });

  it('when you play a jovian tag', () => {
    player.playedCards.push(card);
    const a = fakeCard({name: 'A' as CardName, tags: [Tag.JOVIAN]});
    expect(player.titanium).eq(0);
    player.playCard(a);
    expect(player.titanium).eq(1);
  });

  it('when opponent plays a jovian tag', () => {
    player.playedCards.push(card);
    const a = fakeCard({name: 'A' as CardName, tags: [Tag.JOVIAN]});
    expect(player.titanium).eq(0);
    player2.playCard(a);
    expect(player.titanium).eq(1);
  });
});

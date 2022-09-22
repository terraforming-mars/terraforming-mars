import {expect} from 'chai';
import {Ringcom} from '../../../src/server/cards/pathfinders/Ringcom';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {fakeCard} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';

describe('Ringcom', function() {
  let card: Ringcom;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Ringcom();
    game = newTestGame(2);
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    player.setCorporationForTest(card);
  });

  it('play', () => {
    expect(player.titanium).eq(0);
    expect(player.production.megacredits).eq(0);
    card.play(player);
    expect(player.titanium).eq(1);
    expect(player.production.megacredits).eq(3);
  });

  it('initialAction', function() {
    const a = fakeCard({name: 'A' as CardName, tags: [Tag.JOVIAN]});
    const b = fakeCard({name: 'B' as CardName, tags: []});
    const c = fakeCard({name: 'C' as CardName, tags: [Tag.EARTH]});
    const d = fakeCard({name: 'D' as CardName, tags: [Tag.JOVIAN]});
    game.projectDeck.drawPile.push(a, b, c, d);

    card.initialAction(player);

    expect(player.cardsInHand).has.members([a, d]);
  });

  it('when you play a jovian tag', function() {
    const a = fakeCard({name: 'A' as CardName, tags: [Tag.JOVIAN]});
    expect(player.titanium).eq(0);
    player.playCard(a);
    expect(player.titanium).eq(1);
  });

  it('when opponent plays a jovian tag', function() {
    const a = fakeCard({name: 'A' as CardName, tags: [Tag.JOVIAN]});
    expect(player.titanium).eq(0);
    player2.playCard(a);
    expect(player.titanium).eq(1);
  });
});

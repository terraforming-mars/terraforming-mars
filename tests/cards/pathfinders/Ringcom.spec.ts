import {expect} from 'chai';
import {Ringcom} from '../../../src/cards/pathfinders/Ringcom';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {fakeCard} from '../../TestingUtils';
import {Tags} from '../../../src/common/cards/Tags';

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

  it('initialAction', function() {
    const a = fakeCard({name: 'A' as CardName, tags: [Tags.JOVIAN]});
    const b = fakeCard({name: 'B' as CardName, tags: []});
    const c = fakeCard({name: 'C' as CardName, tags: [Tags.EARTH]});
    const d = fakeCard({name: 'D' as CardName, tags: [Tags.JOVIAN]});
    game.dealer.deck.push(a, b, c, d);

    card.initialAction(player);

    expect(player.cardsInHand).has.members([a, d]);
  });

  it('when you play a jovian tag', function() {
    const a = fakeCard({name: 'A' as CardName, tags: [Tags.JOVIAN]});
    expect(player.titanium).eq(0);
    player.playCard(a);
    expect(player.titanium).eq(1);
  });

  it('when opponent plays a jovian tag', function() {
    const a = fakeCard({name: 'A' as CardName, tags: [Tags.JOVIAN]});
    expect(player.titanium).eq(0);
    player2.playCard(a);
    expect(player.titanium).eq(1);
  });
});

import {expect} from 'chai';
import {Ringcom} from '../../../src/cards/pathfinders/Ringcom';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {CardName} from '../../../src/CardName';
import {TestingUtils} from '../../TestingUtils';
import {Tags} from '../../../src/cards/Tags';

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
    player.corporationCard = card;
  });

  it('initialAction', function() {
    const a = TestingUtils.fakeCard({name: 'A' as CardName, tags: [Tags.JOVIAN]});
    const b = TestingUtils.fakeCard({name: 'B' as CardName, tags: []});
    const c = TestingUtils.fakeCard({name: 'C' as CardName, tags: [Tags.EARTH]});
    const d = TestingUtils.fakeCard({name: 'D' as CardName, tags: [Tags.JOVIAN]});
    game.dealer.deck.push(a, b, c, d);

    card.initialAction(player);

    expect(player.cardsInHand).has.members([a, d]);
  });

  it('when you play a jovian tag', function() {
    const a = TestingUtils.fakeCard({name: 'A' as CardName, tags: [Tags.JOVIAN]});
    expect(player.titanium).eq(0);
    player.playCard(a);
    expect(player.titanium).eq(1);
  });

  it('when opponent plays a jovian tag', function() {
    const a = TestingUtils.fakeCard({name: 'A' as CardName, tags: [Tags.JOVIAN]});
    expect(player.titanium).eq(0);
    player2.playCard(a);
    expect(player.titanium).eq(1);
  });
});

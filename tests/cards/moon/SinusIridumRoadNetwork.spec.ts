import {TestPlayer} from '../../TestPlayer';
import {SinusIridumRoadNetwork} from '../../../src/server/cards/moon/SinusIridumRoadNetwork';
import {expect} from 'chai';
import {PlaceMoonRoadTile} from '../../../src/server/moon/PlaceMoonRoadTile';
import {testGame} from '../../TestingUtils';

describe('SinusIridumRoadNetwork', () => {
  let player: TestPlayer;
  let card: SinusIridumRoadNetwork;

  beforeEach(() => {
    [/* game */, player] = testGame(1, {moonExpansion: true});
    card = new SinusIridumRoadNetwork();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.steel = 0;
    player.production.override({energy: 1});
    expect(player.getPlayableCards()).does.not.include(card);

    player.steel = 1;
    player.production.override({energy: 0});
    expect(player.getPlayableCards()).does.not.include(card);


    player.steel = 1;
    player.production.override({energy: 1});
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.steel = 2;
    player.production.override({energy: 1});
    player.steel = 1;
    expect(player.production.megacredits).eq(0);

    card.play(player);

    expect(player.steel).eq(0);
    expect(player.production.energy).eq(0);
    expect(player.production.megacredits).eq(3);

    expect(player.game.deferredActions.peek()).instanceOf(PlaceMoonRoadTile);
  });
});


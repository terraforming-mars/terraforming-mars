import {Game} from '../../../src/server/Game';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SinusIridiumRoadNetwork} from '../../../src/server/cards/moon/SinusIridiumRoadNetwork';
import {expect} from 'chai';
import {PlaceMoonRoadTile} from '../../../src/server/moon/PlaceMoonRoadTile';

describe('SinusIridiumRoadNetwork', () => {
  let player: TestPlayer;
  let card: SinusIridiumRoadNetwork;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new SinusIridiumRoadNetwork();
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


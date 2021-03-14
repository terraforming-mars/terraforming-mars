import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TestPlayer} from '../../TestPlayer';
import {SinusIridiumRoadNetwork} from '../../../src/cards/moon/SinusIridiumRoadNetwork';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {PlaceMoonRoadTile} from '../../../src/moon/PlaceMoonRoadTile';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('SinusIridiumRoadNetwork', () => {
  let player: TestPlayer;
  let card: SinusIridiumRoadNetwork;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new SinusIridiumRoadNetwork();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.steel = 0;
    player.setProductionForTest({energy: 1});
    expect(player.getPlayableCards()).does.not.include(card);

    player.steel = 1;
    player.setProductionForTest({energy: 0});
    expect(player.getPlayableCards()).does.not.include(card);


    player.steel = 1;
    player.setProductionForTest({energy: 1});
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.steel = 2;
    player.setProductionForTest({energy: 1});
    player.steel = 1;
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);

    card.play(player);

    expect(player.steel).eq(0);
    expect(player.getProduction(Resources.ENERGY)).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(3);

    expect(player.game.deferredActions.peek()).instanceOf(PlaceMoonRoadTile);
  });
});


import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, setPlayerProductionForTest, TestPlayers} from '../../TestingUtils';
import {SinusIridiumRoadNetwork} from '../../../src/cards/moon/SinusIridiumRoadNetwork';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {PlaceMoonRoadTile} from '../../../src/moon/PlaceMoonRoadTile';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('SinusIridiumRoadNetwork', () => {
  let player: Player;
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
    setPlayerProductionForTest(player, {energy: 1});
    expect(player.getPlayableCards()).does.not.include(card);

    player.steel = 1;
    setPlayerProductionForTest(player, {energy: 0});
    expect(player.getPlayableCards()).does.not.include(card);


    player.steel = 1;
    setPlayerProductionForTest(player, {energy: 1});
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.steel = 2;
    setPlayerProductionForTest(player, {energy: 1});
    player.steel = 1;
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);

    card.play(player);

    expect(player.steel).eq(0);
    expect(player.getProduction(Resources.ENERGY)).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(3);

    expect(player.game.deferredActions.peek()).instanceOf(PlaceMoonRoadTile);
  });
});


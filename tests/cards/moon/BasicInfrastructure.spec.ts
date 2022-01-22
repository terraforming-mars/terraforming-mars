import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {BasicInfrastructure} from '../../../src/cards/moon/BasicInfrastructure';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';
import {PlaceMoonRoadTile} from '../../../src/moon/PlaceMoonRoadTile';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('BasicInfrastructure', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: BasicInfrastructure;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new BasicInfrastructure();
  });

  it('play', () => {
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.logisticRate).eq(0);
    expect(player.getFleetSize()).eq(1);

    card.play(player);
    const placeTileAction = game.deferredActions.peek() as PlaceMoonRoadTile;
    placeTileAction!.execute()!.cb(moonData.moon.spaces[2]);

    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
    expect(player.getFleetSize()).eq(2);
  });
});


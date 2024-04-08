import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {BasicInfrastructure} from '../../../src/server/cards/moon/BasicInfrastructure';
import {PlaceMoonRoadTile} from '../../../src/server/moon/PlaceMoonRoadTile';

describe('BasicInfrastructure', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: BasicInfrastructure;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new BasicInfrastructure();
  });

  it('play', () => {
    expect(player.production.megacredits).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.logisticRate).eq(0);
    expect(player.colonies.getFleetSize()).eq(1);

    card.play(player);
    const placeTileAction = cast(game.deferredActions.peek(), PlaceMoonRoadTile);
    placeTileAction.execute()!.cb(moonData.moon.spaces[2]);

    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
    expect(player.colonies.getFleetSize()).eq(2);
  });
});


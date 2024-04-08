import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {CoreMine} from '../../../src/server/cards/moon/CoreMine';
import {PlaceMoonMineTile} from '../../../src/server/moon/PlaceMoonMineTile';

describe('CoreMine', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: CoreMine;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new CoreMine();
  });

  it('play', () => {
    expect(player.production.titanium).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.miningRate).eq(0);

    card.play(player);
    expect(player.production.titanium).eq(1);
    const placeTileAction = cast(game.deferredActions.peek(), PlaceMoonMineTile);
    placeTileAction.execute()!.cb(moonData.moon.spaces[2]);

    expect(moonData.miningRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });
});


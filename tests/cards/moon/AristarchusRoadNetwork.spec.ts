import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Player} from '../../../src/server/Player';
import {cast, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {AristarchusRoadNetwork} from '../../../src/server/cards/moon/AristarchusRoadNetwork';
import {expect} from 'chai';
import {TileType} from '../../../src/common/TileType';
import {PlaceMoonRoadTile} from '../../../src/server/moon/PlaceMoonRoadTile';

describe('AristarchusRoadNetwork', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: AristarchusRoadNetwork;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    moonData = MoonExpansion.moonData(game);
    card = new AristarchusRoadNetwork();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.steel = 1;
    player.megaCredits = card.cost;
    expect(player.getPlayableCards()).does.not.include(card);
    player.steel = 2;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.steel = 2;
    expect(player.production.megacredits).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.logisticRate).eq(0);

    card.play(player);

    expect(player.steel).eq(0);
    expect(player.production.megacredits).eq(2);

    const deferredAction = cast(game.deferredActions.peek(), PlaceMoonRoadTile);
    const selectSpace = deferredAction.execute()!;
    const roadSpace = selectSpace.availableSpaces[0];
    expect(roadSpace.tile).is.undefined;
    expect(roadSpace.player).is.undefined;
    expect(moonData.logisticRate).eq(0);

    deferredAction.execute()!.cb(roadSpace);
    expect(roadSpace.tile!.tileType).eq(TileType.MOON_ROAD);
    expect(roadSpace.player).eq(player);

    expect(player.getTerraformRating()).eq(15);
    expect(moonData.logisticRate).eq(1);
  });
});


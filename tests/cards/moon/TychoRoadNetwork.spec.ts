import {Game} from '../../../src/server/Game';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {TychoRoadNetwork} from '../../../src/server/cards/moon/TychoRoadNetwork';
import {expect} from 'chai';
import {TileType} from '../../../src/common/TileType';
import {PlaceMoonRoadTile} from '../../../src/server/moon/PlaceMoonRoadTile';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('TychoRoadNetwork', () => {
  let game: Game;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: TychoRoadNetwork;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new TychoRoadNetwork();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.steel = 0;
    player.megaCredits = card.cost;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
    player.steel = 1;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.steel = 1;
    expect(player.production.megacredits).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.logisticRate).eq(0);

    card.play(player);

    expect(player.steel).eq(0);
    expect(player.production.megacredits).eq(1);

    const deferredAction = cast(game.deferredActions.peek(), PlaceMoonRoadTile);
    const selectSpace: SelectSpace = deferredAction.execute()!;
    const roadSpace = selectSpace.spaces[0];
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


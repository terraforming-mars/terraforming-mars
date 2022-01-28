import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {AristarchusRoadNetwork} from '../../../src/cards/moon/AristarchusRoadNetwork';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {PlaceMoonRoadTile} from '../../../src/moon/PlaceMoonRoadTile';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('AristarchusRoadNetwork', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: AristarchusRoadNetwork;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
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
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.logisticRate).eq(0);

    card.play(player);

    expect(player.steel).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(2);

    const deferredAction = game.deferredActions.peek() as PlaceMoonRoadTile;
    const selectSpace = deferredAction.execute()!;
    const roadSpace = selectSpace.availableSpaces[0];
    expect(roadSpace.tile).is.undefined;
    expect(roadSpace.player).is.undefined;
    expect(moonData.logisticRate).eq(0);

    deferredAction!.execute()!.cb(roadSpace);
    expect(roadSpace.tile!.tileType).eq(TileType.MOON_ROAD);
    expect(roadSpace.player).eq(player);

    expect(player.getTerraformRating()).eq(15);
    expect(moonData.logisticRate).eq(1);
  });
});


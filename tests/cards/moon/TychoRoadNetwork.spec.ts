import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TychoRoadNetwork} from '../../../src/cards/moon/TychoRoadNetwork';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {TileType} from '../../../src/TileType';
import {PlaceMoonRoadTile} from '../../../src/moon/PlaceMoonRoadTile';
import {SelectSpace} from '../../../src/inputs/SelectSpace';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('TychoRoadNetwork', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: TychoRoadNetwork;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new TychoRoadNetwork();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.steel = 0;
    player.megaCredits = card.cost;
    expect(player.getPlayableCards()).does.not.include(card);
    player.steel = 1;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.steel = 1;
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.logisticRate).eq(0);

    card.play(player);

    expect(player.steel).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(1);

    const deferredAction = game.deferredActions.peek() as PlaceMoonRoadTile;
    const selectSpace: SelectSpace = deferredAction.execute()!;
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


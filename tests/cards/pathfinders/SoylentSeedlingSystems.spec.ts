import {expect} from 'chai';
import {SoylentSeedlingSystems} from '../../../src/server/cards/pathfinders/SoylentSeedlingSystems';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {fakeCard} from '../../TestingUtils';
import {Tag} from '../../../src/common/cards/Tag';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';
import {GreeneryStandardProject} from '../../../src/server/cards/base/standardProjects/GreeneryStandardProject';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';

describe('SoylentSeedlingSystems', function() {
  let soylent: SoylentSeedlingSystems;
  let celestic: Celestic;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    soylent = new SoylentSeedlingSystems();
    game = newTestGame(2);
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    player.setCorporationForTest(soylent);
    // Giving it a corporation card that stores resources to show it doesn't have any.
    celestic = new Celestic();
    player2.setCorporationForTest(celestic);
  });

  it('on greenery placed', () => {
    expect(soylent.resourceCount).eq(0);
    expect(celestic.resourceCount).eq(0);
    game.addGreenery(player, game.board.getAvailableSpacesForGreenery(player)[0]!.id);
    expect(soylent.resourceCount).eq(1);
    expect(celestic.resourceCount).eq(0);
  });

  it('on greenery placed by other player', () => {
    expect(soylent.resourceCount).eq(0);
    expect(celestic.resourceCount).eq(0);
    game.addGreenery(player2, game.board.getAvailableSpacesForGreenery(player)[0]!.id);
    expect(soylent.resourceCount).eq(0);
    expect(celestic.resourceCount).eq(0);
  });

  it('greenery standard project', () => {
    const greenery = new GreeneryStandardProject();
    expect(greenery.canAct(player)).is.false;

    player.megaCredits = 23;
    expect(greenery.canAct(player)).is.true;

    player.megaCredits = 19;
    expect(greenery.canAct(player)).is.false;

    player.megaCredits = 18;
    expect(greenery.canAct(player)).is.false;

    soylent.resourceCount++;
    expect(greenery.canAct(player)).is.true;

    // Doesn't apply to player2
    player2.megaCredits = 18;
    celestic.resourceCount++;
    expect(greenery.canAct(player2)).is.false;
  });

  it('plant tag', () => {
    const plantCard = fakeCard({name: 'A' as CardName, cost: 10, tags: [Tag.PLANT]});

    player.megaCredits = 10;
    expect(player.canPlay(plantCard)).is.true;

    player.megaCredits = 6;
    expect(player.canPlay(plantCard)).is.false;

    player.megaCredits = 5;
    expect(player.canPlay(plantCard)).is.false;

    soylent.resourceCount++;
    expect(player.canPlay(plantCard)).is.true;
  });

  it('on wetlands placed', () => {
    expect(soylent.resourceCount).eq(0);
    expect(celestic.resourceCount).eq(0);
    player.game.addTile(
      player,
      SpaceType.LAND,
      player.game.board.getAvailableSpacesOnLand(player)[0],
      {tileType: TileType.WETLANDS});
    expect(soylent.resourceCount).eq(1);
    expect(celestic.resourceCount).eq(0);
  });
});

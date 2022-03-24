import {expect} from 'chai';
import {SoylentSeedlingSystems} from '../../../src/cards/pathfinders/SoylentSeedlingSystems';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {TestingUtils} from '../../TestingUtils';
import {Tags} from '../../../src/common/cards/Tags';
import {Celestic} from '../../../src/cards/venusNext/Celestic';
import {GreeneryStandardProject} from '../../../src/cards/base/standardProjects/GreeneryStandardProject';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';

describe('SoylentSeedlingSystems', function() {
  let card: SoylentSeedlingSystems;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new SoylentSeedlingSystems();
    game = newTestGame(2);
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    player.corporationCard = card;
    // Giving it a corporation card that stores resources to show it doesn't have any.
    player2.corporationCard = new Celestic();
  });

  it('on greenery placed', () => {
    expect(player.corporationCard!.resourceCount).eq(0);
    expect(player2.corporationCard!.resourceCount).eq(0);
    game.addGreenery(player, game.board.getAvailableSpacesForGreenery(player)[0]!.id);
    expect(player.corporationCard!.resourceCount).eq(1);
    expect(player2.corporationCard!.resourceCount).eq(0);
  });

  it('on greenery placed by other player', () => {
    expect(player.corporationCard!.resourceCount).eq(0);
    expect(player2.corporationCard!.resourceCount).eq(0);
    game.addGreenery(player2, game.board.getAvailableSpacesForGreenery(player)[0]!.id);
    expect(player.corporationCard!.resourceCount).eq(0);
    expect(player2.corporationCard!.resourceCount).eq(0);
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

    player.corporationCard!.resourceCount++;
    expect(greenery.canAct(player)).is.true;

    // Doesn't apply to player2
    player2.megaCredits = 18;
    player2.corporationCard!.resourceCount++;
    expect(greenery.canAct(player2)).is.false;
  });

  it('plant tag', () => {
    const plantCard = TestingUtils.fakeCard({name: 'A' as CardName, cost: 10, tags: [Tags.PLANT]});

    player.megaCredits = 10;
    expect(player.canPlay(plantCard)).is.true;

    player.megaCredits = 6;
    expect(player.canPlay(plantCard)).is.false;

    player.megaCredits = 5;
    expect(player.canPlay(plantCard)).is.false;

    player.corporationCard!.resourceCount++;
    expect(player.canPlay(plantCard)).is.true;
  });

  it('on wetlands placed', () => {
    expect(player.corporationCard!.resourceCount).eq(0);
    expect(player2.corporationCard!.resourceCount).eq(0);
    player.game.addTile(
      player,
      SpaceType.LAND,
      player.game.board.getAvailableSpacesOnLand(player)[0],
      {tileType: TileType.WETLANDS});
    expect(player.corporationCard!.resourceCount).eq(1);
    expect(player2.corporationCard!.resourceCount).eq(0);
  });
});

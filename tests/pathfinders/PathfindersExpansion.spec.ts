import {expect} from 'chai';
import {TestPlayer} from '../TestPlayer';
import {getTestPlayer, newTestGame} from '../TestGame';
import {PathfindersExpansion} from '../../src/pathfinders/PathfindersExpansion';
import {Tags} from '../../src/common/cards/Tags';
import {TestingUtils} from '../TestingUtils';
import {ResourceType} from '../../src/common/ResourceType';
import {Game} from '../../src/Game';
import {IPathfindersData} from '../../src/pathfinders/IPathfindersData';
import {CardName} from '../../src/common/cards/CardName';

describe('PathfindersExpansion', function() {
  let player1: TestPlayer;
  let player2: TestPlayer;
  let game: Game;
  let pathfindersData: IPathfindersData;

  beforeEach(() => {
    game = newTestGame(2, {
      venusNextExtension: true,
      pathfindersExpansion: true,
      moonExpansion: true,
    });
    pathfindersData = game.pathfindersData!;
    player1 = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
  });

  it('Earth track', () => {
    PathfindersExpansion.raiseTrack(Tags.EARTH, player1, 3);
    TestingUtils.runAllActions(game);

    expect(pathfindersData.earth).eq(3);
    expect(player1.plants).eq(2);
    expect(player2.plants).eq(1);

    expect(player1.megaCredits).eq(0);
    expect(player2.megaCredits).eq(0);

    PathfindersExpansion.raiseTrack(Tags.EARTH, player1, 3);
    TestingUtils.runAllActions(game);

    expect(pathfindersData.earth).eq(6);
    expect(player1.megaCredits).eq(3);
    expect(player2.megaCredits).eq(3);
  });

  it('Venus track', () => {
    const floaterCard = TestingUtils.fakeCard({
      resourceType: ResourceType.FLOATER,
    });
    const floaterCard2 = TestingUtils.fakeCard({
      resourceType: ResourceType.FLOATER,
    });
    player1.playedCards.push(floaterCard);
    player2.playedCards.push(floaterCard2);

    PathfindersExpansion.raiseTrack(Tags.VENUS, player1, 3);
    TestingUtils.runAllActions(game);

    expect(pathfindersData.venus).eq(3);
    expect(player1.heat).eq(2);
    expect(player2.heat).eq(1);
    expect(floaterCard.resourceCount).eq(1);
    expect(floaterCard2.resourceCount).eq(0);
  });

  it('Most tags', () => {
    // venus 17 has 2VP for the player with the most tags, and 1 TR for the rising player.
    pathfindersData.venus = 16;

    player1.tagsForTest = {venus: 4};
    player2.tagsForTest = {venus: 3};

    expect(player1.getTerraformRating()).eq(20);
    expect(player2.getTerraformRating()).eq(20);

    PathfindersExpansion.raiseTrack(Tags.VENUS, player2, 1);

    // Player 2 gets the terraformiing bump
    expect(player1.getTerraformRating()).eq(20);
    expect(player2.getTerraformRating()).eq(21);

    // Player 1 gets the 2VP.
    expect(player1.getVictoryPoints().total).eq(22);
    expect(player2.getVictoryPoints().total).eq(21);
  });

  it('tags played after maximum have no effect', () => {
    pathfindersData.jovian = 13;
    PathfindersExpansion.raiseTrack(Tags.JOVIAN, player1, 3);
    expect(pathfindersData.jovian).eq(14);
  });

  it('played card', () => {
    expect(pathfindersData.earth).eq(0);
    player1.playCard(TestingUtils.fakeCard({name: 'A' as CardName, tags: [Tags.EARTH]}));
    expect(pathfindersData.earth).eq(1);
  });
  // TODO(kberg): not all rewards are tested.
});

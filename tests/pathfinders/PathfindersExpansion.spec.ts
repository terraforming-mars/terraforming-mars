import {expect} from 'chai';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {PathfindersExpansion} from '../../src/server/pathfinders/PathfindersExpansion';
import {Tag} from '../../src/common/cards/Tag';
import {cast, fakeCard, runAllActions} from '../TestingUtils';
import {CardResource} from '../../src/common/CardResource';
import {Game} from '../../src/server/Game';
import {PathfindersData} from '../../src/server/pathfinders/PathfindersData';
import {CardName} from '../../src/common/cards/CardName';
import {SelectPartyToSendDelegate} from '../../src/server/inputs/SelectPartyToSendDelegate';
import {Turmoil} from '../../src/server/turmoil/Turmoil';

describe('PathfindersExpansion', function() {
  let player1: TestPlayer;
  let player2: TestPlayer;
  let game: Game;
  let pathfindersData: PathfindersData;

  beforeEach(() => {
    [game, player1, player2] = testGame(2, {
      venusNextExtension: true,
      pathfindersExpansion: true,
      moonExpansion: true,
      turmoilExtension: true,
    });
    pathfindersData = game.pathfindersData!;
  });

  it('Earth track', () => {
    PathfindersExpansion.raiseTrack(Tag.EARTH, player1, 3);
    runAllActions(game);

    expect(pathfindersData.earth).eq(3);
    expect(player1.plants).eq(2);
    expect(player2.plants).eq(1);

    expect(player1.megaCredits).eq(0);
    expect(player2.megaCredits).eq(0);

    PathfindersExpansion.raiseTrack(Tag.EARTH, player1, 3);
    runAllActions(game);

    expect(pathfindersData.earth).eq(6);
    expect(player1.megaCredits).eq(3);
    expect(player2.megaCredits).eq(3);
  });

  it('Venus track', () => {
    const floaterCard = fakeCard({
      resourceType: CardResource.FLOATER,
    });
    const floaterCard2 = fakeCard({
      resourceType: CardResource.FLOATER,
    });
    player1.playedCards.push(floaterCard);
    player2.playedCards.push(floaterCard2);

    PathfindersExpansion.raiseTrack(Tag.VENUS, player1, 3);
    runAllActions(game);

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

    PathfindersExpansion.raiseTrack(Tag.VENUS, player2, 1);

    // Player 2 gets the terraformiing bump
    expect(player1.getTerraformRating()).eq(20);
    expect(player2.getTerraformRating()).eq(21);

    // Player 1 gets the 2VP.
    expect(player1.getVictoryPoints().total).eq(22);
    expect(player2.getVictoryPoints().total).eq(21);
  });

  it('tags played after maximum have no effect', () => {
    pathfindersData.jovian = 13;
    PathfindersExpansion.raiseTrack(Tag.JOVIAN, player1, 3);
    expect(pathfindersData.jovian).eq(14);
  });

  it('played card', () => {
    expect(pathfindersData.earth).eq(0);
    player1.playCard(fakeCard({name: 'A' as CardName, tags: [Tag.EARTH]}));
    expect(pathfindersData.earth).eq(1);
  });

  it('grant delegate reward', () => {
    PathfindersExpansion.grant('delegate', player1, Tag.EARTH);
    runAllActions(game);
    cast(player1.popWaitingFor(), SelectPartyToSendDelegate);
  });

  it('grant delegate reward - no grant when player has no available delegates', () => {
    const turmoil = Turmoil.getTurmoil(game);
    turmoil.delegateReserve.clear();
    PathfindersExpansion.grant('delegate', player1, Tag.EARTH);
    runAllActions(game);
    expect(player1.popWaitingFor()).is.undefined;
  });

  // TODO(kberg): not all rewards are tested.
});

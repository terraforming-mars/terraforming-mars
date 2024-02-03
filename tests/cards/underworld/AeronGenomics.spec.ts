import {AeronGenomics} from '../../../src/server/cards/underworld/AeronGenomics';
import {Birds} from '../../../src/server/cards/base/Birds';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {runAllActions} from '../../TestingUtils';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';

describe('AeronGenomics', function() {
  let card: AeronGenomics;
  let player: TestPlayer;
  let game: Game;
  let animalHost: IProjectCard;

  beforeEach(function() {
    animalHost = new Birds();
    card = new AeronGenomics();
    [game, player] = testGame(2, {underworldExpansion: true});
  });

  it('Play', () => {
    expect(card.resourceCount).eq(0);
    card.play(player);
    runAllActions(game);
    expect(card.resourceCount).eq(1);
    expect(player.steel).eq(5);
  });

  it('onExcavate', () => {
    player.setCorporationForTest(card);
    card.resourceCount = 0;
    const spaces = UnderworldExpansion.excavatableSpaces(player);
    spaces[0].undergroundResources = 'nothing';
    UnderworldExpansion.excavate(player, spaces[0]);

    expect(card.resourceCount).eq(1);
  });

  it('Can not move animal if card has no resources', () => {
    card.play(player);
    player.playCard(animalHost);
    card.resourceCount = 0;
    expect(card.canAct(player)).is.false;
  });

  it('Can not move animal if there is no other animal card', () => {
    card.play(player);
    expect(card.canAct(player)).is.false;
  });

  // Matches Bioengineering Enclosure test.
  it('Move animal', () => {
    // Set up the cards.
    player.playCard(animalHost);
    player.playCard(card);
    runAllActions(game);

    // Initial expectations that will change after playing the card.
    expect(card.canAct(player)).is.true;
    expect(card.resourceCount).eq(1);
    expect(animalHost.resourceCount).eq(0);
    expect(game.deferredActions).has.lengthOf(0);

    card.action(player);

    game.deferredActions.peek()!.execute();

    expect(card.resourceCount).eq(0);
    expect(animalHost.resourceCount).eq(1);
  });
});

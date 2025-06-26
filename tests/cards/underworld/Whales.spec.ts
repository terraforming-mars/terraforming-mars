import {expect} from 'chai';
import {Whales} from '../../../src/server/cards/underworld/Whales';
import {testGame} from '../../TestGame';
import {addOcean, cast, maxOutOceans, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {AquiferStandardProject} from '../../../src/server/cards/base/standardProjects/AquiferStandardProject';
import {IGame} from '../../../src/server/IGame';
import {Flooding} from '../../../src/server/cards/base/Flooding';
import {IcyImpactors} from '../../../src/server/cards/promo/IcyImpactors';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';

describe('Whales', () => {
  let card: Whales;
  let game: IGame;
  let player: TestPlayer;
  let otherPlayer: TestPlayer;

  beforeEach(() => {
    card = new Whales();
    [game, player, otherPlayer] = testGame(2, {underworldExpansion: true});
  });

  it('canPlay', () => {
    maxOutOceans(otherPlayer, 5);

    expect(card.canPlay(player)).is.false;

    maxOutOceans(otherPlayer, 6);

    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const card = new Whales();
    const [/* game */, player] = testGame(2);
    cast(card.play(player), undefined);
  });

  it('no effect when adding oceans', () => {
    player.playedCards.push(card);
    addOcean(otherPlayer);
    expect(card.resourceCount).eq(0);
    addOcean(otherPlayer);
    expect(card.resourceCount).eq(0);
    maxOutOceans(otherPlayer);
    expect(card.resourceCount).eq(0);
  });

  it('effect - aquifer standard project', () => {
    player.playedCards.push(card);
    maxOutOceans(otherPlayer);
    const aquiferStandardProject = new AquiferStandardProject();
    player.megaCredits = aquiferStandardProject.cost;

    expect(game.board.getOceanSpaces()).has.length(9);
    expect(game.canAddOcean()).is.false;
    expect(aquiferStandardProject.canPlay(player)).is.true;

    cast(aquiferStandardProject.action(player), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(game.board.getOceanSpaces()).has.length(9);
    expect(player.megaCredits).eq(0);
    expect(card.resourceCount).eq(1);
  });

  it('effect - Flooding', () => {
    player.playedCards.push(card);
    maxOutOceans(otherPlayer);
    const flooding = new Flooding();

    expect(game.board.getOceanSpaces()).has.length(9);
    expect(game.canAddOcean()).is.false;
    expect(flooding.canPlay(player)).is.true;

    cast(flooding.play(player), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(game.board.getOceanSpaces()).has.length(9);
    expect(card.resourceCount).eq(1);
  });

  // This special test case is written because Icy Impactors is still custom code.
  it('effect - Icy Impactors', () => {
    player.playedCards.push(card);
    maxOutOceans(otherPlayer);
    const icyImpactors = new IcyImpactors();
    icyImpactors.resourceCount = 1;

    expect(game.board.getOceanSpaces()).has.length(9);
    expect(game.canAddOcean()).is.false;
    expect(icyImpactors.canAct(player)).is.true;

    cast(icyImpactors.action(player), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(game.board.getOceanSpaces()).has.length(9);
    expect(card.resourceCount).eq(1);
  });

  // This special test case is written because Excavation has custom code.
  it('effect - excavation', () => {
    player.playedCards.push(card);
    const space = UnderworldExpansion.identifiableSpaces(player)[0];
    space.undergroundResources = 'ocean';
    maxOutOceans(otherPlayer);
    player.megaCredits = 10;

    expect(UnderworldExpansion.excavatableSpaces(player)).contains(space);

    UnderworldExpansion.excavate(player, space);
    runAllActions(game);

    expect(player.megaCredits).eq(6);
    expect(game.board.getOceanSpaces()).has.length(9);
    expect(card.resourceCount).eq(1);
  });
});

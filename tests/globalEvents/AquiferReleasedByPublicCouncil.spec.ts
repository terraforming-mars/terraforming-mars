import {expect} from 'chai';
import {AquiferReleasedByPublicCouncil} from '../../src/server/turmoil/globalEvents/AquiferReleasedByPublicCouncil';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {maxOutOceans, runAllActions, testGame} from '../TestingUtils';
import {Whales} from '../../src/server/cards/underworld/Whales';
import {IGame} from '../../src/server/IGame';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('AquiferReleasedByPublicCouncil', () => {
  let card: AquiferReleasedByPublicCouncil;
  let player: TestPlayer;
  let opponent: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new AquiferReleasedByPublicCouncil();
    [game, player, opponent] = testGame(2, {turmoilExtension: true});
    turmoil = game.turmoil!;
  });

  it('resolve play', () => {
    turmoil.chairman = opponent;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = opponent;
    turmoil.dominantParty.delegates.add(player);
    turmoil.dominantParty.delegates.add(opponent);
    turmoil.dominantParty.delegates.add(opponent);

    card.resolve(game, turmoil);
    expect(player.steel).to.eq(1);
    expect(opponent.steel).to.eq(3);
    expect(player.plants).to.eq(1);
    expect(opponent.plants).to.eq(3);
  });

  it('Compatible with Whales', () => {
    const card = new AquiferReleasedByPublicCouncil();
    const [game, player, opponent] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    const whales = new Whales();
    player.playedCards.push(whales);

    maxOutOceans(opponent);
    card.resolve(game, turmoil);

    runAllActions(game);

    expect(player.game.deferredActions).has.lengthOf(0);
    expect(whales.resourceCount).eq(1);
  });

  it('Compatible with Whales when you are not the starting player', () => {
    game.incrementFirstPlayer();
    expect(game.first).eq(opponent);

    const whales = new Whales();
    player.playedCards.push(whales);
    maxOutOceans(opponent);

    card.resolve(game, turmoil);
    runAllActions(game);

    expect(player.game.deferredActions).has.lengthOf(0);
    expect(whales.resourceCount).eq(0);
  });
});

import {expect} from 'chai';
import {AquiferTurbines} from '../../../src/server/cards/prelude/AquiferTurbines';
import {Polaris} from '../../../src/server/cards/pathfinders/Polaris';
import {Manutech} from '../../../src/server/cards/venusNext/Manutech';
import {LakefrontResorts} from '../../../src/server/cards/turmoil/LakefrontResorts';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {addOcean, maxOutOceans, runAllActions, setRulingParty, testGame} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast} from '../../../src/common/utils/utils';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('AquiferTurbines', () => {
  let card: AquiferTurbines;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new AquiferTurbines();
    [game, player] = testGame(1, {turmoilExtension: true});
  });

  it('Can not play', () => {
    player.megaCredits = 2;
    expect(card.canPlay(player)).is.false;
  });

  it('Can play', () => {
    player.megaCredits = 3;
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    player.megaCredits = 3;
    card.play(player);
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    runAllActions(game);

    expect(player.production.energy).to.eq(2);
    expect(player.megaCredits).to.eq(0);
  });

  it('Polaris pays for the card', () => {
    player.playedCards.push(new Polaris());
    player.megaCredits = 2;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    runAllActions(game);

    expect(player.production.energy).to.eq(2);
    expect(player.megaCredits).to.eq(3);
  });

  it('Polaris and Manutech pay for the card', () => {
    player.playedCards.push(new Polaris(), new Manutech());
    player.megaCredits = 1;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    runAllActions(game);

    expect(player.megaCredits).to.eq(3);
  });

  it('Ocean adjacency pays for the card', () => {
    const ocean = addOcean(player, '06');
    player.megaCredits = 1;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const adjacentSpaces = game.board.getAvailableSpacesForOcean(player)
      .filter((space) => game.board.getAdjacentSpaces(space).includes(ocean));
    expect(adjacentSpaces).is.not.empty;
    expect(selectSpace.spaces).to.have.members(adjacentSpaces);

    selectSpace.cb(selectSpace.spaces[0]);
    runAllActions(game);

    expect(player.megaCredits).to.eq(0);
  });

  it('Lakefront Resorts and Manutech pay for the card', () => {
    player.playedCards.push(new LakefrontResorts(), new Manutech());
    player.megaCredits = 2;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    runAllActions(game);

    expect(player.megaCredits).to.eq(0);
  });

  it('Lakefront Resorts ocean adjacency pays for the card', () => {
    const lakefrontResorts = new LakefrontResorts();
    player.playedCards.push(lakefrontResorts);
    lakefrontResorts.play(player);
    const ocean = addOcean(player, '06');
    player.megaCredits = 0;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    const adjacentSpaces = game.board.getAvailableSpacesForOcean(player)
      .filter((space) => game.board.getAdjacentSpaces(space).includes(ocean));
    expect(selectSpace.spaces).to.have.members(adjacentSpaces);

    selectSpace.cb(selectSpace.spaces[0]);
    runAllActions(game);

    expect(player.megaCredits).to.eq(0);
  });

  it('Polaris does not pay when oceans are maxed out', () => {
    player.playedCards.push(new Polaris());
    maxOutOceans(player);
    runAllActions(game);
    player.megaCredits = 2;
    expect(card.canPlay(player)).is.false;

    player.megaCredits = 3;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);

    expect(player.production.energy).to.eq(2);
    expect(player.megaCredits).to.eq(0);
  });

  it('Reds', () => {
    setRulingParty(game, PartyName.REDS);

    player.megaCredits = 5;
    expect(card.canPlay(player)).is.false;

    player.megaCredits = 6;
    expect(card.canPlay(player)).is.true;
  });

  it('Reds with Polaris', () => {
    setRulingParty(game, PartyName.REDS);
    player.playedCards.push(new Polaris());

    // Reds is paid before Polaris's 4 M€ arrives.
    player.megaCredits = 2;
    expect(card.canPlay(player)).is.false;

    player.megaCredits = 3;
    expect(card.canPlay(player)).is.true;

    const tr = player.terraformRating;
    card.play(player);
    runAllActions(game);

    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    runAllActions(game);

    expect(player.terraformRating).to.eq(tr + 1);
    expect(player.megaCredits).to.eq(1);
  });
});

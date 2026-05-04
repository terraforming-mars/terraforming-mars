import {expect} from 'chai';
import {ImmigrantCity} from '../../../src/server/cards/base/ImmigrantCity';
import {TharsisRepublic} from '../../../src/server/cards/corporation/TharsisRepublic';
import {IGame} from '../../../src/server/IGame';
import {Resource} from '../../../src/common/Resource';
import {cast, churn, runAllActions, runNextAction} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';
import {BoardName} from '../../../src/common/boards/BoardName';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';

describe('ImmigrantCity', () => {
  let card: ImmigrantCity;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ImmigrantCity();
    [game, player] = testGame(2);
  });

  it('Can not play without energy production', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    player.production.add(Resource.ENERGY, 1);
    const selectSpace = cast(churn(card.play(player), player), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    runAllActions(game);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(-2);
    player.playedCards.push(card);

    game.addCity(player, game.board.getAvailableSpacesOnLand(player)[0]);
    runNextAction(game);
    expect(player.production.megacredits).to.eq(-1);
  });

  it('Can play at -4 M€ production', () => {
    player.production.add(Resource.ENERGY, 1);
    player.production.add(Resource.MEGACREDITS, -4);
    expect(card.canPlay(player)).is.true;

    const selectSpace = cast(churn(card.play(player), player), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    runAllActions(game);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(-5);
    player.playedCards.push(card);

    // add another city tile
    game.addCity(player, game.board.getAvailableSpacesOnLand(player)[0]);
    runNextAction(game);
    expect(player.production.megacredits).to.eq(-4);
  });

  it('Cannot play with 0 energy on Tharsis (no energy production space)', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play with 0 energy on Arabia Terra when energy production space is available', () => {
    const [game2, player2] = testGame(2, {boardName: BoardName.ARABIA_TERRA});
    const card2 = new ImmigrantCity();

    // energy = 0, MC production = 0 (satisfies -4 requirement)
    expect(card2.canPlay(player2)).is.true;

    // Only energy-production spaces should be offered
    const selectSpace = cast(churn(card2.play(player2), player2), SelectSpace);
    expect(selectSpace.spaces.every((s) => s.bonus.includes(SpaceBonus.ENERGY_PRODUCTION))).is.true;

    selectSpace.cb(selectSpace.spaces[0]);
    runAllActions(game2);

    // Net: +1 from space, -1 from card = 0
    expect(player2.production.energy).to.eq(0);
    expect(player2.production.megacredits).to.eq(-2);
  });

  it('Tharsis can play at -5 M€ production', () => {
    player.playedCards.push(new TharsisRepublic());
    player.production.add(Resource.ENERGY, 1);
    player.production.add(Resource.MEGACREDITS, -5);
    expect(card.canPlay(player)).is.true;

    const selectSpace = cast(churn(card.play(player), player), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    runAllActions(game);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(-5); // should not increase
    player.playedCards.push(card);

    // add another city tile - MC prod should increase by 2 (1 from Tharsis, 1 from IC)
    game.addCity(player, game.board.getAvailableSpacesOnLand(player)[0]);
    runAllActions(game);
    expect(player.production.megacredits).to.eq(-3);
  });
});

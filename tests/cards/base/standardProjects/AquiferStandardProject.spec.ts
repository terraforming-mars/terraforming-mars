import {expect} from 'chai';
import {cast, churn, runAllActions, testRedsCosts} from '../../../TestingUtils';
import {AquiferStandardProject} from '../../../../src/server/cards/base/standardProjects/AquiferStandardProject';
import {maxOutOceans} from '../../../TestingUtils';
import {TestPlayer} from '../../../TestPlayer';
import {IGame} from '../../../../src/server/IGame';
import {testGame} from '../../../TestGame';
import {assertPlaceOcean} from '../../../assertions';

describe('AquiferStandardProject', () => {
  let card: AquiferStandardProject;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new AquiferStandardProject();
    [game, player] = testGame(1);
  });

  it('Can act', () => {
    player.megaCredits = card.cost - 1;
    expect(card.canAct(player)).is.false;
    player.megaCredits = card.cost;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    player.megaCredits = card.cost;
    player.setTerraformRating(20);
    expect(game.board.getOceanSpaces()).is.empty;

    assertPlaceOcean(player, churn(card.action(player), player));

    expect(player.getTerraformRating()).eq(21);
    expect(game.board.getOceanSpaces()).has.length(1);
  });

  it('Paying when the global parameter is at its goal is a valid stall action', () => {
    player.megaCredits = 18;
    expect(card.canAct(player)).eq(true);

    maxOutOceans(player);

    player.megaCredits = 18;
    expect(player.getTerraformRating()).eq(23);
    expect(card.canAct(player)).eq(true);

    cast(card.action(player), undefined);
    runAllActions(game);

    expect(game.board.getOceanSpaces()).has.length(9);
    expect(player.getTerraformRating()).eq(23);
    expect(player.megaCredits).eq(0);
  });

  it('Test reds', () => {
    [game, player] = testGame(1, {turmoilExtension: true});
    testRedsCosts(() => card.canAct(player), player, card.cost, 3);
    maxOutOceans(player);
    testRedsCosts(() => card.canAct(player), player, card.cost, 0);
  });
});

import {expect} from 'chai';
import {EstablishedMethods} from '../../../src/server/cards/promo/EstablishedMethods';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {SelectStandardProjectToPlay} from '../../../src/server/inputs/SelectStandardProjectToPlay';
import {CardName} from '../../../src/common/cards/CardName';
import {assertPlaceGreenery, assertSelectStandardProject} from '../../assertions';
import {cast, toName} from '../../../src/common/utils/utils';

describe('EstablishedMethods', () => {
  let card: EstablishedMethods;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new EstablishedMethods();
    [game, player] = testGame(2);
  });

  it('gains 30 M€', () => {
    player.megaCredits = 0;
    card.play(player);
    expect(player.megaCredits).to.be.at.least(30);
  });

  it('play - first standard project offered when affordable', () => {
    cast(card.play(player), undefined);
    runAllActions(game);

    const selectInput = cast(player.popWaitingFor(), SelectStandardProjectToPlay);
    expect(selectInput.cards.map(toName)).to.have.members([
      CardName.POWER_PLANT_STANDARD_PROJECT,
      CardName.ASTEROID_STANDARD_PROJECT,
      CardName.AQUIFER_STANDARD_PROJECT,
      CardName.GREENERY_STANDARD_PROJECT,
      CardName.CITY_STANDARD_PROJECT,
    ]);
  });

  it('Standard behavior', () => {
    card.play(player);
    runAllActions(game);
    assertSelectStandardProject(player.popWaitingFor(), player, CardName.POWER_PLANT_STANDARD_PROJECT);
    runAllActions(game);

    expect(player.megaCredits).eq(19);
    expect(player.production.energy).eq(1);

    assertSelectStandardProject(player.popWaitingFor(), player, CardName.POWER_PLANT_STANDARD_PROJECT);
    runAllActions(game);

    expect(player.megaCredits).eq(8);
    expect(player.production.energy).eq(2);

    cast(player.popWaitingFor(), undefined);
  });

  it('penalty when cannot afford second project', () => {
    card.play(player);
    runAllActions(game);
    assertSelectStandardProject(player.popWaitingFor(), player, CardName.GREENERY_STANDARD_PROJECT);
    runAllActions(game);
    assertPlaceGreenery(player, player.popWaitingFor());
    runAllActions(game);

    cast(player.popWaitingFor(), undefined);
    expect(player.megaCredits).eq(0);
  });
});

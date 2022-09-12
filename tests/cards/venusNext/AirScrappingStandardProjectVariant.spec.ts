import {expect} from 'chai';
import {CardName} from '../../../src/common/cards/CardName';
import {AirScrappingStandardProjectVariant} from '../../../src/server/cards/venusNext/AirScrappingStandardProjectVariant';
import {runAllActions, testGameOptions} from '../../TestingUtils';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('AirScrappingStandardProjectVariant', function() {
  let card: AirScrappingStandardProjectVariant;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AirScrappingStandardProjectVariant();
    game = newTestGame(1, testGameOptions({venusNextExtension: true, altVenusBoard: true}));
    player = getTestPlayer(game, 0);
  });

  it('option not available for regular board', function() {
    // Building another game without the alt venus board.
    const game = newTestGame(1);
    const player = getTestPlayer(game, 0);
    Game.newInstance('gameid', [player], player, testGameOptions({venusNextExtension: true, altVenusBoard: false}));
    const cards = player.getStandardProjectOption().cards;
    const names = cards.map((card) => card.name);
    expect(names).to.include(CardName.AIR_SCRAPPING_STANDARD_PROJECT);
    expect(names).to.not.include(CardName.AIR_SCRAPPING_STANDARD_PROJECT_VARIANT);
  });

  it('option available for alt venus board', async function() {
    const cards = player.getStandardProjectOption().cards;
    const names: Array<CardName> = cards.map((card) => card.name);
    expect(names).to.include(CardName.AIR_SCRAPPING_STANDARD_PROJECT_VARIANT);
    expect(names).to.not.include(CardName.AIR_SCRAPPING_STANDARD_PROJECT);
  });

  it('Can act', function() {
    player.megaCredits = 14;
    expect(card.canAct(player)).is.false;
    player.megaCredits = 15;
    expect(card.canAct(player)).is.true;
  });

  it('Can act with Venus tags', function() {
    player.megaCredits = 14;
    expect(card.canAct(player)).is.false;
    player.tagsForTest = {venus: 1};
    expect(card.canAct(player)).is.true;

    player.megaCredits = 13;
    expect(card.canAct(player)).is.false;
    player.tagsForTest = {venus: 2};
    expect(card.canAct(player)).is.true;

    player.megaCredits = 12;
    expect(card.canAct(player)).is.false;
    player.tagsForTest = {venus: 3};
    expect(card.canAct(player)).is.true;

    player.megaCredits = 11;
    expect(card.canAct(player)).is.false;
    player.tagsForTest = {venus: 4};
    expect(card.canAct(player)).is.true;

    player.megaCredits = 10;
    expect(card.canAct(player)).is.false;
    player.tagsForTest = {venus: 5};
    expect(card.canAct(player)).is.true;

    player.megaCredits = 9;
    player.tagsForTest = {venus: 6};
    expect(card.canAct(player)).is.false;
  });

  it('action', function() {
    player.megaCredits = 15;
    player.tagsForTest = {venus: 3};
    player.setTerraformRating(20);
    expect(game.getVenusScaleLevel()).eq(0);

    card.action(player);
    runAllActions(game);

    expect(player.megaCredits).eq(3);
    expect(player.getTerraformRating()).eq(21);
    expect(game.getVenusScaleLevel()).eq(2);
  });

  it('action - max discount 5', function() {
    player.megaCredits = 15;
    player.tagsForTest = {venus: 6};
    player.setTerraformRating(20);
    expect(game.getVenusScaleLevel()).eq(0);

    card.action(player);
    runAllActions(game);

    expect(player.megaCredits).eq(5);
    expect(player.getTerraformRating()).eq(21);
    expect(game.getVenusScaleLevel()).eq(2);
  });
});

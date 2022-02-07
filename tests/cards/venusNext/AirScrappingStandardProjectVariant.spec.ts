import {expect} from 'chai';
import {CardName} from '../../../src/common/cards/CardName';
import {AirScrappingStandardProjectVariant} from '../../../src/cards/venusNext/AirScrappingStandardProjectVariant';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('AirScrappingStandardProjectVariant', function() {
  let card: AirScrappingStandardProjectVariant;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AirScrappingStandardProjectVariant();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({altVenusBoard: true}));
  });

  it('option not available for regular board', function() {
    // Building another game without the alt venus board.
    const player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({altVenusBoard: false}));
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
    TestingUtils.runAllActions(game);

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
    TestingUtils.runAllActions(game);

    expect(player.megaCredits).eq(5);
    expect(player.getTerraformRating()).eq(21);
    expect(game.getVenusScaleLevel()).eq(2);
  });
});

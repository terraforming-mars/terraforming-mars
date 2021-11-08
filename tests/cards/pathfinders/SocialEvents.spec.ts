import {expect} from 'chai';
import {SocialEvents} from '../../../src/cards/pathfinders/SocialEvents';
import {Game} from '../../../src/Game';
import {Phase} from '../../../src/Phase';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {Greens} from '../../../src/turmoil/parties/Greens';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {TestingUtils} from '../../TestingUtils';

// This card is only difficult when Reds are in power, so these tests set up for that.

describe('SocialEvents', function() {
  let card: SocialEvents;
  let player: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new SocialEvents();
    game = newTestGame(1, {turmoilExtension: true});
    player = getTestPlayer(game, 0);
    turmoil = Turmoil.getTurmoil(game);
    turmoil.rulingParty = new Greens();
    game.phase = Phase.ACTION;
  });

  it('canPlay', function() {
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;
    player.tagsForTest = {mars: 3};
    expect(player.canPlay(card)).is.true;
  });

  it('canPlay - Reds', function() {
    turmoil.rulingParty = new Reds();
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.true;
    player.tagsForTest = {mars: 3};
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 5;
    expect(player.canPlay(card)).is.false;
    player.megaCredits = card.cost + 6;
    expect(player.canPlay(card)).is.true;
  });

  it('play', function() {
    expect(player.getTerraformRating()).eq(14);

    player.tagsForTest = {mars: 0};
    card.play(player);
    expect(player.getTerraformRating()).eq(14);

    player.tagsForTest = {mars: 1};
    card.play(player);
    expect(player.getTerraformRating()).eq(15);

    player.tagsForTest = {mars: 3};
    card.play(player);
    expect(player.getTerraformRating()).eq(17);
  });

  it('play - reds', function() {
    turmoil.rulingParty = new Reds();
    expect(player.getTerraformRating()).eq(14);

    player.megaCredits = 10;
    player.tagsForTest = {mars: 0};
    card.play(player);
    TestingUtils.runAllActions(game);
    expect(player.getTerraformRating()).eq(14);
    expect(player.megaCredits).eq(10);

    player.tagsForTest = {mars: 1};
    card.play(player);
    TestingUtils.runAllActions(game);
    expect(player.getTerraformRating()).eq(15);
    expect(player.megaCredits).eq(7); // -3 MC

    player.tagsForTest = {mars: 3};
    card.play(player);
    TestingUtils.runAllActions(game);
    expect(player.getTerraformRating()).eq(17);
    expect(player.megaCredits).eq(1); // -6 MC
  });
});

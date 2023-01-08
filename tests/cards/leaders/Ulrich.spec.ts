import {expect} from 'chai';
import {Ulrich} from '../../../src/server/cards/leaders/Ulrich';
import {Game} from '../../../src/server/Game';
import {forceGenerationEnd, maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';


describe('Ulrich', function() {
  let card: Ulrich;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new Ulrich();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
  });

  it('Can act', function() {
    expect(card.canAct()).is.true;
  });

  it('Takes action: Some oceans placed', function() {
    maxOutOceans(player2, 8);
    card.action(player);
    expect(player.megaCredits).eq(32);
  });

  it('Takes action: All oceans placed - gain only 15 M€', function() {
    maxOutOceans(player2);
    card.action(player);
    expect(player.megaCredits).eq(15);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct()).is.false;
  });
});

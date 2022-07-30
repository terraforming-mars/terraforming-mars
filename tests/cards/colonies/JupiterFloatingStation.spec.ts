import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {JupiterFloatingStation} from '../../../src/cards/colonies/JupiterFloatingStation';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayer} from '../../TestPlayer';

describe('JupiterFloatingStation', function() {
  let card: JupiterFloatingStation;
  let player: Player;

  beforeEach(function() {
    card = new JupiterFloatingStation();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct()).is.true;

    player.addResourceTo(card, 7);
    const orOptions = cast(card.action(player), OrOptions);
    orOptions.options[1].cb();
    expect(player.megaCredits).to.eq(4);
  });
});

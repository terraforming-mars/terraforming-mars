import {expect} from 'chai';
import {JupiterFloatingStation} from '../../../src/cards/colonies/JupiterFloatingStation';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('JupiterFloatingStation', function() {
  let card : JupiterFloatingStation; let player : Player;

  beforeEach(function() {
    card = new JupiterFloatingStation();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Should act', function() {
    player.playedCards.push(card);
    expect(card.canAct()).is.true;

    player.addResourceTo(card, 7);
    const orOptions = card.action(player) as OrOptions;
    expect(orOptions instanceof OrOptions).is.true;
        orOptions!.options[1].cb();
        expect(player.megaCredits).to.eq(4);
  });
});

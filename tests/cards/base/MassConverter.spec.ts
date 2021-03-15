import {expect} from 'chai';
import {MassConverter} from '../../../src/cards/base/MassConverter';
import {TollStation} from '../../../src/cards/base/TollStation';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('MassConverter', function() {
  let card : MassConverter; let player : Player;

  beforeEach(function() {
    card = new MassConverter();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.playedCards.push(card, card, card, card, card);
    expect(card.canPlay(player)).is.true;
    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).to.eq(6);
    expect(card.getCardDiscount(player, card)).to.eq(0);
    expect(card.getCardDiscount(player, new TollStation())).to.eq(2);
  });
});

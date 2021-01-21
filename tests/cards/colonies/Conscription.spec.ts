import {expect} from 'chai';
import {MicroMills} from '../../../src/cards/base/MicroMills';
import {Conscription} from '../../../src/cards/colonies/Conscription';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('Conscription', function() {
  let card: Conscription;
  let player: Player;

  beforeEach(() => {
    card = new Conscription();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player, TestPlayers.RED.newPlayer()], player);
  });

  it('play', () => {
    const action = card.play();
    expect(action).is.undefined;
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-1);
    expect(card.getCardDiscount(player)).to.eq(0);
  });

  it('Should apply card discount until next card played', () => {
    player.playCard(card);
    expect(card.getCardDiscount(player)).to.eq(16);

    player.playCard(new MicroMills());

    expect(card.getCardDiscount(player)).to.eq(0);
  });

  it('Change in generation disables Indentured Workers', () => {
    player.playCard(card);
    expect(card.getCardDiscount(player)).to.eq(16);

    player.pass();

    expect(card.getCardDiscount(player)).to.eq(0);
  });
});

import {expect} from 'chai';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {Conscription} from '../../../src/server/cards/colonies/Conscription';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('Conscription', function() {
  let card: Conscription;
  let player: TestPlayer;

  beforeEach(() => {
    card = new Conscription();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player, TestPlayer.RED.newPlayer()], player);
  });

  it('play', () => {
    const action = card.play(player);
    expect(action).is.undefined;
    expect(card.getVictoryPoints()).to.eq(-1);
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

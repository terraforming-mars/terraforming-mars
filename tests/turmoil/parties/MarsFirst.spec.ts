import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {setRulingParty, addGreenery} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MARS_FIRST_BONUS_1, MARS_FIRST_BONUS_2, MARS_FIRST_POLICY_4} from '../../../src/server/turmoil/parties/MarsFirst';
import {Mine} from '../../../src/server/cards/base/Mine';
import {Tag} from '../../../src/common/cards/Tag';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGame} from '../../TestGame';

describe('MarsFirst', function() {
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    [game, player] = testGame(2, {turmoilExtension: true});
  });

  it('Ruling bonus 1: Gain 1 M€ for each building tag you have', function() {
    player.playedCards.push(new Mine());

    const bonus = MARS_FIRST_BONUS_1;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(1);
  });

  it('Ruling bonus 2: Gain 1 M€ for each tile you have ON MARS', function() {
    addGreenery(player, '11');

    const bonus = MARS_FIRST_BONUS_2;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(1);
  });

  it('Ruling policy 1: When you place a tile ON MARS, gain 1 steel', function() {
    setRulingParty(game, PartyName.MARS, 'mfp01');

    addGreenery(player, '11');
    expect(player.steel).to.eq(1);
  });

  it('Ruling policy 2: When you play a building tag, gain 2 MC', function() {
    setRulingParty(game, PartyName.MARS, 'mfp02');

    const mine = new Mine();
    player.playCard(mine);
    expect(player.megaCredits).to.eq(2);
  });

  it('Ruling policy 3: Your steel resources are worth 1 M€ extra', function() {
    expect(player.getSteelValue()).to.eq(2);
    setRulingParty(game, PartyName.MARS, 'mfp03');
    expect(player.getSteelValue()).to.eq(3);
    setRulingParty(game, PartyName.SCIENTISTS, 'sp01');
    expect(player.getSteelValue()).to.eq(2);
  });

  it('Ruling policy 4: Spend 4 M€ to draw a Building card', function() {
    setRulingParty(game, PartyName.MARS, 'mfp04');

    const marsFirstPolicy = MARS_FIRST_POLICY_4;
    player.megaCredits = 7;

    marsFirstPolicy.action(player);
    expect(marsFirstPolicy.canAct(player)).to.be.true;
    game.deferredActions.runNext();

    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.megaCredits).to.eq(3);
    expect(player.cardsInHand[0].tags.includes(Tag.BUILDING)).to.be.true;
    expect(marsFirstPolicy.canAct(player)).to.be.false;
  });
});

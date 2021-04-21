import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {MarsFirst, MARS_FIRST_BONUS_1, MARS_FIRST_BONUS_2, MARS_FIRST_POLICY_4} from '../../../src/turmoil/parties/MarsFirst';
import {Mine} from '../../../src/cards/base/Mine';
import {Tags} from '../../../src/cards/Tags';

describe('MarsFirst', function() {
  let player : Player; let game : Game; let turmoil: Turmoil; let marsFirst: MarsFirst;

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player], player, gameOptions);
    turmoil = game.turmoil!;
    marsFirst = new MarsFirst();

    TestingUtils.resetBoard(game);
  });

  it('Ruling bonus 1: Gain 1 M€ for each Building tag you have', function() {
    player.playedCards.push(new Mine());

    const bonus = MARS_FIRST_BONUS_1;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(1);
  });

  it('Ruling bonus 2: Gain 1 M€ for each tile you have ON MARS', function() {
    game.addGreenery(player, '11');

    const bonus = MARS_FIRST_BONUS_2;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(1);
  });

  it('Ruling policy 1: When you place a tile ON MARS, gain 1 steel', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, marsFirst, marsFirst.policies[0].id);

    game.addGreenery(player, '11');
    expect(player.steel).to.eq(1);
  });

  it('Ruling policy 2: When you play a Building tag, gain 2 MC', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, marsFirst, marsFirst.policies[1].id);

    const mine = new Mine();
    player.playCard(mine);
    expect(player.megaCredits).to.eq(2);
  });

  it('Ruling policy 3: Your steel resources are worth 1 M€ extra', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, marsFirst, marsFirst.policies[2].id);
    expect(player.getSteelValue()).to.eq(3);
  });

  it('Ruling policy 4: Spend 4 M€ to draw a Building card', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, marsFirst, marsFirst.policies[3].id);

    const marsFirstPolicy = MARS_FIRST_POLICY_4;
    player.megaCredits = 7;

    marsFirstPolicy.action(player);
    expect(marsFirstPolicy.canAct(player)).to.be.true;
    game.deferredActions.runNext();

    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.megaCredits).to.eq(3);
    expect(player.cardsInHand[0].tags.includes(Tags.BUILDING)).to.be.true;
    expect(marsFirstPolicy.canAct(player)).to.be.false;
  });
});

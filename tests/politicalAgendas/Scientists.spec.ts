import {expect} from 'chai';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {resetBoard, setCustomGameOptions, setRulingPartyAndRulingPolicy, TestPlayers} from '../TestingUtils';
import {Scientists, SCIENTISTS_BONUS_1, SCIENTISTS_BONUS_2, SCIENTISTS_POLICY_1, SCIENTISTS_POLICY_4} from '../../src/turmoil/parties/Scientists';
import {SearchForLife} from '../../src/cards/base/SearchForLife';
import {Research} from '../../src/cards/base/Research';
import {GeneRepair} from '../../src/cards/base/GeneRepair';

describe('Scientists', function() {
  let player : Player; let game : Game; let turmoil: Turmoil; let scientists: Scientists;

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    const gameOptions = setCustomGameOptions();
    game = Game.newInstance('foobar', [player], player, gameOptions);
    turmoil = game.turmoil!;
    scientists = new Scientists();

    resetBoard(game);
  });

  it('Ruling bonus 1: Gain 1 MC for each Science tag you have', function() {
    player.playedCards.push(new SearchForLife());

    const bonus = SCIENTISTS_BONUS_1;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(1);
  });

  it('Ruling bonus 2: Gain 1 MC for every 3 cards in hand', function() {
    player.cardsInHand.push(new SearchForLife(), new Research(), new GeneRepair());

    const bonus = SCIENTISTS_BONUS_2;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(1);
  });

  it('Ruling policy 1: Pay 10 MC to draw 3 cards', function() {
    setRulingPartyAndRulingPolicy(game, turmoil, scientists, scientists.policies[0].id);

    const scientistsPolicy = SCIENTISTS_POLICY_1;
    player.megaCredits = 10;
    expect(scientistsPolicy.canAct(player)).to.be.true;

    scientistsPolicy.action(player);
    game.deferredActions.runNext();
    expect(player.cardsInHand).has.lengthOf(3);
    expect(player.megaCredits).to.eq(0);
    expect(scientistsPolicy.canAct(player)).to.be.false;
  });

  it('Ruling policy 2: Your global requirements are +/- 2 steps', function() {
    setRulingPartyAndRulingPolicy(game, turmoil, scientists, scientists.policies[1].id);

    const card = new SearchForLife();
    (game as any).oxygenLevel = 8;
    expect(card.canPlay(player)).to.be.true;
  });

  it('Ruling policy 3: When you raise a global parameter, draw a card per step raised', function() {
    setRulingPartyAndRulingPolicy(game, turmoil, scientists, scientists.policies[2].id);

    game.increaseOxygenLevel(player, 1);
    game.deferredActions.runNext();
    expect(player.cardsInHand).has.lengthOf(1);

    game.increaseTemperature(player, 2);
    game.deferredActions.runNext();
    expect(player.cardsInHand).has.lengthOf(3);
  });

  it('Ruling policy 4: Cards with Science tag requirements may be played with 1 less Science tag', function() {
    setRulingPartyAndRulingPolicy(game, turmoil, scientists, scientists.policies[3].id);

    const card = new GeneRepair();
    expect(card.canPlay(player)).to.be.false;

    const scientistsPolicy = SCIENTISTS_POLICY_4;
    scientistsPolicy.apply(game);
    player.playedCards.push(new Research());
    expect(card.canPlay(player)).to.be.true;
  });
});

import {expect} from 'chai';
import {HighTempSuperconductors} from '../../../src/cards/pathfinders/HighTempSuperconductors';
import {Thorgate} from '../../../src/cards/corporation/Thorgate';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {Kelvinists, KELVINISTS_POLICY_1} from '../../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {TestingUtils} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';
import {Tags} from '../../../src/common/cards/Tags';
import {PowerPlantStandardProject} from '../../../src/cards/base/standardProjects/PowerPlantStandardProject';

describe('HighTempSuperconductors', function() {
  let card: HighTempSuperconductors;
  let player: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new HighTempSuperconductors();
    game = newTestGame(1, {turmoilExtension: true});
    player = getTestPlayer(game, 0);
    turmoil = Turmoil.getTurmoil(game);
  });

  it('canPlay', function() {
    player.megaCredits = card.cost;
    turmoil.rulingParty = new Reds();
    expect(player.canPlay(card)).is.false;
    turmoil.rulingParty = new Kelvinists();
    expect(player.canPlay(card)).is.true;
  });

  it('play', function() {
    card.play(player);
    expect(player.getProductionForTest()).deep.eq(Units.of({energy: 2}));
  });

  it('discount power tag', function() {
    player.playedCards.push(card);

    // Not power tag
    const cost10 = TestingUtils.fakeCard({cost: 10, tags: [Tags.CITY]});
    player.megaCredits = 9;
    expect(player.canPlay(cost10)).is.false;
    player.megaCredits = 10;
    expect(player.canPlay(cost10)).is.true;

    const cost10WithTag = TestingUtils.fakeCard({cost: 10, tags: [Tags.ENERGY]});
    player.megaCredits = 6;
    expect(player.canPlay(cost10WithTag)).is.false;
    player.megaCredits = 7;
    expect(player.canPlay(cost10WithTag)).is.true;
  });

  it('discount standard project', function() {
    player.playedCards.push(card);

    const powerPlant = new PowerPlantStandardProject();
    player.megaCredits = powerPlant.cost - 4;
    expect(powerPlant.canAct(player)).is.false;
    player.megaCredits++;
    expect(powerPlant.canAct(player)).is.true;
  });


  it('double-discount with Thorgate', function() {
    player.playedCards.push(card);
    player.corporationCard = new Thorgate();

    const powerPlant = new PowerPlantStandardProject();
    player.megaCredits = powerPlant.cost - 7;
    expect(powerPlant.canAct(player)).is.false;
    player.megaCredits++;
    expect(powerPlant.canAct(player)).is.true;
  });

  it('discount Kelvinists ruling bonus', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, new Kelvinists(), 'kp01');

    player.megaCredits = 9;
    expect(KELVINISTS_POLICY_1.canAct(player)).is.false;
    player.megaCredits = 10;
    expect(KELVINISTS_POLICY_1.canAct(player)).is.true;
    expect(KELVINISTS_POLICY_1.description(player)).matches(/10 M/);

    player.playedCards.push(card);
    expect(KELVINISTS_POLICY_1.description(player)).matches(/7 M/);

    player.megaCredits = 6;
    expect(KELVINISTS_POLICY_1.canAct(player)).is.false;
    player.megaCredits = 7;
    expect(KELVINISTS_POLICY_1.canAct(player)).is.true;
  });
});

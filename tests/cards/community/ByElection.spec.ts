import {expect} from 'chai';
import {ByElection} from '../../../src/cards/community/ByElection';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('ByElection', function() {
  let card : ByElection; let player : Player; let game : Game;

  beforeEach(function() {
    card = new ByElection();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
  });

  it('Should play', function() {
    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.peek()!.execute() as OrOptions;
    const subOptions = orOptions.options[0] as OrOptions;
    subOptions.cb();

    const turmoil = game.turmoil!;
    expect(turmoil.playersInfluenceBonus.get(player.id)).to.eq(1);

    const rulingParty = turmoil.rulingParty;
    expect(rulingParty.name).to.eq(PartyName.MARS);
    expect(turmoil.politicalAgendasData.agendas.get(PartyName.MARS)).deep.eq({bonusId: 'mb01', policyId: 'mfp01'});
  });
});

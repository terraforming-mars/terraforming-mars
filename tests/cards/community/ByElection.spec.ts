import {expect} from 'chai';
import {ByElection} from '../../../src/server/cards/community/ByElection';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {cast, testGame} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SelectOption} from '../../../src/server/inputs/SelectOption';

describe('ByElection', function() {
  let card: ByElection;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new ByElection();
    [game, player/* , player2 */] = testGame(2, {turmoilExtension: true});
  });

  it('Should play', function() {
    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = cast(game.deferredActions.peek()!.execute(), OrOptions);
    const subOptions = cast(orOptions.options[0], SelectOption);
    subOptions.cb(undefined);

    const turmoil = game.turmoil!;
    expect(turmoil.playersInfluenceBonus.get(player.id)).to.eq(1);

    const rulingParty = turmoil.rulingParty;
    expect(rulingParty.name).to.eq(PartyName.MARS);
    expect(turmoil.politicalAgendasData.agendas.get(PartyName.MARS)).deep.eq({bonusId: 'mb01', policyId: 'mfp01'});
  });
});

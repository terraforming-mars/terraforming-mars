import {expect} from 'chai';
import {ByElection} from '../../../src/server/cards/community/ByElection';
import {IGame} from '../../../src/server/IGame';
import {SelectParty} from '../../../src/server/inputs/SelectParty';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {testGame} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../../src/common/utils/utils';

describe('ByElection', () => {
  let card: ByElection;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ByElection();
    [game, player/* , player2 */] = testGame(2, {expansions: {turmoil: true}});
  });

  it('Should play', () => {
    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);

    const selectParty = cast(game.deferredActions.peek()!.execute(), SelectParty);
    selectParty.cb(PartyName.MARS);

    const turmoil = game.turmoil!;
    expect(turmoil.playersInfluenceBonus.get(player.id)).to.eq(1);

    const rulingParty = turmoil.rulingParty;
    expect(rulingParty.name).to.eq(PartyName.MARS);
    expect(turmoil.politicalAgendasData.agendas.get(PartyName.MARS)).deep.eq({bonusId: 'mb01', policyId: 'mp01'});
  });
});

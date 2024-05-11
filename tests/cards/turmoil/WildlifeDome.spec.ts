import {expect} from 'chai';
import {WildlifeDome} from '../../../src/server/cards/turmoil/WildlifeDome';
import {IGame} from '../../../src/server/IGame';
import {Phase} from '../../../src/common/Phase';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {cast, runAllActions, testGame} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {IParty} from '../../../src/server/turmoil/parties/IParty';

describe('WildlifeDome', function() {
  let card: WildlifeDome;
  let player: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;
  let reds: IParty;
  let greens: IParty;

  beforeEach(() => {
    card = new WildlifeDome();
    [game, player/* , player2 */] = testGame(2, {turmoilExtension: true});
    turmoil = game.turmoil!;
    reds = turmoil.getPartyByName(PartyName.REDS);
    greens = turmoil.getPartyByName(PartyName.GREENS);
  });

  it('Should play: reds', function() {
    turmoil.rulingParty = reds;
    PoliticalAgendas.setNextAgenda(turmoil, game);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Play when greens are in power', function() {
    game.phase = Phase.ACTION;
    turmoil.rulingParty = greens;
    PoliticalAgendas.setNextAgenda(turmoil, game);

    player.megaCredits = 15;
    expect(player.canPlay(card)).is.true;

    expect(card.play(player)).is.undefined;
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectSpace);

    action.cb(action.spaces[0]);
    expect(game.getOxygenLevel()).to.eq(1);
  });

  it('Should play: reds in power, 2 green delegates', function() {
    game.phase = Phase.ACTION;
    turmoil.rulingParty = reds;
    PoliticalAgendas.setNextAgenda(turmoil, game);

    greens.delegates.add(player, 2);
    expect(player.canPlay(card)).is.not.true;

    player.megaCredits = 17;
    expect(player.canPlay(card)).is.not.true;

    player.megaCredits = 18;
    expect(player.canPlay(card)).deep.eq({redsCost: 3});
  });
});

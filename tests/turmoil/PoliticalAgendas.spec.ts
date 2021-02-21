import {expect} from 'chai';
import {Player} from '../../src/Player';
import {PartyName} from '../../src/turmoil/parties/PartyName';
import {Game} from '../../src/Game';
import {TestingUtils, setCustomGameOptions, TestPlayers} from '../TestingUtils';
import {AgendaStyle, PoliticalAgendas} from '../../src/turmoil/PoliticalAgendas';
import {AndOptions} from '../../src/inputs/AndOptions';
import {OrOptions} from '../../src/inputs/OrOptions';

describe('PoliticalAgendas', function() {
  let player1: Player;
  let player2: Player;
  let randomElement: (list: Array<any>) => any;

  beforeEach(() => {
    player1 = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    randomElement = PoliticalAgendas.randomElement;
  });

  afterEach(() => {
    PoliticalAgendas.randomElement = randomElement;
  });

  it('Standard', () => {
    const game = Game.newInstance('foobar', [player1, player2], player1, setCustomGameOptions({politicalAgendasExtension: AgendaStyle.STANDARD}));
    const turmoil = game.turmoil!;

    expect(turmoil.politicalAgendasData.currentAgenda.bonusId).eq('gb01');
    expect(turmoil.politicalAgendasData.currentAgenda.policyId).eq('gp01');

    const newParty = turmoil.getPartyByName(PartyName.KELVINISTS)!;
    turmoil.rulingParty = newParty;
    turmoil.chairman = player2.id;
    PoliticalAgendas.setNextAgenda(turmoil, game);
    TestingUtils.runAllActions(game);

    expect(turmoil.politicalAgendasData.currentAgenda.bonusId).eq('kb01');
    expect(turmoil.politicalAgendasData.currentAgenda.policyId).eq('kp01');
  });

  it('Chairman mode, human chairman', () => {
    // For the neutral chairman to always pick the second item in the list.
    PoliticalAgendas.randomElement = (list: Array<any>) => list[1];

    const game = Game.newInstance('foobar', [player1, player2], player1, setCustomGameOptions({politicalAgendasExtension: AgendaStyle.CHAIRMAN}));
    const turmoil = game.turmoil!;

    expect(turmoil.politicalAgendasData.currentAgenda.bonusId).eq('gb02');
    expect(turmoil.politicalAgendasData.currentAgenda.policyId).eq('gp02');

    const newParty = turmoil.getPartyByName(PartyName.KELVINISTS)!;
    turmoil.rulingParty = newParty;
    turmoil.chairman = player2.id;
    PoliticalAgendas.setNextAgenda(turmoil, game);
    TestingUtils.runAllActions(game);

    // Nothing's changed yet.
    expect(turmoil.politicalAgendasData.currentAgenda.bonusId).eq('gb02');
    expect(turmoil.politicalAgendasData.currentAgenda.policyId).eq('gp02');

    const waitingFor = player2.getWaitingFor() as AndOptions;
    const bonusOptions = waitingFor.options[0] as OrOptions;
    bonusOptions.options[0].cb();
    const policyOptions = waitingFor.options[1] as OrOptions;
    policyOptions.options[3].cb();
    waitingFor.cb();

    expect(turmoil.politicalAgendasData.currentAgenda.bonusId).eq('kb01');
    expect(turmoil.politicalAgendasData.currentAgenda.policyId).eq('kp04');
  });

  it('Chairman mode, neutral chairperson', () => {
    // For the neutral chairperson to always pick the second item.
    PoliticalAgendas.randomElement = (list: Array<any>) => list[1];

    const game = Game.newInstance('foobar', [player1, player2], player1, setCustomGameOptions({politicalAgendasExtension: AgendaStyle.CHAIRMAN}));
    const turmoil = game.turmoil!;

    expect(turmoil.politicalAgendasData.currentAgenda.bonusId).eq('gb02');
    expect(turmoil.politicalAgendasData.currentAgenda.policyId).eq('gp02');

    const newParty = turmoil.getPartyByName(PartyName.KELVINISTS)!;
    turmoil.rulingParty = newParty;
    turmoil.chairman = 'NEUTRAL';
    PoliticalAgendas.setNextAgenda(turmoil, game);
    TestingUtils.runAllActions(game);

    expect(turmoil.politicalAgendasData.currentAgenda.bonusId).eq('kb02');
    expect(turmoil.politicalAgendasData.currentAgenda.policyId).eq('kp02');
  });
});

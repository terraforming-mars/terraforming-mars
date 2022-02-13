import {expect} from 'chai';
import {Player} from '../../src/Player';
import {PartyName} from '../../src/common/turmoil/PartyName';
import {Game} from '../../src/Game';
import {TestingUtils} from '../TestingUtils';
import {TestPlayers} from '../TestPlayers';
import {PoliticalAgendas} from '../../src/turmoil/PoliticalAgendas';
import {AgendaStyle} from '../../src/common/turmoil/Types';
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

  const deserialized = [false, true];

  deserialized.forEach((deserialize) => {
    const suffix = deserialize ? ', but deserialized' : '';
    it('Standard' + suffix, () => {
      let game = Game.newInstance('foobar', [player1, player2], player1, TestingUtils.setCustomGameOptions({politicalAgendasExtension: AgendaStyle.STANDARD}));
      if (deserialize) {
        game = Game.deserialize(game.serialize());
      }
      const turmoil = game.turmoil!;

      expect(PoliticalAgendas.currentAgenda(turmoil).bonusId).eq('gb01');
      expect(PoliticalAgendas.currentAgenda(turmoil).policyId).eq('gp01');

      const newParty = turmoil.getPartyByName(PartyName.KELVINISTS)!;
      turmoil.rulingParty = newParty;
      turmoil.chairman = player2.id;
      PoliticalAgendas.setNextAgenda(turmoil, game);
      TestingUtils.runAllActions(game);

      expect(PoliticalAgendas.currentAgenda(turmoil).bonusId).eq('kb01');
      expect(PoliticalAgendas.currentAgenda(turmoil).policyId).eq('kp01');
    });

    it('Chairman mode, human chairperson' + suffix, () => {
      // For the neutral chairman to always pick the second item in the list.
      PoliticalAgendas.randomElement = (list: Array<any>) => list[1];

      let game = Game.newInstance('foobar', [player1, player2], player1, TestingUtils.setCustomGameOptions({politicalAgendasExtension: AgendaStyle.CHAIRMAN}));
      if (deserialize) {
        game = Game.deserialize(game.serialize());
        // Get a new copy of player2 who will have a different set of waitingFor.
        player2 = game.getPlayerById(player2.id);
      }
      const turmoil = game.turmoil!;

      expect(PoliticalAgendas.currentAgenda(turmoil)).deep.eq({bonusId: 'gb02', policyId: 'gp02'});

      const newParty = turmoil.getPartyByName(PartyName.KELVINISTS)!;
      turmoil.rulingParty = newParty;
      turmoil.chairman = player2.id;

      PoliticalAgendas.setNextAgenda(turmoil, game);
      TestingUtils.runAllActions(game);

      // The new ruling party is lined up.
      expect(PoliticalAgendas.currentAgenda(turmoil)).deep.eq({bonusId: 'kb02', policyId: 'kp02'});

      const waitingFor = player2.getWaitingFor() as OrOptions;
      const bonusOptions = waitingFor.options[0] as OrOptions;
      bonusOptions.options[0].cb();

      expect(PoliticalAgendas.currentAgenda(turmoil)).deep.eq({bonusId: 'kb01', policyId: 'kp02'});

      // In the real world only one of these two is selectable, but to keep the test simple, invoke both.
      const policyOptions = waitingFor.options[1] as OrOptions;
      policyOptions.options[3].cb();

      expect(PoliticalAgendas.currentAgenda(turmoil)).deep.eq({bonusId: 'kb01', policyId: 'kp04'});
    });

    it('Chairman mode, neutral chairperson' + suffix, () => {
      // For the neutral chairperson to always pick the second item.
      PoliticalAgendas.randomElement = (list: Array<any>) => list[1];

      let game = Game.newInstance('foobar', [player1, player2], player1, TestingUtils.setCustomGameOptions({politicalAgendasExtension: AgendaStyle.CHAIRMAN}));
      if (deserialize) {
        game = Game.deserialize(game.serialize());
      }
      const turmoil = game.turmoil!;

      expect(PoliticalAgendas.currentAgenda(turmoil).bonusId).eq('gb02');
      expect(PoliticalAgendas.currentAgenda(turmoil).policyId).eq('gp02');

      const newParty = turmoil.getPartyByName(PartyName.KELVINISTS)!;
      turmoil.rulingParty = newParty;
      turmoil.chairman = 'NEUTRAL';
      PoliticalAgendas.setNextAgenda(turmoil, game);
      TestingUtils.runAllActions(game);

      expect(PoliticalAgendas.currentAgenda(turmoil).bonusId).eq('kb02');
      expect(PoliticalAgendas.currentAgenda(turmoil).policyId).eq('kp02');
    });
  });
});

import {expect} from 'chai';
import {Game} from '../src/Game';
import {setCustomGameOptions, TestPlayers} from './TestingUtils';
import {AgendaStyle, PoliticalAgendas} from '../src/turmoil/PoliticalAgendas';
import {PartyName} from '../src/turmoil/parties/PartyName';
import {Player} from '../src/Player';
import {Turmoil} from '../src/turmoil/Turmoil';
import {ChoosePoliticalAgenda} from '../src/deferredActions/ChoosePoliticaAgenda';
import {OrOptions} from '../src/inputs/OrOptions';

describe('PoliticalAgendas', () => {
  let player : Player; let player2 : Player; let game : Game; let turmoil: Turmoil;

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
  });

  it('deserialize legacy', () => {
    const gameOptions = setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
    turmoil = game.turmoil!;
    turmoil.rulingParty = turmoil.getPartyByName(PartyName.MARS);

    expect(PoliticalAgendas.deserialize(undefined, game.turmoil!)).deep.eq({
      agendaStyle: 'Standard',
      currentAgenda: {
        bonusId: 'mb01',
        policyId: 'mfp01',
      },
      staticAgendas: new Map([
        ['Mars First', {
          bonusId: 'mb01',
          policyId: 'mfp01',
        }],
        ['Scientists', {
          bonusId: 'sb01',
          policyId: 'sp01',
        }],
        ['Unity', {
          bonusId: 'ub01',
          policyId: 'up01',
        }],
        ['Reds', {
          bonusId: 'rb01',
          policyId: 'rp01',
        }],
        ['Kelvinists', {
          bonusId: 'kb01',
          policyId: 'kp01',
        }],
        ['Greens', {
          bonusId: 'gb01',
          policyId: 'gp01',
        }],
      ]),
    });
  });

  it('in chairman mode, incoming chairman can choose to set ruling bonus or policy', () => {
    const gameOptions = setCustomGameOptions({politicalAgendasExtension: AgendaStyle.CHAIRMAN});
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
    turmoil = game.turmoil!;
    turmoil.sendDelegateToParty(player.id, PartyName.MARS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.MARS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.MARS, game);

    turmoil.endGeneration(game);
    expect(game.deferredActions).has.lengthOf(1);

    const action = game.deferredActions.shift() as ChoosePoliticalAgenda;
    expect(action instanceof ChoosePoliticalAgenda).is.true;

    const orOptions = action.execute() as OrOptions;
    expect(orOptions.options).has.lengthOf(2);

    const changeRulingBonus = orOptions.options[0] as OrOptions;
    const currentPolicyId = turmoil.politicalAgendasData.staticAgendas!.get(PartyName.MARS)!.policyId;
    changeRulingBonus.options[1].cb();
    expect(turmoil.politicalAgendasData.currentAgenda.bonusId).to.eq('mb02');
    expect(turmoil.politicalAgendasData.currentAgenda.policyId).to.eq(currentPolicyId);
  });
});

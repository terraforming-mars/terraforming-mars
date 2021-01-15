import {expect} from 'chai';
import {Game} from '../src/Game';
import {setCustomGameOptions, TestPlayers} from './TestingUtils';
import {PoliticalAgendas} from '../src/turmoil/PoliticalAgendas';
import {PartyName} from '../src/turmoil/parties/PartyName';

describe('PoliticalAgendas', () => {
  it('deserialize legacy', () => {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, setCustomGameOptions());
    game.turmoil!.rulingParty = game.turmoil!.getPartyByName(PartyName.MARS);
    expect(PoliticalAgendas.deserialize(undefined, game.turmoil!)).deep.eq({
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
});

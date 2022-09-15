import {expect} from 'chai';
import {WildlifeDome} from '../../../src/server/cards/turmoil/WildlifeDome';
import {Game} from '../../../src/server/Game';
import {Phase} from '../../../src/common/Phase';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {cast, runAllActions, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('WildlifeDome', function() {
  let card: WildlifeDome;
  let player: TestPlayer;
  let redPlayer: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new WildlifeDome();
    player = TestPlayer.BLUE.newPlayer();
    redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player, testGameOptions({turmoilExtension: true}));
  });

  it('Should play: reds', function() {
    game.turmoil!.rulingParty = game.turmoil!.getPartyByName(PartyName.REDS)!;
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play: greens', function() {
    game.phase = Phase.ACTION;
    game.turmoil!.rulingParty = game.turmoil!.getPartyByName(PartyName.REDS)!;
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);

    const greens = game.turmoil!.getPartyByName(PartyName.GREENS)!;
    greens.delegates.push(player.id, player.id);
    expect(player.canPlay(card)).is.not.true;

    player.megaCredits = 18;
    expect(player.canPlay(card)).is.true;

    expect(card.play(player)).is.undefined;
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectSpace);

    action.cb(action.availableSpaces[0]);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});

import {expect} from 'chai';
import {WildlifeDome} from '../../../src/server/cards/turmoil/WildlifeDome';
import {Game} from '../../../src/server/Game';
import {Phase} from '../../../src/common/Phase';
import {Player} from '../../../src/server/Player';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {cast, setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';

describe('WildlifeDome', function() {
  let card: WildlifeDome;
  let player: Player;
  let redPlayer: Player;
  let game: Game;

  beforeEach(() => {
    card = new WildlifeDome();
    player = TestPlayer.BLUE.newPlayer();
    redPlayer = TestPlayer.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    game = Game.newInstance('gameid', [player, redPlayer], player, gameOptions);
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

    const action = cast(card.play(player), SelectSpace);
    action.cb(action.availableSpaces[0]);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});

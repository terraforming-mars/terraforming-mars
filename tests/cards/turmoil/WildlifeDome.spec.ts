import {expect} from 'chai';
import {WildlifeDome} from '../../../src/cards/turmoil/WildlifeDome';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('WildlifeDome', function() {
  let card: WildlifeDome;
  let player: Player;
  let redPlayer: Player;
  let game: Game;

  beforeEach(() => {
    card = new WildlifeDome();
    player = TestPlayers.BLUE.newPlayer();
    redPlayer = TestPlayers.RED.newPlayer();
    const gameOptions = setCustomGameOptions();
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
  });

  it('Should play: reds', function() {
    game.turmoil!.rulingParty = game.turmoil!.getPartyByName(PartyName.REDS)!;
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play: greens', function() {
    game.turmoil!.rulingParty = game.turmoil!.getPartyByName(PartyName.REDS)!;
    PoliticalAgendas.setNextAgenda(game.turmoil!, game);

    const greens = game.turmoil!.getPartyByName(PartyName.GREENS)!;
    greens.delegates.push(player.id, player.id);
    expect(card.canPlay(player, game)).is.not.true;

    player.megaCredits = 18;
    expect(card.canPlay(player, game)).is.true;

    const action = card.play(player, game);
    expect(action).is.not.undefined;
    action.cb(action.availableSpaces[0]);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});

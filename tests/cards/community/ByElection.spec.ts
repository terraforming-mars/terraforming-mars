import {expect} from 'chai';
import {ByElection} from '../../../src/cards/community/ByElection';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayers} from '../../TestingUtils';

describe('ByElection', function() {
  let card : ByElection; let player : Player; let game : Game;

  beforeEach(function() {
    card = new ByElection();
    player = TestPlayers.BLUE.newPlayer();

    const gameOptions = setCustomGameOptions();
    game = new Game('foobar', [player, player], player, gameOptions);
  });

  it('Should play', function() {
    card.play(player, game);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.next()!.execute() as OrOptions;
    const subOptions = orOptions.options[0] as OrOptions;
    subOptions.cb();

    const turmoil = game.turmoil!;
    expect(turmoil.playersInfluenceBonus.get(player.id)).to.eq(1);
    expect(turmoil.rulingParty!.name).to.eq(PartyName.MARS);
  });
});

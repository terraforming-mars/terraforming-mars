import {expect} from 'chai';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {setCustomGameOptions} from '../../TestingUtils';
import {Game, GameOptions} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {ExperiencedMartians} from '../../../src/cards/community/preludes/ExperiencedMartians';
import {Resources} from '../../../src/Resources';

describe('ExperiencedMartians', function() {
  let card : ExperiencedMartians; let player : Player; let game : Game;

  beforeEach(function() {
    card = new ExperiencedMartians();
    player = new Player('test', Color.BLUE, false);

    const gameOptions = setCustomGameOptions() as GameOptions;
    game = new Game('foobar', [player, player], player, gameOptions);
  });

  it('Should play', function() {
    card.play(player, game);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.next()!.execute() as OrOptions;
    orOptions.options[0].cb();
    game.deferredActions.shift();

    const turmoil = game.turmoil!;
    const marsFirst = turmoil.getPartyByName(PartyName.MARS)!;
    expect(marsFirst.delegates.filter((d) => d === player.id)).has.lengthOf(2);
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
    expect(player.getProduction(Resources.HEAT)).to.eq(1);
  });
});

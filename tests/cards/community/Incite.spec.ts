import {expect} from 'chai';
import {Incite} from '../../../src/cards/community/Incite';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {setCustomGameOptions} from '../../TestingUtils';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {EventAnalysts} from '../../../src/cards/turmoil/EventAnalysts';

describe('Incite', function() {
  let card : Incite; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Incite();
    player = new Player('test', Color.BLUE, false);

    const gameOptions = setCustomGameOptions();
    game = new Game('foobar', [player], player, gameOptions);

    card.play(player, game);
    player.corporationCard = card;
  });

  it('Starts with +1 influence', function() {
    expect(game.turmoil!.getPlayerInfluence(player)).to.eq(1);
  });

  it('Works with Event Analysts', function() {
    const eventAnalysts = new EventAnalysts();
    eventAnalysts.play(player, game);
    expect(game.turmoil!.getPlayerInfluence(player)).to.eq(2);
  });

  it('Can perform initial action', function() {
    card.initialAction(player, game);
    expect(game.deferredActions).has.lengthOf(1);

    const orOptions = game.deferredActions.next()!.execute() as OrOptions;
    orOptions.options[0].cb();

    const marsFirst = game.turmoil!.getPartyByName(PartyName.MARS);
    expect(marsFirst!.delegates.filter((d) => d === player.id)).has.lengthOf(2);
  });
});

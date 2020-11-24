import {expect} from 'chai';
import {Eris} from '../../../src/cards/ares/Eris';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game, GameOptions} from '../../../src/Game';
import {setCustomGameOptions} from '../../TestingUtils';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {AresHandler} from '../../../src/ares/AresHandler';

describe('Eris', function() {
  let card : Eris; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Eris();
    player = new Player('test', Color.BLUE, false);

    const gameOptions = setCustomGameOptions({aresExtension: true, aresHazards: true}) as GameOptions;
    game = new Game('foobar', [player, player], player, gameOptions);

    card.play();
    player.corporationCard = card;
  });

  it('Starts with 1 Ares card', function() {
    card.initialAction(player, game);
    expect(player.cardsInHand).has.lengthOf(1);
  });

  it('Can act', function() {
    const action = card.action(player, game) as OrOptions;
    const initialHazardsCount = AresHandler.getHazardsCount(game);
    const initialTR = player.getTerraformRating();

    // Place a hazard tile
    action.options[0].cb();
    expect(game.deferredActions).has.lengthOf(1);
    const placeHazard = game.deferredActions.next()!.execute() as SelectSpace;
    placeHazard.cb(placeHazard.availableSpaces[0]);
    expect(AresHandler.getHazardsCount(game)).to.eq(initialHazardsCount + 1);

    // Remove a hazard tile to gain 1 TR
    const removableHazards = action.options[1].cb() as SelectSpace;
    removableHazards.cb(removableHazards.availableSpaces[0]);
    expect(AresHandler.getHazardsCount(game)).to.eq(initialHazardsCount);
    expect(player.getTerraformRating()).to.eq(initialTR + 1);
  });
});

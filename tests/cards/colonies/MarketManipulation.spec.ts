import {SelectColony} from './../../../src/inputs/SelectColony';
import {expect} from 'chai';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Pets} from '../../../src/cards/base/Pets';
import {MarketManipulation} from '../../../src/cards/colonies/MarketManipulation';
import {Enceladus} from '../../../src/colonies/Enceladus';
import {Luna} from '../../../src/colonies/Luna';
import {Miranda} from '../../../src/colonies/Miranda';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {ColonyName} from '../../../src/common/colonies/ColonyName';

describe('MarketManipulation', function() {
  let card : MarketManipulation;
  let player : Player;
  let game: Game;

  beforeEach(function() {
    card = new MarketManipulation();
    game = newTestGame(2, {
      coloniesExtension: true,
      customColoniesList: [
        ColonyName.GANYMEDE,
        ColonyName.LUNA,
        ColonyName.PLUTO,
        ColonyName.CALLISTO,
        ColonyName.EUROPA],
    });
    player = getTestPlayer(game, 0);
  });

  it('Should play', function() {
    card.play(player);
    const increaseColonyAction = game.deferredActions.pop()!.execute() as SelectColony;
    increaseColonyAction.cb(increaseColonyAction.colonies[0]);
    expect(game.colonies[0].trackPosition).to.eq(2);
    expect(game.colonies[1].trackPosition).to.eq(1);
    expect(game.colonies[2].trackPosition).to.eq(1);

    const decreaseColonyAction = game.deferredActions.pop()!.execute() as SelectColony;
    decreaseColonyAction.cb(increaseColonyAction.colonies[1]);
    expect(game.colonies[0].trackPosition).to.eq(2);
    expect(game.colonies[1].trackPosition).to.eq(0);
    expect(game.colonies[2].trackPosition).to.eq(1);
  });

  it('Can\'t play', function() {
    const enceladus = new Enceladus();
    const miranda = new Miranda();
    const luna = new Luna();

    player.game.colonies = [enceladus, miranda, luna];
    player.game.gameOptions.coloniesExtension = true;
    expect(card.canPlay(player)).is.not.true;

    player.playCard(new Pets());
    expect(card.canPlay(player)).is.true;
  });
});

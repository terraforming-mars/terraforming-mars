import {expect} from 'chai';
import {JovianLanterns} from '../../../src/cards/colonies/JovianLanterns';
import {NitrogenFromTitan} from '../../../src/cards/colonies/NitrogenFromTitan';
import {TitanFloatingLaunchPad} from '../../../src/cards/colonies/TitanFloatingLaunchPad';
import {ICard} from '../../../src/cards/ICard';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestPlayers';

describe('NitrogenFromTitan', function() {
  let card : NitrogenFromTitan; let player : Player; let game : Game;

  beforeEach(function() {
    card = new NitrogenFromTitan();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can play without floaters', function() {
    const tr = player.getTerraformRating();
    card.play(player);
    expect(player.getTerraformRating()).to.eq(tr + 2);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
  });

  it('Can play with single Jovian floater card', function() {
    const jovianLanterns = new JovianLanterns();
    player.playedCards.push(jovianLanterns);

    card.play(player);
    player.game.deferredActions.runNext();
    expect(jovianLanterns.resourceCount).to.eq(2);
  });

  it('Can play with multiple Jovian floater cards', function() {
    const jovianLanterns = new JovianLanterns();
    player.playedCards.push(jovianLanterns, new TitanFloatingLaunchPad());

    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);

    const selectCard = game.deferredActions.peek()!.execute() as SelectCard<ICard>;
    selectCard.cb([jovianLanterns]);
    expect(jovianLanterns.resourceCount).to.eq(2);
  });
});

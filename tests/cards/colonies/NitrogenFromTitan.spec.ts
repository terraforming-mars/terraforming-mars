import {expect} from 'chai';
import {NitrogenFromTitan} from '../../../src/cards/colonies/NitrogenFromTitan';
import {Color} from '../../../src/Color';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {JovianLanterns} from '../../../src/cards/colonies/JovianLanterns';
import {TitanFloatingLaunchPad} from '../../../src/cards/colonies/TitanFloatingLaunchPad';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {ICard} from '../../../src/cards/ICard';

describe('NitrogenFromTitan', function() {
  let card : NitrogenFromTitan; let player : Player; let game : Game;

  beforeEach(function() {
    card = new NitrogenFromTitan();
    player = new Player('test', Color.BLUE, false);
    game = new Game('foobar', [player, player], player);
  });

  it('Can play without floaters', function() {
    const tr = player.getTerraformRating();
    card.play(player, game);
    expect(player.getTerraformRating()).to.eq(tr + 2);
    const input = game.deferredActions.next()!.execute();
    expect(input).is.undefined;
  });

  it('Can play with single Jovian floater card', function() {
    const jovianLanterns = new JovianLanterns();
    player.playedCards.push(jovianLanterns);

    card.play(player, game);
    game.deferredActions.runNext();
    expect(jovianLanterns.resourceCount).to.eq(2);
  });

  it('Can play with multiple Jovian floater cards', function() {
    const jovianLanterns = new JovianLanterns();
    player.playedCards.push(jovianLanterns, new TitanFloatingLaunchPad());

    card.play(player, game);
    expect(game.deferredActions).has.lengthOf(1);

    const selectCard = game.deferredActions.next()!.execute() as SelectCard<ICard>;
    selectCard.cb([jovianLanterns]);
    expect(jovianLanterns.resourceCount).to.eq(2);
  });
});

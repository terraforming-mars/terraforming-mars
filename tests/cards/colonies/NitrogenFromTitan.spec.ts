import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';
import {NitrogenFromTitan} from '../../../src/server/cards/colonies/NitrogenFromTitan';
import {TitanFloatingLaunchPad} from '../../../src/server/cards/colonies/TitanFloatingLaunchPad';
import {ICard} from '../../../src/server/cards/ICard';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('NitrogenFromTitan', function() {
  let card: NitrogenFromTitan;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new NitrogenFromTitan();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
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

    const selectCard = cast(game.deferredActions.peek()!.execute(), SelectCard<ICard>);
    selectCard.cb([jovianLanterns]);
    expect(jovianLanterns.resourceCount).to.eq(2);
  });
});

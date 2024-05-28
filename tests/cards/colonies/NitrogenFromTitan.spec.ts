import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';
import {NitrogenFromTitan} from '../../../src/server/cards/colonies/NitrogenFromTitan';
import {TitanFloatingLaunchPad} from '../../../src/server/cards/colonies/TitanFloatingLaunchPad';
import {ICard} from '../../../src/server/cards/ICard';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('NitrogenFromTitan', function() {
  let card: NitrogenFromTitan;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new NitrogenFromTitan();
    [game, player] = testGame(2);
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

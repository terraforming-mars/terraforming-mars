import {expect} from 'chai';
import {IcyImpactors} from '../../../src/server/cards/promo/IcyImpactors';
import {testGame} from '../../TestGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {cast, maxOutOceans, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {TileType} from '../../../src/common/TileType';

describe('IcyImpactors', () => {
  let card: IcyImpactors;
  let game: IGame;
  let player: TestPlayer;
  let opponent: TestPlayer;

  beforeEach(() => {
    card = new IcyImpactors();
    [game, player, opponent] = testGame(2);
  });

  it('Should play', () => {
    expect(card.play(player)).is.undefined;
  });

  it('Can not act', () => {
    player.playedCards.push(card);
    player.megaCredits = 9;
    expect(card.canAct(player)).is.not.true;
    player.megaCredits = 10;
    expect(card.canAct(player)).is.true;
  });

  it('action - single action choice - gain resources', () => {
    player.megaCredits = 10;

    cast(card.action(player), undefined);
    runAllActions(game);
    expect(player.megaCredits).to.eq(0);
    expect(card.resourceCount).to.eq(2);
  });

  it('action - single action choice - place ocean', () => {
    card.resourceCount = 1;

    cast(card.action(player), undefined);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    expect(selectSpace.spaces[0].tile?.tileType).eq(TileType.OCEAN);
    expect(player.getTerraformRating()).to.eq(21);
    expect(card.resourceCount).eq(0);
  });

  it('action - multiple - gain resources', () => {
    player.megaCredits = 10;
    card.resourceCount = 1;

    const orOptions = cast(card.action(player), OrOptions);
    orOptions.options[1].cb();
    runAllActions(game);
    expect(card.resourceCount).to.eq(3);
    expect(player.megaCredits).to.eq(0);
  });

  it('action - multiple - place ocean', () => {
    player.megaCredits = 10;
    card.resourceCount = 1;

    const orOptions = cast(card.action(player), OrOptions);
    orOptions.options[0].cb();
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    expect(selectSpace.spaces[0].tile?.tileType).eq(TileType.OCEAN);
    expect(player.getTerraformRating()).to.eq(21);
    expect(card.resourceCount).eq(0);
  });

  it('Can spend resource to place ocean if oceans are maxed', () => {
    player.playedCards.push(card);
    card.resourceCount = 1;
    maxOutOceans(opponent);
    player.megaCredits = 0;

    expect(card.canAct(player)).is.true;

    cast(card.action(player), undefined);
    runAllActions(game);
    expect(player.game.deferredActions).has.lengthOf(0);
    expect(card.resourceCount).to.eq(0);
    expect(player.getTerraformRating()).to.eq(20);
  });
});

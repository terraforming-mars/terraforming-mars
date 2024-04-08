import {expect} from 'chai';
import {PrivateResorts} from '../../../src/server/cards/underworld/PrivateResorts';
import {testGame} from '../../TestGame';
import {cast, forceGenerationEnd, maxOutOceans, runAllActions} from '../../TestingUtils';

describe('PrivateResorts', () => {
  it('canPlay', () => {
    const card = new PrivateResorts();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    maxOutOceans(player, 2);
    player.production.override({heat: 1});
    expect(card.canPlay(player)).is.false;

    maxOutOceans(player, 3);
    player.production.override({heat: 0});
    expect(card.canPlay(player)).is.false;

    maxOutOceans(player, 3);
    player.production.override({heat: 1});
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    const card = new PrivateResorts();
    const [game, player] = testGame(2, {underworldExpansion: true});

    expect(game.generation).eq(1);
    forceGenerationEnd(game);
    expect(game.generation).eq(2);
    expect(player.megaCredits).eq(20);
    expect(player.underworldData.corruption).eq(0);

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.production.heat).eq(0);
    player.playedCards.push(card);

    player.megaCredits = 0;
    player.underworldData.corruption = 0;
    forceGenerationEnd(game);
    expect(game.generation).eq(3);
    expect(player.megaCredits).eq(32); // TR = 20
    expect(player.underworldData.corruption).eq(1);

    player.megaCredits = 0;
    player.underworldData.corruption = 0;
    forceGenerationEnd(game);
    expect(game.generation).eq(4);
    expect(player.megaCredits).eq(20);
    expect(player.underworldData.corruption).eq(0);
  });
});

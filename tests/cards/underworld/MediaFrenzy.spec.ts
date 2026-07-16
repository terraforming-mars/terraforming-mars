import {expect} from 'chai';
import {MediaFrenzy} from '../../../src/server/cards/underworld/MediaFrenzy';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {CardType} from '../../../src/common/cards/CardType';
import {PrivateMilitaryContractor} from '../../../src/server/cards/underworld/PrivateMilitaryContractor';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {assertIsMaybeBlock} from '../../underworld/underworldAssertions';

describe('MediaFrenzy', () => {
  it('canPlay', () => {
    const card = new MediaFrenzy();
    const [/* game */, player, opponent] = testGame(2);

    expect(card.canPlay(player)).is.false;

    player.underworldData.corruption = 1;

    expect(card.canPlay(player)).is.false;

    opponent.underworldData.corruption = 1;

    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const card = new MediaFrenzy();
    const [game, player, player2, player3, player4] = testGame(4, {underworldExpansion: true});

    player.underworldData.corruption = 2;
    player2.underworldData.corruption = 2;
    player3.underworldData.corruption = 0;
    player4.underworldData.corruption = 2;
    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.cardsInHand).has.length(2);
    expect(player.cardsInHand[0].type).eq(CardType.EVENT);
    expect(player.cardsInHand[1].type).eq(CardType.EVENT);

    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);

    expect(selectPlayer.players).to.have.members([player2, player4]);

    cast(selectPlayer.cb(player4), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(player2.underworldData.corruption).eq(2);
    expect(player4.underworldData.corruption).eq(1);
  });

  it('play, player has private military contractors', () => {
    const card = new MediaFrenzy();
    const [game, player, player2] = testGame(2, {underworldExpansion: true});

    const privateMiltaryContractors = new PrivateMilitaryContractor();
    player2.playedCards.push(privateMiltaryContractors);
    privateMiltaryContractors.resourceCount = 2;
    player2.underworldData.corruption = 2;

    cast(card.play(player), undefined);
    runAllActions(game);

    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);
    cast(selectPlayer.cb(player2), undefined);
    runAllActions(game);
    const orOptions = cast(player2.popWaitingFor(), OrOptions);
    assertIsMaybeBlock(player2, orOptions, 'fighters');

    expect(player2.underworldData.corruption).eq(2);
    expect(privateMiltaryContractors.resourceCount).eq(1);
  });
});

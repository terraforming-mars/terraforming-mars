import {expect} from 'chai';
import {PrivateInvestigator} from '../../../src/server/cards/underworld/PrivateInvestigator';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';

describe('PrivateInvestigator', () => {
  it('Should play', () => {
    const card = new PrivateInvestigator();
    const [game, player, player2, player3, player4] = testGame(4);

    player.underworldData.corruption = 2;
    player2.underworldData.corruption = 4;
    player3.underworldData.corruption = 0;
    player4.underworldData.corruption = 3;

    expect(player.getTerraformRating()).eq(20);

    player.playCard(card);
    runAllActions(game);
    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);

    expect(player.getTerraformRating()).eq(21);

    expect(selectPlayer.players).to.have.members([player2, player4]);
    selectPlayer.cb(player2);
    expect(player2.playedCards.get(card.name)).deep.eq(card);
    expect(player.playedCards.get(card.name)).is.undefined;
  });
});

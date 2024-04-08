import {expect} from 'chai';
import {GlobalAudit} from '../../../src/server/cards/underworld/GlobalAudit';
import {testGame} from '../../TestGame';
import {cast, runAllActions, setRulingParty} from '../../TestingUtils';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('GlobalAudit', () => {
  it('Should play', () => {
    const card = new GlobalAudit();
    const [/* game */, player, player2, player3, player4] = testGame(4);

    player.underworldData.corruption = 0;
    player2.underworldData.corruption = 1;
    player3.underworldData.corruption = 0;
    player4.underworldData.corruption = 2;

    cast(card.play(player), undefined);

    expect(player.getTerraformRating()).eq(21);
    expect(player2.getTerraformRating()).eq(20);
    expect(player3.getTerraformRating()).eq(21);
    expect(player4.getTerraformRating()).eq(20);
  });

  it('Should play - reds', () => {
    const card = new GlobalAudit();
    const [game, player, player2, player3, player4] = testGame(4, {turmoilExtension: true});

    player.underworldData.corruption = 0;
    player.megaCredits = 4;
    player2.underworldData.corruption = 0;
    player2.megaCredits = 3;
    player3.underworldData.corruption = 0;
    player3.megaCredits = 2;
    player4.underworldData.corruption = 0;
    player4.megaCredits = 1;

    setRulingParty(game, PartyName.REDS);

    cast(card.play(player), undefined);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    cast(player2.popWaitingFor(), undefined);
    cast(player3.popWaitingFor(), undefined);
    cast(player4.popWaitingFor(), undefined);

    expect(player.getTerraformRating()).eq(21);
    expect(player.megaCredits).eq(1);
    expect(player2.getTerraformRating()).eq(21);
    expect(player2.megaCredits).eq(0);
    expect(player3.getTerraformRating()).eq(20);
    expect(player3.megaCredits).eq(2);
    expect(player4.getTerraformRating()).eq(20);
    expect(player4.megaCredits).eq(1);
  });
});

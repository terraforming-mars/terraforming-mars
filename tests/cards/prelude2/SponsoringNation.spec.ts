import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {SponsoringNation} from '../../../src/server/cards/prelude2/SponsoringNation';
import {cast, runAllActions} from '../../TestingUtils';
import {assertAddDelegateAction} from '../../turmoil/turmoilAssertions';

describe('SponsoringNation', () => {
  it('canPlay', () => {
    const card = new SponsoringNation();
    const [/* game */, player] = testGame(1, {turmoilExtension: true});

    player.tagsForTest = {earth: 3};

    expect(card.canPlay(player)).is.false;

    player.tagsForTest = {earth: 4};

    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const card = new SponsoringNation();
    const [game, player] = testGame(1, {turmoilExtension: true});

    expect(player.getTerraformRating()).eq(14);

    cast(card.play(player), undefined);

    expect(player.getTerraformRating()).eq(17);

    runAllActions(game);

    assertAddDelegateAction(player, player.popWaitingFor(), 2);
  });
});

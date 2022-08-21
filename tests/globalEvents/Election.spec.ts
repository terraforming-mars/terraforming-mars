import {expect} from 'chai';
import {StripMine} from '../../src/server/cards/base/StripMine';
import {Election} from '../../src/server/turmoil/globalEvents/Election';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {getTestPlayer, newTestGame} from '../TestGame';
import {fakeCard} from '../TestingUtils';
import {Tag} from '../../src/common/cards/Tag';

describe('Election', function() {
  let card: Election;
  beforeEach(() => {
    card = new Election();
  });
  it('resolve play', function() {
    const game = newTestGame(3, {turmoilExtension: true});
    const player = getTestPlayer(game, 0);
    const player2 = getTestPlayer(game, 1);
    const player3 = getTestPlayer(game, 2);
    const turmoil = game.turmoil!;
    turmoil.initGlobalEvent(game);
    player.playedCards.push(new StripMine());
    player2.playedCards.push(new StripMine());
    player2.playedCards.push(new StripMine());
    game.addCityTile(player3, game.board.getAvailableSpacesOnLand(player3)[0].id);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);

    expect(card.getScore(player, turmoil, game)).eq(1);
    expect(card.getScore(player2, turmoil, game)).eq(4);
    expect(card.getScore(player3, turmoil, game)).eq(1);

    card.resolve(game, turmoil);

    expect(player.getTerraformRating()).to.eq(21);
    expect(player2.getTerraformRating()).to.eq(22);
    expect(player3.getTerraformRating()).to.eq(21);
  });


  it('solo play', function() {
    const game = newTestGame(1, {turmoilExtension: true});
    const player = getTestPlayer(game, 0);
    const turmoil = game.turmoil!;
    turmoil.initGlobalEvent(game);
    const fake = fakeCard({tags: [Tag.BUILDING, Tag.BUILDING, Tag.BUILDING, Tag.BUILDING]});
    player.playedCards.push(fake);

    expect(player.getTerraformRating()).to.eq(14);
    expect(card.getScore(player, turmoil, game)).eq(4);

    card.resolve(game, turmoil);

    expect(player.getTerraformRating()).to.eq(14);

    fake.tags.push(Tag.BUILDING);
    expect(card.getScore(player, turmoil, game)).eq(5);

    card.resolve(game, turmoil);

    expect(player.getTerraformRating()).to.eq(15);

    fake.tags.push(Tag.BUILDING, Tag.BUILDING, Tag.BUILDING, Tag.BUILDING);
    expect(card.getScore(player, turmoil, game)).eq(9);

    card.resolve(game, turmoil);

    expect(player.getTerraformRating()).to.eq(16);

    fake.tags.push(Tag.BUILDING);
    expect(card.getScore(player, turmoil, game)).eq(10);

    card.resolve(game, turmoil);

    expect(player.getTerraformRating()).to.eq(18);
  });
});

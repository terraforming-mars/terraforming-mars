import {expect} from 'chai';
import {Election} from '../../src/server/turmoil/globalEvents/Election';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {testGame} from '../TestGame';
import {addCity, fakeCard} from '../TestingUtils';
import {Tag} from '../../src/common/cards/Tag';

describe('Election', () => {
  it('resolve play', () => {
    const card = new Election();
    const [game, player, player2, player3] = testGame(3, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    turmoil.initGlobalEvent(game);
    player.tagsForTest = {building: 1};
    player2.tagsForTest = {building: 2};
    addCity(player3);
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);

    expect(card.getScore(player, turmoil, game)).eq(1);
    expect(card.getScore(player2, turmoil, game)).eq(4);
    expect(card.getScore(player3, turmoil, game)).eq(1);

    card.resolve(game);

    expect(player.terraformRating).to.eq(21);
    expect(player2.terraformRating).to.eq(22);
    expect(player3.terraformRating).to.eq(21);
  });


  it('a tie for first place gives every tied player 2 TR and skips second place', () => {
    const card = new Election();
    const [game, player, player2, player3] = testGame(3, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    turmoil.initGlobalEvent(game);
    player.tagsForTest = {building: 3};
    player2.tagsForTest = {building: 3};
    player3.tagsForTest = {building: 1};

    card.resolve(game);

    expect(player.terraformRating).to.eq(22);
    expect(player2.terraformRating).to.eq(22);
    expect(player3.terraformRating).to.eq(20);
  });

  it('with two players, second place gets 1 TR', () => {
    const card = new Election();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    turmoil.initGlobalEvent(game);
    player.tagsForTest = {building: 2};

    card.resolve(game);

    expect(player.terraformRating).to.eq(22);
    expect(player2.terraformRating).to.eq(21);
  });

  it('solo play', () => {
    const card = new Election();
    const [game, player] = testGame(1, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    turmoil.initGlobalEvent(game);
    const fake = fakeCard({tags: [Tag.BUILDING, Tag.BUILDING, Tag.BUILDING, Tag.BUILDING]});
    player.playedCards.push(fake);

    expect(player.terraformRating).to.eq(14);
    expect(card.getScore(player, turmoil, game)).eq(4);

    card.resolve(game);

    expect(player.terraformRating).to.eq(14);

    player.playedCards.push(fakeCard({tags: [Tag.BUILDING]}));
    expect(card.getScore(player, turmoil, game)).eq(5);

    card.resolve(game);

    expect(player.terraformRating).to.eq(15);

    player.playedCards.push(fakeCard({tags: [Tag.BUILDING, Tag.BUILDING, Tag.BUILDING, Tag.BUILDING]}));
    expect(card.getScore(player, turmoil, game)).eq(9);

    card.resolve(game);

    expect(player.terraformRating).to.eq(16);

    player.playedCards.push(fakeCard({tags: [Tag.BUILDING]}));
    expect(card.getScore(player, turmoil, game)).eq(10);

    card.resolve(game);

    expect(player.terraformRating).to.eq(18);
  });
});

import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {MarsFrontierAlliance} from '../../../src/server/cards/pathfinders/MarsFrontierAlliance';
import {addGreenery, cast, runAllActions, runNextAction} from '../../TestingUtils';
import {IPlayer} from '../../../src/server/IPlayer';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {SponsoredMohole} from '../../../src/server/cards/turmoil/SponsoredMohole';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {addOcean} from '../../TestingUtils';
import {Phase} from '../../../src/common/Phase';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {PolicyId} from '../../../src/common/turmoil/Types';
import {Game} from '../../../src/server/Game';

describe('MarsFrontierAlliance', () => {
  let card: MarsFrontierAlliance;
  let turmoil: Turmoil;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new MarsFrontierAlliance();
    [game, player] = testGame(1, {pathfindersExpansion: true, turmoilExtension: true});
    turmoil = game.turmoil!;
  });

  it('Asks for allied party at game start', () => {
    game.phase = Phase.INITIALDRAFTING;
    player.playCorporationCard(card);
    runAllActions(game);
    const selectParty = getWaitingFor(player);
    expect(selectParty.options).has.length(6);
  });

  it('New generation - switch of allied party', () => {
    player.corporations.push(card);
    game.generation = 10;

    const reds = game.turmoil!.getPartyByName(PartyName.REDS);
    const unity = game.turmoil!.getPartyByName(PartyName.UNITY);

    turmoil.sendDelegateToParty(player, reds.name, game);
    turmoil.sendDelegateToParty(player, reds.name, game);
    turmoil.sendDelegateToParty(player, reds.name, game);
    turmoil.sendDelegateToParty(player, unity.name, game);
    turmoil.sendDelegateToParty(player, unity.name, game);

    player.setAlliedParty(reds);

    game.phase = Phase.SOLAR;
    turmoil.endGeneration(game);
    runAllActions(game);

    const selectBonus: OrOptions = getWaitingFor(player);
    expect(selectBonus.options).has.length(2);
    player.process({type: 'or', index: 0, response: {type: 'option'}});
    expect(game.turmoil!.rulingParty).to.eq(reds);
    expect(player.alliedParty?.partyName).to.eq(unity.name);
  });

  it('A card having ruling party as requirement should be playable', () => {
    player.corporations.push(card);
    const sponsoredMohole = new SponsoredMohole();
    expect(sponsoredMohole.canPlay(player)).is.not.true;

    const kelvinists = game.turmoil!.getPartyByName(PartyName.KELVINISTS);
    player.setAlliedParty(kelvinists);
    expect(sponsoredMohole.canPlay(player)).is.true;
  });

  it('Passive effect from Unity policy', () => {
    player.corporations.push(card);
    game.phase = Phase.ACTION;
    const unity = game.turmoil!.getPartyByName(PartyName.UNITY);
    player.setAlliedParty(unity);
    expect(player.getTitaniumValue()).to.equal(4);

    const reds = game.turmoil!.getPartyByName(PartyName.REDS);
    const greens = game.turmoil!.getPartyByName(PartyName.GREENS);
    turmoil.sendDelegateToParty(player, reds.name, game);
    turmoil.sendDelegateToParty(player, reds.name, game);
    turmoil.sendDelegateToParty(player, greens.name, game);
    turmoil.sendDelegateToParty(player, greens.name, game);

    game.phase = Phase.SOLAR;
    turmoil.endGeneration(game);
    expect(player.getTitaniumValue()).to.equal(3);
  });

  it('Passive effect from Mars First party should be applied', () => {
    player.corporations.push(card);
    game.phase = Phase.ACTION;
    const marsFirst = game.turmoil!.getPartyByName(PartyName.MARS);
    player.setAlliedParty(marsFirst);
    player.steel = 0;
    const space = addOcean(player);
    const steelBonus = space.bonus.filter((b) => b === 1).reduce((a, b) => a+b);
    expect(player.steel).to.equal(1 + steelBonus);
  });

  it('Passive effect from Reds party should not be applied', () => {
    player.corporations.push(card);
    game.phase = Phase.ACTION;
    const reds = game.turmoil!.getPartyByName(PartyName.REDS);
    player.setAlliedParty(reds);
    player.megaCredits = 3;
    const tr = player.getTerraformRating();
    addOcean(player);
    runNextAction(game);
    expect(player.getTerraformRating()).to.equal(tr + 1);
    expect(player.megaCredits).to.equal(3);
    player.megaCredits = 0;
    addOcean(player);
    expect(player.getTerraformRating()).to.equal(tr + 2);
  });

  it('Passive effect from Greens party should be applied', () => {
    player.corporations.push(card);
    game.phase = Phase.ACTION;
    const greens = game.turmoil!.getPartyByName(PartyName.GREENS);
    player.setAlliedParty(greens);
    player.megaCredits = 0;
    addGreenery(player);
    expect(player.megaCredits).to.equal(4);
  });

  it('Active effect from Kelvinists party should not be applicable', () => {
    player.corporations.push(card);
    game.phase = Phase.ACTION;
    turmoil = game.turmoil!;
    const kelvinists = game.turmoil!.getPartyByName(PartyName.KELVINISTS);
    player.setAlliedParty(kelvinists);
    player.megaCredits = 10;
    const availableActions = player.getActions();
    const scientistsAction = availableActions.options.filter((o) => o.title === kelvinists.policies[0].description);
    expect(scientistsAction).to.be.empty;
  });

  it('Active effect from Scientists party should not be applicable', () => {
    player.corporations.push(card);
    game.phase = Phase.ACTION;
    turmoil = game.turmoil!;
    const scientists = game.turmoil!.getPartyByName(PartyName.SCIENTISTS);
    player.setAlliedParty(scientists);
    player.megaCredits = 10;
    const availableActions = player.getActions();
    const scientistsAction = availableActions.options.filter((o) => o.title === scientists.policies[0].description);
    expect(scientistsAction).to.be.empty;
  });

  it('Mars First test', () => {
    const marsFirst = turmoil.getPartyByName(PartyName.MARS);
    player.setAlliedParty(marsFirst);

    expect(player.alliedParty?.agenda.policyId).eq('mp01');

    player.alliedParty!.agenda.policyId = 'mfp01' as PolicyId;
    game = Game.deserialize(game.serialize());

    expect(player.alliedParty?.agenda.policyId).eq('mp01');
  });
});

function getWaitingFor(player: IPlayer): OrOptions {
  return cast(player.getWaitingFor(), OrOptions);
}

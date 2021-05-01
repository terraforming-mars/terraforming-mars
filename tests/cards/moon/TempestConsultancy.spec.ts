import {Game} from '../../../src/Game';
import {TempestConsultancy} from '../../../src/cards/moon/TempestConsultancy';
import {expect} from 'chai';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {SendDelegateToArea} from '../../../src/deferredActions/SendDelegateToArea';
import {Greens} from '../../../src/turmoil/parties/Greens';
import {TestingUtils} from '../../TestingUtils';

describe('TempestConsultancy', () => {
  let player: TestPlayer;
  let otherPlayer: TestPlayer;
  let game: Game;
  let card: TempestConsultancy;
  let turmoil: Turmoil;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    otherPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('id', [player, otherPlayer], player, TestingUtils.setCustomGameOptions());
    card = new TempestConsultancy();
    turmoil = game.turmoil!;
  });

  it('can act', () => {
    player.tagsForTest = {moon: 5};
    expect(card.canAct(player)).is.true;

    player.tagsForTest = {moon: 4};
    expect(card.canAct(player)).is.false;
  });

  it('action, 1 delegate', () => {
    player.tagsForTest = {moon: 5};
    expect(turmoil.getDelegatesInReserve(player.id)).eq(6);
    // This test is brittle - it assumes mars first will be orOptions[0]. But OK.
    const marsFirst = turmoil.getPartyByName(PartyName.MARS)!;
    expect(marsFirst.getDelegates(player.id)).eq(0);
    card.action(player);
    const action = player.game.deferredActions.pop() as SendDelegateToArea;
    const options = action.execute();
    options.cb(marsFirst.name);

    expect(turmoil.getDelegatesInReserve(player.id)).eq(5);
    expect(marsFirst.getDelegates(player.id)).eq(1);
  });

  it('action, 3 delegates', () => {
    player.tagsForTest = {moon: 16};
    expect(turmoil.getDelegatesInReserve(player.id)).eq(6);
    // This test is brittle - it assumes mars first will be orOptions[0]. But OK.
    const marsFirst = turmoil.getPartyByName(PartyName.MARS)!;
    expect(marsFirst.getDelegates(player.id)).eq(0);
    card.action(player);
    const action = player.game.deferredActions.pop() as SendDelegateToArea;
    const options = action.execute();
    options.cb(marsFirst.name);

    expect(turmoil.getDelegatesInReserve(player.id)).eq(3);
    expect(marsFirst.getDelegates(player.id)).eq(3);
  });

  it('new chairman', () => {
    player.corporationCard = card;
    turmoil.rulingParty = new Greens();
    turmoil.rulingParty.partyLeader = player.id;
    expect(player.getTerraformRating()).eq(20);

    turmoil.setRulingParty(game);
    game.deferredActions.runAll(() => {});

    expect(turmoil.chairman).eq(player.id);
    expect(player.getTerraformRating()).eq(22);
  });
});


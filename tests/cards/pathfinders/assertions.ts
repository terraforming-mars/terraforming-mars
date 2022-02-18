import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {DeferredAction} from '../../../src//deferredActions/DeferredAction';
import {SendDelegateToArea} from '../../../src//deferredActions/SendDelegateToArea';
import {SelectPartyToSendDelegate} from '../../../src//inputs/SelectPartyToSendDelegate';
import {TestingUtils} from '../../TestingUtils';
import {PlaceCityTile} from '../../../src/deferredActions/PlaceCityTile';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

export function assertSendDelegateToArea(player: Player, action: DeferredAction) {
  const sendDelegate = TestingUtils.cast(action, SendDelegateToArea);

  const game = player.game;
  const turmoil = game.turmoil!;
  const marsFirst = turmoil.getPartyByName(PartyName.MARS)!;

  const delegatesInReserve = turmoil.getAvailableDelegateCount(player.id, 'reserve');
  const delegatesInParty = marsFirst.getDelegates(player.id);

  const options = TestingUtils.cast(sendDelegate.execute(), SelectPartyToSendDelegate);
  options.cb(marsFirst.name);

  expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(delegatesInReserve - 1);
  expect(marsFirst.getDelegates(player.id)).eq(delegatesInParty + 1);
}

export function assertPlaceCityTile(player: Player, action: DeferredAction) {
  const placeCityTile = TestingUtils.cast(action, PlaceCityTile);
  const selectSpace = TestingUtils.cast(placeCityTile.execute(), SelectSpace);
  const space = selectSpace.availableSpaces[0];
  expect(space.tile).is.undefined;

  selectSpace.cb(space);

  expect(space.tile?.tileType).eq(TileType.CITY);
  expect(space.player?.id).eq(player.id);
}

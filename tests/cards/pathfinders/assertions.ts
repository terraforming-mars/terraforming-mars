import {expect} from 'chai';
import {Player} from '../../../src/server/Player';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {DeferredAction} from '../../../src/server//deferredActions/DeferredAction';
import {SendDelegateToArea} from '../../../src/server//deferredActions/SendDelegateToArea';
import {SelectPartyToSendDelegate} from '../../../src/server//inputs/SelectPartyToSendDelegate';
import {cast} from '../../TestingUtils';
import {PlaceCityTile} from '../../../src/server/deferredActions/PlaceCityTile';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';

export function assertSendDelegateToArea(player: Player, action: DeferredAction) {
  const sendDelegate = cast(action, SendDelegateToArea);

  const game = player.game;
  const turmoil = game.turmoil!;
  const marsFirst = turmoil.getPartyByName(PartyName.MARS)!;

  const delegatesInReserve = turmoil.getAvailableDelegateCount(player.id, 'reserve');
  const delegatesInParty = marsFirst.getDelegates(player.id);

  const options = cast(sendDelegate.execute(), SelectPartyToSendDelegate);
  options.cb(marsFirst.name);

  expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(delegatesInReserve - 1);
  expect(marsFirst.getDelegates(player.id)).eq(delegatesInParty + 1);
}

export function assertPlaceCityTile(player: Player, action: DeferredAction) {
  const placeCityTile = cast(action, PlaceCityTile);
  const selectSpace = cast(placeCityTile.execute(), SelectSpace);
  const space = selectSpace.availableSpaces[0];
  expect(space.tile).is.undefined;

  selectSpace.cb(space);

  expect(space.tile?.tileType).eq(TileType.CITY);
  expect(space.player?.id).eq(player.id);
}

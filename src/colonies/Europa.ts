import {Colony} from './Colony';
import {Resources} from '../common/Resources';
import {ColonyName} from '../common/colonies/ColonyName';
import {ColonyBenefit} from './ColonyBenefit';
import {ShouldIncreaseTrack} from '../common/colonies/ShouldIncreaseTrack';

export class Europa extends Colony {
  public name = ColonyName.EUROPA;
  public buildType = ColonyBenefit.PLACE_OCEAN_TILE;
  public tradeType = ColonyBenefit.GAIN_PRODUCTION;
  public override tradeResource = [
    Resources.MEGACREDITS, Resources.MEGACREDITS,
    Resources.ENERGY, Resources.ENERGY,
    Resources.PLANTS, Resources.PLANTS, Resources.PLANTS,
  ];
  public colonyBonusType = ColonyBenefit.GAIN_RESOURCES;
  public override colonyBonusResource = Resources.MEGACREDITS;
  public override shouldIncreaseTrack = ShouldIncreaseTrack.ASK;
}

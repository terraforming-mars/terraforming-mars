import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {ICardMetadata} from '../../../common/cards/ICardMetadata';
import {Player} from '../../Player';

export class SpecialDesignProxy implements IProjectCard {
  public get cost() {
    return 0;
  }
  public get tags() {
    return [];
  }
  public get name() {
    return CardName.SPECIAL_DESIGN_PROXY;
  }
  public get cardType() {
    return CardType.PROXY;
  }
  public canPlay() {
    return false;
  }
  public get metadata(): ICardMetadata {
    throw new Error('SpecialDesignProxy is a proxy card, not a real card. Should not render');
  }
  public play() {
    return undefined;
  }
  public resourceCount: number = 0;

  public getVictoryPoints() {
    return 0;
  }
  public getRequirementBonus(player: Player) {
    // NOTE: normally code looks like 'if player.lastCardPlayed === this.name` but
    // not in this case.
    if (player.lastCardPlayed === CardName.SPECIAL_DESIGN) {
      return 2;
    }
    return 0;
  }
}

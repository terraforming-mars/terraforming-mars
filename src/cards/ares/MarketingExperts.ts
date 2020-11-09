import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';

export class MarketingExperts implements IProjectCard {
  public cost = 5;
  public tags = [Tags.EARTH];
  public cardType = CardType.ACTIVE;
  public name = CardName.MARKETING_EXPERTS;

  public play(player: Player, _game: Game) {
    player.addProduction(Resources.MEGACREDITS, 1);
    return undefined;
  }
}

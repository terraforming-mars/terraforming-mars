import {Card} from '../Card';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CorporationCard} from './CorporationCard';
import {ISpace} from '../../boards/ISpace';
import {SpaceBonus} from '../../SpaceBonus';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';

export class MiningGuild extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.MINING_GUILD,
      tags: [Tags.BUILDING, Tags.BUILDING],
      startingMegaCredits: 30,

      metadata: {
        cardNumber: 'R24',
        description: 'You start with 30 MC, 5 steel and 1 steel production.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(30).nbsp.steel(5).digit.nbsp.productionBox((pb) => pb.steel(1));
          b.corpBox('effect', (ce) => {
            ce.effectBox((eb) => {
              eb.steel(1).asterix().slash().titanium(1).asterix();
              eb.startEffect.productionBox((pb) => pb.steel(1));
              eb.description('Effect: Each time you get any steel or titanium as a placement bonus on the map, increase your steel production 1 step.');
            });
          });
        }),
      },
    });
  }
  public onTilePlaced(player: Player, space: ISpace) {
    if (
      player.isCorporation(this.name) &&
            space.player === player &&
            (space.bonus.indexOf(SpaceBonus.STEEL) !== -1 || space.bonus.indexOf(SpaceBonus.TITANIUM) !== -1)) {
      player.addProduction(Resources.STEEL);
    }
  }
  public play(player: Player) {
    player.steel = 5;
    player.addProduction(Resources.STEEL);
    return undefined;
  }
}

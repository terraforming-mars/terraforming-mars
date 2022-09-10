import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Player} from '../../Player';
import {Tag} from '../../../common/cards/Tag';
import {IActionCard} from '../ICard';
import {Resources} from '../../../common/Resources';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class Factorum extends Card implements IActionCard, ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.FACTORUM,
      tags: [Tag.ENERGY, Tag.BUILDING],
      startingMegaCredits: 37,

      behavior: {
        production: {steel: 1},
      },

      metadata: {
        cardNumber: 'R22',
        description: 'You start with 37 M€. Increase your steel production 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(37).nbsp.production((pb) => pb.steel(1));
          b.corpBox('action', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.action('Increase your energy production 1 step IF YOU HAVE NO ENERGY RESOURCES, or spend 3M€ to draw a building card.', (eb) => {
              eb.empty().arrow().production((pb) => pb.energy(1));
              eb.or().megacredits(3).startAction.cards(1, {secondaryTag: Tag.BUILDING});
            });
          });
        }),
      },
    });
  }

  public canAct(player: Player): boolean {
    return player.energy === 0 || player.canAfford(3);
  }

  public action(player: Player) {
    const increaseEnergy = new SelectOption(
      'Increase your energy production 1 step',
      'Increase production',
      () => {
        player.production.add(Resources.ENERGY, 1, {log: true});
        return undefined;
      },
    );

    const drawBuildingCard = new SelectOption('Spend 3 M€ to draw a building card', 'Draw card', () => {
      player.payMegacreditsDeferred(
        3,
        'Select how to pay for Factorum action.',
        () => player.drawCard(1, {tag: Tag.BUILDING}));
      return undefined;
    });

    if (player.energy > 0) return drawBuildingCard;
    if (!player.canAfford(3)) return increaseEnergy;

    return new OrOptions(increaseEnergy, drawBuildingCard);
  }
}

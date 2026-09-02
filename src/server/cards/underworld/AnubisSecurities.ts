import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {PlayProjectCard} from '../../deferredActions/PlayProjectCard';
import {Resource} from '../../../common/Resource';
import {all} from '../Options';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class AnubisSecurities extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.ANUBIS_SECURITIES,
      tags: [Tag.EARTH],
      startingMegaCredits: 42,
      initialActionText: 'Play a card, ignoring global requirements',

      metadata: {
        cardNumber: 'UC11',
        description: 'You start with 42 M€. As your first action, play a card ignoring global requirements.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(42).projectRequirements().br;
          b.effect('When any player WITH THE LOWEST CORRUPTION increases their TR by 1, they gain 2 M€.', (eb) => {
            eb.tr(1, {all}).text('Min.').corruption(1).asterix().startEffect.megacredits(2, {all});
          }).br;
          b.action('Discard ALL of your corruption and gain 6 M€ for each unit discarded.', (ab) => {
            ab.text('X').corruption(1).asterix().startAction.megacredits(6).text('X');
          });
        }),
      },
    });
  }

  private inInitialAction = false;

  public override getGlobalParameterRequirementBonus(_player: IPlayer): number {
    if (this.inInitialAction === true) {
      // Magic number high enough to always ignore requirements.
      return 50;
    }
    return 0;
  }

  public override initialAction(player: IPlayer) {
    this.inInitialAction = true;
    player.game.defer(new PlayProjectCard(player).andThen(() => {
      this.inInitialAction = false;
    }));
    return undefined;
  }

  public onIncreaseTerraformRatingByAnyPlayer(_cardOwner: IPlayer, player: IPlayer, steps: number) {
    const lowestCorruption = player.game.players.map((p) => p.underworldData.corruption).reduce((a, b) => Math.min(a, b));
    if (player.underworldData.corruption !== lowestCorruption) {
      return;
    }
    const money = steps * 2;
    player.stock.add(Resource.MEGACREDITS, money, {log: true, from: {card: this}});
  }

  public canAct(player: IPlayer): boolean {
    return player.underworldData.corruption > 0;
  }

  public action(player: IPlayer) {
    const corruption = player.underworldData.corruption;
    const money = corruption * 6;
    player.stock.add(Resource.MEGACREDITS, money);
    player.underworldData.corruption = 0;
    player.game.log('${0} discarded ${1} corruption and gained ${2} M€', (b) => {
      b.player(player).number(corruption).number(money);
    });
  }
}

import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {PlayProjectCard} from '../../deferredActions/PlayProjectCard';
import {Resource} from '../../../common/Resource';
import {all} from '../Options';
import {Size} from '../../../common/cards/render/Size';
import {Priority} from '../../deferredActions/Priority';

export class AnubisSecurities extends CorporationCard {
  constructor() {
    super({
      name: CardName.ANUBIS_SECURITIES,
      tags: [Tag.MARS],
      startingMegaCredits: 42,
      initialActionText: 'Play a card, ignoring global requirements',

      metadata: {
        cardNumber: 'UC11',
        description: 'You start with 42 M€. As your first action, play a card ignoring global requirements.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(42).projectRequirements().br;
          b.effect('When any player increases their TR by 1, they gain 2 M€.', (eb) => {
            eb.tr(1, {all}).startEffect.megacredits(2, {all});
          }).br;
          b.text('-X').corruption(1).megacredits(1, {text: '6X'}).asterix().br;
          b.text('Y').corruption(1, {all}).colon().plainText('PAYS').megacredits(1, {text: 'Y'}).or(Size.TINY).tr(1, {size: Size.TINY}).asterix().br;
          b.plainText('(At the end of the production phase, discard all your corruption and gain 6 M€ for each unit discarded. ' +
            'Then, each player must pay you 1 M€ per unit of corruption they have. If no one has any, gain 1 TR instead.)').br;
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

  public initialAction(player: IPlayer) {
    this.inInitialAction = true;
    player.game.defer(new PlayProjectCard(player).andThen(() => {
      this.inInitialAction = false;
    }));
    return undefined;
  }

  public onIncreaseTerraformRating(player: IPlayer, _cardOwner: IPlayer, steps: number) {
    const money = steps * 2;
    player.stock.add(Resource.MEGACREDITS, money);
    player.game.log('${0} gained ${1} M€ from the ${2} corp effect', (b) => b.player(player).number(money).card(this));
  }

  public onProductionPhase(player: IPlayer) {
    player.defer(() => {
      const corruption = player.underworldData.corruption;
      const money = corruption * 6;
      if (money > 0) {
        player.stock.megacredits += money;
        player.game.log('${0} discarded ${1} corruption and gained ${2} M€', (b) => b.player(player).number(corruption).number(money));
        player.underworldData.corruption = 0;
      }

      let anyCorruptOpponents = false;
      for (const opponent of player.game.getPlayersInGenerationOrder()) {
        if (opponent === player) {
          continue;
        }
        const corruption = opponent.underworldData.corruption;
        if (corruption > 0) {
          anyCorruptOpponents = true;
          opponent.stock.steal(Resource.MEGACREDITS, corruption, player, {log: false});
          player.game.log('${0} was paid ${1} M€ from ${2}', (b) => b.player(player).number(corruption).player(opponent));
        }
      }
      if (!anyCorruptOpponents) {
        player.increaseTerraformRating(1);
        player.game.log('${0} gained 1 TR since no opponent had any corruption', (b) => b.player(player));
      }
      return undefined;
    }, Priority.BACK_OF_THE_LINE);
  }
}

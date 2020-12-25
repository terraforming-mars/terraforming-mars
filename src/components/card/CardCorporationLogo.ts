import Vue from 'vue';
import {CardName} from '../../CardName';
export const CardCorporationLogo = Vue.component('CardCorporationLogo', {
  props: {
    title: {
      type: String as () => CardName,
      required: true,
    },
  },
  methods: {
    getHtmlContent: function(): string {
      const title: CardName = this.title;
      let result: string = '';
      // TODO(chosta): refactor to include only the exceptions and DRY the code
      if (title === CardName.APHRODITE) {
        result += '<div class="card-aphrodite-logo">APHRODITE</div>';
      } else if (title === CardName.ARKLIGHT) {
        result += '<div class="card-arklight-logo">ARKLIGHT</div>';
      } else if (title === CardName.POSEIDON) {
        result += '<div class="card-poseidon-logo">POSEIDON</div>';
      } else if (title === CardName.SATURN_SYSTEMS) {
        result += '<div class="card-saturn-logo">';
        result += 'SATURN <span style="font-size:20px;display:inline-block;">&#x25CF;</span> SYSTEMS';
        result += '</span>';
      } else if (title === CardName.CELESTIC) {
        result += '<div class="card-celestic-logo">';
        result += '<span style="background: linear-gradient(to right, rgb(251,192,137),rgb(251,192,137),rgb(23,185,236));padding-left: 5px;">CEL</span>';
        result += '<span style="background:linear-gradient(to right,rgb(23,185,236),rgb(251,192,137))">ES</span>';
        result += '<span style="background:rgb(251,192,137);padding-right:5px;">TIC</span>';
        result += '</div>';
      } else if (title === CardName.MORNING_STAR_INC) {
        result += '<div class="card-morning-star-logo">MORNING STAR INC.</div>';
      } else if (title === CardName.PRISTAR) {
        result += '<div class="card-pristar-logo">PRISTAR</div>';
      } else if (title === CardName.CHEUNG_SHING_MARS) {
        result += '<div class="card-cheung-shing-logo">';
        result += '<span style="color:red;border:4px solid red;border-radius:50%;padding:3px 5px 3px 5px;font-size:30px;line-height:14px;box-shadow: 3px 3px 3px grey, inset 0 0 3px 3px grey;text-shadow: 3px 3px 3px grey;">㨐</span></div>';
        result += '<div style="display: inline-block; width:140px; font-size:19px; line-height: 22px; vertical-align: middle; margin-bottom: 15px;font-weight:normal;">';
        result += '&nbsp;Cheung Shing <br><div style="margin-left:10px"> ■■MARS■■ </div>';
        result += '</div>';
      } else if (title === CardName.CREDICOR) {
        result += '<div class="card-credicor-logo">CREDICOR</div>';
      } else if (title === CardName.ECOLINE) {
        result += '<div class="card-ecoline-logo">ecoline</div>';
      } else if (title === CardName.HELION) {
        result += '<div class="card-helion-logo">helion</div>';
      } else if (title === CardName.INTERPLANETARY_CINEMATICS) {
        result += '<div style="color: #020202;font-size:17px;margin-top:10px;margin-left:-87px;">INTERPLANETARY</div>';
        result += '<div style="height:5px;margin-top:-2px;width:143px;background:linear-gradient(to right,yellow,black,yellow,black,yellow);border:5px solid #cc3333;box-shadow:3px 3px 6px grey;"></div>';
        result += '<div style="color: #020202;font-size:24px;margin-left:-89px;margin-top:-5px; display:inline-block; -webkit-transform:scale(0.5,1); -moz-transform:scale(0.5,1); -ms-transform:scale(0.5,1); -o-transform:scale(0.5,1); transform:scale(1,0.5); margin-bottom:15px;">CINEMATICS</div>';
      } else if (title === CardName.INVENTRIX) {
        result += '<span class="card-inventrix-logo">';
        result += '<span style="color: #020202;background-color:#6bb5c7;padding-left:4px;padding-right:4px;font-size:26px;box-shadow: 6px 6px 10px grey;">X</span>';
        result += 'INVENTRIX</span>';
      } else if (title === CardName.PHOBOLOG) {
        result += '<span class="card-phobolog-logo">PHOBOLOG</span>';
      } else if (title === CardName.POINT_LUNA) {
        result += '<span class="card-luna-logo">POINT LUNA</span>';
      } else if (title === CardName.POLYPHEMOS) {
        result += '<span class="card-polyphemos-logo">POLYPHEMOS</span>';
      } else if (title === CardName.SEPTUM_TRIBUS) {
        result += '<span class="card-septem-tribus-logo">Septem Tribus</span>';
      } else if (title === CardName.TERRALABS_RESEARCH) {
        result += '<div style="font-size: 13px;left:32px;top:10px;font-family:Prototype;color:#222;transform:scale(2,1);position:absolute;">TERRALABS</div>';
        result += '<div style="position:absolute;top:28px;left:46px;font-size:8px;letter-spacing:2px;font-family:Prototype;transform:scale(2,1)">RESEARCH</div>';
      } else if (title === CardName.THORGATE) {
        result += '<span class="card-thorgate-logo">THORGATE</span>';
      } else if (title === CardName.VIRON) {
        result += '<span class="card-viron-logo">VIRON</span>';
      } else if (title === CardName.ARIDOR) {
        result += '<span class="card-aridor-logo">ARIDOR</span>';
      } else if (title === CardName.ASTRODRILL) {
        result += '<span class="card-astrodril-logo">Astrodrill</span>';
      } else if (title === CardName.FACTORUM) {
        result += '<span class="card-factorum-logo">FACTORUM</span>';
      } else if (title === CardName.MANUTECH) {
        result += '<span class="card-manutech-logo"><span style="color:white;background:#e63900;text-shadow:none;padding-left:2px;">MA</span>NUTECH</span>';
      }

      return result;
    },
  },
  template: `
      <div class="card-corporation-logo" v-html="getHtmlContent()"></div>
  `,
});

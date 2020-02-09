import Vue from "vue";

export const Colony = Vue.component("colony", {
    props: [
        "colony"
    ],
    template: `
    <div class="filterDiv colony-card colonies" style="
    background-image: url('./assets/europa.png');
    background-position: bottom 5px right 10px;
    box-shadow: inset 0 0 1px 3px rgb(150,150,150), 0 0 30px 15px black;
    ">
    <div class="colony-card-title-div">
      <span class="colony-card-title-span" style=" text-transform: uppercase; background: linear-gradient(to right, rgb(150,150,150), rgba(0,0,0,0));">{{colony.name}}</span>
    </div>
    <div class="colony-content">
      <div class="resource plant"></div>
      <span class="colony-background-color">
        Colony Bonus
        </span><br>
      <div class="resource plant" style="margin-left:20px;"></div><div class="white-x"></div>
      <span class="colony-background-color">
        Trade Income
    </span>
    <div class="colony-grid-container">
      <div><div class="production-box"><div class="production plant"></div></div></div>
      <div><div class="production-box"><div class="production plant"></div></div></div>
      <div><div class="production-box"><div class="production plant"></div></div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div class="colony-grid-container2">
      <div>0</div>
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div>
    </div>
    </div>
    `
});
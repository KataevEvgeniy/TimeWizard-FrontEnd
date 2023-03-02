<template>
  <div class="background">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style scoped lang="scss">
.background {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: -100;
}

span{
  position: absolute;
}
$animationDuration: 90s;
$amount: 20;
.background span {
  z-index: -100;
  backface-visibility: hidden;

  animation-name: move;
  animation-duration: $animationDuration;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  $colors: (
      rgb(255, 101, 47,0.3)
      rgb(255, 228, 0,0.3)
      rgb(20, 167, 108,0.3)
  );
  @for $i from 1 through $amount {
    &:nth-child(#{$i}) {
      $particleSize: (20 + random(80)) * 1vmin;
      width: $particleSize;
      height: $particleSize;
      border-radius: $particleSize;
      color: nth($colors, random(length($colors)));
      top: random(100) * 1%;
      left: random(100) * 1%;
      animation-duration: (random($animationDuration * 10) / 10) * 1s + 10s;
      animation-delay: random(($animationDuration + 10s) * 10) / 10 * -1s;
      transform-origin: (random(50) - 25) * 1vw (random(50) - 25) * 1vh;
      $x: if(random() > 0.5, -1, 1);
      box-shadow: ($particleSize * 2 * $x) 0 ;
    }
  }
}

@keyframes move {
  100% {
    transform: translate3d(0, 0, 1px) rotate(360deg);
  }
}
</style>
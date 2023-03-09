<template>
  <div>
    <div id="clock_donut" ></div>
  </div>
</template>

<script>
import Konva from "konva";
import {mapGetters} from 'vuex';

export default {
  data() {
    return {}
  },
  mounted() {
    this.drawDonut(this.$store.getters.taskInThisDay)
  },
  computed: {
    ...mapGetters(['taskInThisDay'])
  },
  watch: {
    taskInThisDay() {
      this.drawDonut(this.$store.getters.taskInThisDay)
    }
  },
  methods: {
    drawDonut(dates) {
      let canvas = document.getElementById("clock_donut");

      var resizeTimer;
      function resizeStage() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          let standard = canvas.children[0].children[0].style.width;
          let size = parseInt(standard) > window.innerWidth ? window.innerWidth : parseInt(standard);
          canvas.children[0].style.height = size+'px';
          canvas.children[0].style.width = size+'px';
          canvas.children[0].children[0].style.height = size+'px';
          canvas.children[0].children[0].style.width = size+'px';
        }, 500);
      }
      window.addEventListener('resize', resizeStage);

      let inputDates = [];
      let selectedDay = this.$store.getters.selectedDay.startDateTime;

      //let inputDates = [{start:50,end:70},{start:400,end:500},{start:60,end:65},{start:500,end:700},{start:1,end:30},{start:40,end:80},{start:1000,end:1100},{start:900,end:1440}]
      dates.forEach(function (date) {
        let startInMinutes = date.startDate < selectedDay ? 0 : new Date(date.startDate).getHours() * 60 + new Date(date.startDate).getMinutes();
        let endInMinutes = (date.endDate - selectedDay) > 86400000 ? 1440 : new Date(date.endDate).getHours() * 60 + new Date(date.endDate).getMinutes();
        inputDates.push({date: date, start: startInMinutes, end: endInMinutes})
      })


      inputDates.sort((a, b) => a.start - b.start);
      let sortedDatesForSircle = sortSircle(inputDates);

      function sortSircle(inputArr) {
        let arraysForAllRing = []
        while (inputArr.length > 0) {
          let arrayForSingleRing = []
          for (let i = 0, lastEnd = 0; i < inputArr.length; i++) {
            if (inputArr[i].start >= lastEnd) {
              lastEnd = inputArr[i].end;
              arrayForSingleRing.push(inputArr[i]);
              inputArr.splice(i, 1);
            }
          }
          arraysForAllRing.push(arrayForSingleRing)
        }
        return arraysForAllRing;
      }


      let stage = new Konva.Stage({
        container: canvas,
        width: (sortedDatesForSircle.length*30+70)*2 + 60,
        height: (sortedDatesForSircle.length*30+70)*2 + 60
      });

      let layer = new Konva.Layer();

      const arrow = new Konva.Arrow({
        points: [0, -45, 0, -65], // x1, y1, x2, y2
        stroke: 'white',
        x: stage.width() / 2,
        y: stage.height() / 2,
        rotation: 0,
        strokeWidth: 3
      });
      layer.add(arrow);

      function setRotation() {
        let minutes = new Date().getHours() * 60 + new Date().getMinutes();
        arrow.rotation(minutes * 0.25);
        layer.draw();
      }

      setInterval(setRotation(), 60000);

      let timeText = new Konva.Text({
        x: 10,
        y: 10,
        fontSize: 20,
        fontFamily: 'Arial',
        fill: 'white',
        align: 'center',
        width: 100,
      });
      timeText.x(stage.width() / 2 - timeText.width() / 2)
      timeText.y(stage.height() / 2 - timeText.height() / 2)

      function setTimeText() {
        let date = new Date();
        let hours = new Date().getHours();
        let minutes = date.getMinutes();
        timeText.text(hours + ':' + minutes);
        layer.batchDraw();
      }

      setInterval(setTimeText(), 60000);
      layer.add(timeText);
      if(sortedDatesForSircle.length === 0){
        let arcBackground = new Konva.Arc({
          x: stage.width() / 2,
          y: stage.height() / 2,
          innerRadius: 70,
          outerRadius: 100,
          angle: 360,
          fill: "rgb(189,189,189,0.1)",
          stroke: 'rgb(0,0,0,0.1)',
          strokeWidth: 2,
          cornerRadius: 20,
          rotation: -90,
        });
        layer.add(arcBackground)
      }

      for (let i = 0; i < sortedDatesForSircle.length; i++) {
        let arcBackground = new Konva.Arc({
          x: stage.width() / 2,
          y: stage.height() / 2,
          innerRadius: 70 + i * 30,
          outerRadius: 100 + i * 30,
          angle: 360,
          fill: "rgb(189,189,189,0.1)",
          stroke: 'rgb(0,0,0,0.1)',
          strokeWidth: 2,
          cornerRadius: 20,
          rotation: -90,
        });
        layer.add(arcBackground)
        sortedDatesForSircle[i].forEach(function (data) {
          let arc = new Konva.Arc({
            x: stage.width() / 2,
            y: stage.height() / 2,
            innerRadius: 70 + i * 30,
            outerRadius: 100 + i * 30,
            angle: (data.end - data.start) / 4,
            fill: data.date.colorInHex,
            stroke: 'black',
            strokeWidth: 2,
            cornerRadius: 20,
            rotation: data.start / 4 - 90,
          });

          arc.on('mouseover', function (event) {
            let tooltip = new Konva.Label({
              x: event.evt.offsetX,
              y: event.evt.offsetY,
              opacity: 0.75
            });

            tooltip.add(new Konva.Tag({
              fill: 'black'
            }));

            tooltip.add(new Konva.Text({
              text: data.date.title + "\n" +
                  Math.floor(data.start / 60).toString().padStart(2, "0") + ":" + (data.start % 60).toString().padStart(2, "0")
                  + " - " + Math.floor(data.end / 60).toString().padStart(2, "0") + ":" + (data.end % 60).toString().padStart(2, "0"),
              fontFamily: 'Calibri',
              fontSize: 18,
              padding: 5,
              fill: 'white'

            }));

            layer.add(tooltip);
            layer.draw();
          });

          arc.on('mouseout', function () {
            layer.find('Label')[0].remove();
            layer.draw();
          });

          arc.on('click', function () {
            document.getElementById(data.date.id).scrollIntoView({behavior: 'smooth', block: 'start'})
          });
          layer.add(arc);
        })
      }
      stage.add(layer);
      console.log(window.innerWidth)
      let standard = canvas.children[0].children[0].style.width;
      let size = parseInt(standard) > window.innerWidth ? window.innerWidth : parseInt(standard);
      canvas.children[0].style.height = size+'px';
      canvas.children[0].style.width = size+'px';
      canvas.children[0].children[0].style.height = size+'px';
      canvas.children[0].children[0].style.width = size+'px';
    }
  }
}
</script>

<style></style>
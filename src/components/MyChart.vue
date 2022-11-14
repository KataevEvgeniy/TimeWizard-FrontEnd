<template>
  <Doughnut 
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="chartId"
    :dataset-id-key="datasetIdKey"
    
    
  />
  <button @click="tio">нажми{{}}</button>
</template>

<script>
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, registerables} from 'chart.js'

ChartJS.register(...registerables)

export default {
  name: 'BarChart',
  components: { Doughnut },
  props: {
    chartId: {
      type: String,
      default: 'bar-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    }  
  },
  data() {
    return{
      number2: 2,
      chartData: {
        labels: [ ],
        datasets: [ { 
          data: [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
          backgroundColor: ['rgba(32,178,170,0.3)'],

          } ]
      },
      chartOptions: {
        responsive: true
      },
      
    }
  },
  methods: {
    tio () {
      this.number2 += 2;
      this.chartData.datasets = [ { 
          data: [this.number2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
          backgroundColor: ['rgba(32,178,170,0.3)'],

          } ];
    }
  }
}
</script>
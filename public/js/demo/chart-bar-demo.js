// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

function newBarChart(ele, labels, yData1, yData2, yLabel1, yLabel2) {
  new Chart(ele, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        yAxisID: 'y-axis-1',
        label: yLabel1,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(2,117,216,1)",
        data: yData1,
      },{
        yAxisID: 'y-axis-2',
        label: yLabel2,
        backgroundColor: "rgba(2,117,216,1)",
        borderColor: "rgba(2,117,216,1)",
        data: yData2,
      }],
    },
    options: {
      responsive: true,
      scales: {
        // xAxes: [{
        //   time: {
        //     unit: 'month'
        //   },
        //   gridLines: {
        //     display: false
        //   },
        //   ticks: {
        //     maxTicksLimit: 6
        //   }
        // }],
        yAxes: [{
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'left',
          id: 'y-axis-1',
          ticks: {
            stepSize: 1
          }
        }, {
          type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: 'right',
          id: 'y-axis-2',
          ticks: {
            stepSize: 1
          },
          gridLines: {
            drawOnChartArea: false
          }
        }],
      },
      legend: {
        display: true
      }
    }
  });
}

// Bar Chart Example
// var ctx = document.getElementById("myBarChart");
// var myLineChart = new Chart(ctx, {
//   type: 'bar',
//   data: {
//     labels: ["January", "February", "March", "April", "May", "June"],
//     datasets: [{
//       yAxisID: 'y-axis-1',
//       label: "Revenue",
//       backgroundColor: "rgb(255, 99, 132)",
//       borderColor: "rgba(2,117,216,1)",
//       data: [4215, 5312, 6251, 7841, 9821, 14984],
//     },{
//       yAxisID: 'y-axis-2',
//       label: "Revenue2",
//       backgroundColor: "rgba(2,117,216,1)",
//       borderColor: "rgba(2,117,216,1)",
//       data: [4215, 5312, 6251, 7841, 9821, 5000],
//     }],
//   },
//   options: {
//     responsive: true,
//     scales: {
//       // xAxes: [{
//       //   time: {
//       //     unit: 'month'
//       //   },
//       //   gridLines: {
//       //     display: false
//       //   },
//       //   ticks: {
//       //     maxTicksLimit: 6
//       //   }
//       // }],
//       yAxes: [{
//         type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
//         display: true,
//         position: 'left',
//         id: 'y-axis-1',
//       }, {
//         type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
//         display: true,
//         position: 'right',
//         id: 'y-axis-2',
//         gridLines: {
//           drawOnChartArea: false
//         }
//       }],
//     },
//     legend: {
//       display: true
//     }
//   }
// });

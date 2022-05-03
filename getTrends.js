import googleTrends from 'google-trends-api';
import fs from 'fs';
// import ChartJSImage from 'chart.js-image';
import randomColor from './randomColor.js';

export default function(keywords = ['dziady', 'lalka', 'pan tadeusz', 'wesele']) {
  return new Promise(function(resolve, reject) {
    let dataObject = {
      keywords: []
    }
    for (let keyword of keywords) {
      dataObject.keywords.push(keyword)
    }
    googleTrends.interestOverTime({
      keyword: keywords,
      startTime: new Date(Date.now() - (1000 * 60 * 15)),
      endTime: new Date(Date.now()),
      geo: 'PL',
      h1: 'polish',
      timezone: 2,
      granularTimeResolution: true
    }).then(async (results) => {
      results = JSON.parse(results);
      dataObject.data = results.default.timelineData;
      dataObject.averages = results.default.averages;
      dataObject.monotony = {
        min: [],
        max: [],
        difference: []
      }
      dataObject.chart = []
      for (let x = 0; x < keywords.length; x++) {
        dataObject.monotony.min.push(100);
        dataObject.monotony.max.push(0);
        dataObject.monotony.difference.push(0);
        // dataObject.chart.push([]);
      }
      let values = dataObject.data
      let chartPoints = Math.floor(values.length / 8);
      for (let x = 0; x < values.length; x++) {
        for (let y = 0; y < keywords.length; y++) {
          if (x % chartPoints == 0) {
            // console.log(x);
            // console.log(chartPoints);
            // dataObject.chart[x].push(values[x].value[y]);
          }
          if (x == 0) {
            dataObject.monotony.difference[y] = values[x].value[y];
          }
          if (values[x].value[y] < dataObject.monotony.min[y]) {
            dataObject.monotony.min[y] = values[x].value[y];
          }
          if (values[x].value[y] > dataObject.monotony.max[y]) {
            dataObject.monotony.max[y] = values[x].value[y];
          }
          if (x == keywords.length - 1) {
            let firstValue = dataObject.monotony.difference[y];
            let diff = values[x].value[y] - firstValue;
            dataObject.monotony.difference[y] = diff;
          }
        }
      }
      // fs.writeFileSync('response.json', JSON.stringify(dataObject));
      // console.log(dataObject.chart);
      let resolveObject = {
        keywords,
        avg: dataObject.averages,
        min: dataObject.monotony.min,
        max: dataObject.monotony.max,
        diff: dataObject.monotony.difference
      }
      console.log(resolveObject);
      resolve(resolveObject);
    }).catch(err => {
      reject(err);
    })
  })
}

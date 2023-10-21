import React from "react";
import { Chart } from "react-google-charts";

import ScatterChart from "./ScatterChart";

export const data = [
  ['Task', 'Hours per Day'],
  ['Work', 11],
  ['Eat', 2],
  ['Commute', 2],
  ['Watch TV', 2],
  ['Sleep', 7],
]

export const options = {
  title: 'My Daily Activities',
}

const GraphList = () => {
  return (
    <>
      <Chart chartType="PieChart" data={data} options={options} width="100%" height="400px" />
	  <ScatterChart />
    </>
  )
}

export default GraphList

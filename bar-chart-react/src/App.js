import BarChart from "./components/BarChart/BarChart";
import { useState } from "react";

const initialData = [
  { year: 1000, population: 400000 },
  { year: 1750, population: 800000 },
  { year: 1850, population: 1262000 },
  { year: 1900, population: 1656000 },
  { year: 1950, population: 2518629 },
  { year: 1955, population: 2755823 },
  { year: 1960, population: 3021475 },
  { year: 1965, population: 3334874 },
  { year: 1970, population: 3692492 },
  { year: 1975, population: 4068109 },
  { year: 1980, population: 4434682 },
  { year: 1985, population: 4830979 },
  { year: 1990, population: 5263593 },
  { year: 1995, population: 5674380 },
  { year: 2000, population: 6070581 },
  { year: 2005, population: 6343628 },
  { year: 2013, population: 7162119 },
];

function App() {
  const [showBarChartComponent, setShowBarChartComponent] = useState(true);
  const [chartData, setChartData] = useState(initialData);

  const handleButtonAddBar = () => {
    const newChartData = [
      ...chartData,
      {
        year: chartData[chartData.length - 1].year + 1,
        population: chartData[chartData.length - 1].population * 1.011,
      },
    ];
    setChartData(newChartData);
  };
  const handleButtonRemoveBar = () => {
    const newChartData = [...chartData.slice(0, chartData.length - 1)];
    setChartData(newChartData);
  };

  return (
    <>
      <button onClick={() => setShowBarChartComponent(!showBarChartComponent)}>Mount/Unmount BarChart component</button>
      <button onClick={handleButtonAddBar}>Add bar</button>
      <button onClick={handleButtonRemoveBar}>Remove bar</button>
      {showBarChartComponent && <BarChart data={chartData} />}
    </>
  );
}

export default App;

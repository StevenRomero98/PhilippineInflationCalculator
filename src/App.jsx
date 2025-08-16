import React from 'react'
import InflationCalculator from './components/InflationCalculator'
import InflationTable from './components/InflationTable'

export default function App(){
  return (
    <div className="app">
      <h1>Philippine Inflation Calculator</h1>
      <p className="lead">Estimate how much an amount from a past year would cost in another year using average annual inflation.</p>
      <InflationCalculator />
      <InflationTable />
    </div>
  )
}

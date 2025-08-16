import React, { useMemo } from 'react'
import inflationData from '../data/inflation_by_year.json'

// Render the inflation data with latest year on top and the rest in 3 columns.
// Use a small grid inside each cell so year and rate align neatly.
export default function InflationTable() {
	const items = useMemo(() =>
		Object.keys(inflationData)
			.map((y) => [parseInt(y, 10), inflationData[y]])
			.filter(([y]) => Number.isFinite(y))
			.sort((a, b) => b[0] - a[0]),
		[]
	)

	if (items.length === 0) return null

	const [latestYear, latestRate] = items[0]
	const remaining = items.slice(1)
	const colsCount = 3
	const rowsCount = Math.ceil(remaining.length / colsCount)

	const rows = []
	for (let r = 0; r < rowsCount; r++) {
		const row = []
		for (let c = 0; c < colsCount; c++) {
			const index = c * rowsCount + r
			row.push(remaining[index] || null)
		}
		rows.push(row)
	}

	// compute year-over-year deltas
	const deltaMap = {}
	for (let i = 0; i < items.length; i++) {
		const [y, rate] = items[i]
		const prev = items[i + 1]
		deltaMap[y] = prev ? (typeof rate === 'number' && typeof prev[1] === 'number' ? rate - prev[1] : null) : null
	}

	return (
		<div className="inflation-table-wrap">
			<h2>Average inflation by year</h2>
			<table className="inflation-table">
				<tbody>
					<tr className="top-row">
						<td className={`top-year ${deltaMap[latestYear] != null ? (deltaMap[latestYear] > 0 ? 'increase' : 'decrease') : ''}`} colSpan={3}>
							<div className="cell-grid">
								<div className="year">{latestYear}</div>
								<div className="rate">{typeof latestRate === 'number' ? `${latestRate}%` : '—'}</div>
												{deltaMap[latestYear] != null && (
													<div className={`delta ${deltaMap[latestYear] > 0 ? 'increase' : 'decrease'}`}>
														{deltaMap[latestYear] > 0 ? '+' : '−'}{Math.abs(deltaMap[latestYear]).toFixed(2)} compared to last year
													</div>
												)}
							</div>
						</td>
					</tr>

					{rows.map((cols, rIdx) => (
						<tr key={rIdx}>
							{cols.map((cell, cIdx) => (
								<td key={cIdx}>
									{cell ? (
										<div className="cell-grid">
											<div className="year">{cell[0]}</div>
											<div className="rate">{typeof cell[1] === 'number' ? `${cell[1]}%` : '—'}</div>
											{deltaMap[cell[0]] != null && (
												<div className={`delta ${deltaMap[cell[0]] > 0 ? 'increase' : 'decrease'}`}>
													{deltaMap[cell[0]] > 0 ? '+' : '−'}{Math.abs(deltaMap[cell[0]]).toFixed(2)}
												</div>
											)}
										</div>
									) : null}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}


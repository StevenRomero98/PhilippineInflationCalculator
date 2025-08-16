import React, { useEffect, useMemo, useState } from 'react'
import inflationData from '../data/inflation_by_year.json'

// Helper: format number as Philippine Peso currency
function formatCurrency(value) {
	if (!Number.isFinite(value)) return '₱0.00'
	return value.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
}

// Parse a string input into a positive number. Return NaN for invalid input.
function parsePositiveNumber(value) {
	if (typeof value !== 'string') value = String(value)
	const n = parseFloat(value.replace(/,/g, ''))
	return Number.isFinite(n) && n >= 0 ? n : NaN
}

// Compute cumulative multiplier between two years using inflationData.
function computeMultiplier(fromYear, toYear) {
	if (fromYear === toYear) return 1
	const start = Math.min(fromYear, toYear)
	const end = Math.max(fromYear, toYear)
	let multiplier = 1
	for (let y = start + 1; y <= end; y++) {
		const r = inflationData[String(y)]
		const rate = typeof r === 'number' ? r : 0
		multiplier *= 1 + rate / 100
	}
	return multiplier
}

export default function InflationCalculator() {
	const years = useMemo(() =>
		Object.keys(inflationData)
			.map((y) => parseInt(y, 10))
			.filter(Number.isFinite)
			.sort((a, b) => a - b),
		[]
	)

	const [amountInput, setAmountInput] = useState('100')
	const [fromYear, setFromYear] = useState(null)
	const [toYear, setToYear] = useState(null)
	const [message, setMessage] = useState('')

	useEffect(() => {
		if (!years || years.length === 0) return
		setFromYear((prev) => (prev == null ? years[0] : prev))
		setToYear((prev) => (prev == null ? years[years.length - 1] : prev))
	}, [years])

	const { finalAmount, pctChange } = useMemo(() => {
		const amount = parsePositiveNumber(amountInput)
		if (!Number.isFinite(amount)) return { finalAmount: NaN, pctChange: 0 }
		if (!fromYear || !toYear) return { finalAmount: amount, pctChange: 0 }
		const multiplier = computeMultiplier(fromYear, toYear)
		const forward = toYear > fromYear
		const final = forward ? amount * multiplier : amount / multiplier
		const pct = amount === 0 ? 0 : ((final - amount) / amount) * 100
		return { finalAmount: final, pctChange: pct }
	}, [amountInput, fromYear, toYear])

	function swapYears() {
		setFromYear((f) => {
			setToYear(f)
			return toYear
		})
	}

	useEffect(() => {
		const amount = parsePositiveNumber(amountInput)
		if (!Number.isFinite(amount)) {
			setMessage('Please enter a valid non-negative number for the amount.')
		} else if (fromYear === toYear) {
			setMessage('Picking the same year shows no change.')
		} else {
			setMessage('')
		}
	}, [amountInput, fromYear, toYear])

	return (
		<div className="calculator">
			<div className="row">
				<label>
					In
					<select
						aria-label="From year"
						value={fromYear ?? ''}
						onChange={(e) => setFromYear(Number(e.target.value))}
					>
						{years.map((y) => (
							<option key={y} value={y}>
								{y}
							</option>
						))}
					</select>

					the goods you can buy for
					<input
						aria-label="Amount in pesos"
						type="text"
						inputMode="decimal"
						value={amountInput}
						onChange={(e) => setAmountInput(e.target.value)}
						placeholder="e.g. 100.00"
					/>
				</label>
			</div>

			<div className="row">
				<label>
					At the end of
					<select
						aria-label="To year"
						value={toYear ?? ''}
						onChange={(e) => setToYear(Number(e.target.value))}
					>
						{years.map((y) => (
							<option key={y} value={y}>
								{y}
							</option>
						))}
					</select>
				</label>

				<button type="button" onClick={swapYears} style={{ marginLeft: 12 }}>
					Swap
				</button>
			</div>

			<div className="result" aria-live="polite">
				{Number.isFinite(finalAmount) ? (
					<>
						would roughly cost you <strong>{formatCurrency(finalAmount)}</strong> (
						{pctChange.toFixed(2)}% {pctChange >= 0 ? 'increase' : 'decrease'})
					</>
				) : (
					'Enter a valid amount to see the result.'
				)}
			</div>

			{message && <div className="note" style={{ color: '#a00' }}>{message}</div>}
			{!message && <div className="note">Note: Uses average annual inflation per year. Source: BSP and public datasets.</div>}
		</div>
	)
}


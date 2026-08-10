'use client';

import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { calculateEMI, formatPrice } from '@/lib/utils';

interface EMICalculatorProps {
  propertyPrice: number;
}

export default function EMICalculator({ propertyPrice }: EMICalculatorProps) {
  const defaultLoan = Math.round(propertyPrice * 0.8);
  const [loanAmount, setLoanAmount] = useState(defaultLoan);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(15);

  const emi = calculateEMI(loanAmount, rate, tenure);
  const totalPayment = emi * tenure * 12;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div className="bg-surface border border-border-subtle rounded-2xl p-6 shadow-sm">
      <h3 className="font-serif text-ink text-lg mb-5 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-gold-dark" />
        EMI Calculator
      </h3>

      <div className="space-y-4">
        {/* Loan Amount */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs font-inter font-semibold text-text-muted uppercase tracking-wide">
              Loan Amount
            </label>
            <span className="text-xs font-inter font-semibold text-ink">
              {formatPrice(loanAmount)}
            </span>
          </div>
          <input
            type="range"
            min={500000}
            max={propertyPrice}
            step={100000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full accent-gold cursor-pointer"
            aria-label="Loan amount slider"
          />
          <div className="flex justify-between text-xs text-text-muted font-inter mt-1">
            <span>₹5 Lakh</span>
            <span>{formatPrice(propertyPrice)}</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs font-inter font-semibold text-text-muted uppercase tracking-wide">
              Interest Rate
            </label>
            <span className="text-xs font-inter font-semibold text-ink">{rate}% p.a.</span>
          </div>
          <input
            type="range"
            min={6}
            max={15}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-gold cursor-pointer"
            aria-label="Interest rate slider"
          />
          <div className="flex justify-between text-xs text-text-muted font-inter mt-1">
            <span>6%</span>
            <span>15%</span>
          </div>
        </div>

        {/* Tenure */}
        <div>
          <div className="flex justify-between mb-1">
            <label className="text-xs font-inter font-semibold text-text-muted uppercase tracking-wide">
              Loan Tenure
            </label>
            <span className="text-xs font-inter font-semibold text-ink">{tenure} Years</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full accent-gold cursor-pointer"
            aria-label="Loan tenure slider"
          />
          <div className="flex justify-between text-xs text-text-muted font-inter mt-1">
            <span>5 yrs</span>
            <span>30 yrs</span>
          </div>
        </div>

        {/* Results — light gold wash, not dark panel */}
        <div className="bg-gold/10 border border-gold/25 rounded-xl p-5 mt-2 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary font-inter text-sm">Monthly EMI</span>
            <span className="text-ink font-serif text-2xl">
              {formatPrice(emi)}
            </span>
          </div>
          <div className="border-t border-gold/20 pt-3 grid grid-cols-2 gap-3">
            <div>
              <div className="text-text-muted font-inter text-xs mb-1">Principal</div>
              <div className="text-ink font-inter font-semibold text-sm">{formatPrice(loanAmount)}</div>
            </div>
            <div>
              <div className="text-text-muted font-inter text-xs mb-1">Total Interest</div>
              <div className="text-ink font-inter font-semibold text-sm">{formatPrice(totalInterest)}</div>
            </div>
          </div>
        </div>

        <p className="text-xs text-text-muted font-inter leading-relaxed">
          * This is an indicative calculation only. Actual EMI may vary based on bank policies.
          We can connect you with our bank partners for exact loan eligibility.
        </p>
      </div>
    </div>
  );
}

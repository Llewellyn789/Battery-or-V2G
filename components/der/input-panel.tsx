"use client";

import type { DerPathwayInputs } from "@/lib/model/der-pathways";

type InputConfig = {
  key: keyof DerPathwayInputs;
  label: string;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
};

const inputs: InputConfig[] = [
  { key: "solarCost", label: "Solar system cost", prefix: "$", step: 500, min: 0 },
  { key: "batteryCostNow", label: "Home battery cost now", prefix: "$", step: 500, min: 0 },
  { key: "batteryAnnualBenefit", label: "Home battery annual benefit", prefix: "$", step: 100, min: 0 },
  { key: "batteryLifeYears", label: "Home battery life", suffix: "years", step: 1, min: 1, max: 15 },
  { key: "futureReplacementBatteryCost", label: "Future replacement battery cost", prefix: "$", step: 500, min: 0 },
  { key: "v2gHardwareCostToday", label: "V2G hardware cost today", prefix: "$", step: 250, min: 0 },
  { key: "v2gStartYear", label: "V2G start year", suffix: "year", step: 1, min: 1, max: 15 },
  { key: "v2gAnnualBenefit", label: "V2G annual benefit once active", prefix: "$", step: 100, min: 0 },
  { key: "evBatteryWearCostPerYear", label: "EV battery wear cost from V2G", prefix: "$", step: 50, min: 0 },
  { key: "hisaRate", label: "HISA / risk-free rate", suffix: "%", step: 0.005, min: 0 },
  { key: "discountRate", label: "Discount rate", suffix: "%", step: 0.005, min: 0 },
  { key: "solarAnnualBenefit", label: "Solar annual benefit", prefix: "$", step: 100, min: 0 },
  { key: "annualBenefitGrowthRate", label: "Annual growth in energy benefits", suffix: "%", step: 0.005 },
  { key: "v2gHardwareDeclineRate", label: "Annual decline in V2G hardware cost", suffix: "%", step: 0.005 },
  { key: "horizonYears", label: "Horizon", suffix: "years", step: 1, min: 1, max: 15 },
];

const percentFields = new Set<keyof DerPathwayInputs>([
  "hisaRate",
  "discountRate",
  "annualBenefitGrowthRate",
  "v2gHardwareDeclineRate",
]);

export function InputPanel({
  values,
  onChange,
}: {
  values: DerPathwayInputs;
  onChange: (key: keyof DerPathwayInputs, value: number) => void;
}) {
  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-normal text-cyan-700">Inputs</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">Melbourne household settings</h2>
      </div>

      <div className="mt-5 grid gap-4">
        {inputs.map((input) => {
          const isPercent = percentFields.has(input.key);
          const step = input.step ?? 1;
          const displayValue = isPercent ? Number((values[input.key] * 100).toFixed(2)) : values[input.key];

          return (
            <label key={input.key} className="grid gap-1.5">
              <span className="text-sm font-medium text-slate-700">{input.label}</span>
              <span className="flex min-h-11 items-center rounded-md border border-slate-300 bg-slate-50 px-3 focus-within:border-cyan-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-cyan-100">
                {input.prefix ? <span className="mr-1 text-sm text-slate-500">{input.prefix}</span> : null}
                <input
                  className="min-w-0 flex-1 bg-transparent text-base font-medium text-slate-950 outline-none"
                  type="number"
                  min={input.min}
                  max={input.max}
                  step={isPercent ? step * 100 : step}
                  value={displayValue}
                  onChange={(event) => {
                    const nextValue = Number(event.target.value);
                    onChange(input.key, isPercent ? nextValue / 100 : nextValue);
                  }}
                />
                {input.suffix ? <span className="ml-2 whitespace-nowrap text-sm text-slate-500">{input.suffix}</span> : null}
              </span>
            </label>
          );
        })}
      </div>
    </aside>
  );
}

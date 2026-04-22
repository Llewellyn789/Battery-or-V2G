"use client";

import { useMemo, useState } from "react";
import { InputPanel } from "@/components/der/input-panel";
import { PayoffChart } from "@/components/der/payoff-chart";
import {
  calculateDerPathways,
  defaultDerPathwayInputs,
  type DerPathwayInputs,
} from "@/lib/model/der-pathways";

const aud = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

function formatAud(value: number) {
  return aud.format(value).replace("A$", "$");
}

function SummaryCard({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#111113]/90 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl">
      <p className="text-sm font-medium text-[#86868b]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-normal text-[#f5f5f7]">{value}</p>
      {detail ? <p className="mt-1 text-sm leading-5 text-[#86868b]">{detail}</p> : null}
    </div>
  );
}

export function PathwayModelApp() {
  const [inputs, setInputs] = useState<DerPathwayInputs>(defaultDerPathwayInputs);
  const result = useMemo(() => calculateDerPathways(inputs), [inputs]);

  function updateInput(key: keyof DerPathwayInputs, value: number) {
    setInputs((current) => ({
      ...current,
      [key]: Number.isFinite(value) ? value : 0,
    }));
  }

  const gapDetail =
    result.valueGap >= 0
      ? "Positive gap means wait-for-V2G is better."
      : "Negative gap means battery-now is better.";

  return (
    <main className="min-h-screen bg-black text-[#f5f5f7]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="mx-auto max-w-7xl text-center">
          <h1 className="text-5xl font-semibold tracking-normal text-[#f5f5f7] md:text-6xl lg:whitespace-nowrap xl:text-7xl">
            Battery Now vs Wait for V2G
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-[#a1a1a6] md:text-xl">
            Some households may see a better returning using their EV as a home battery, is yours?
          </p>
        </header>

        <div className="mt-12 grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
          <InputPanel values={inputs} onChange={updateInput} />

          <section className="space-y-5">
            <div className="rounded-lg border border-white/10 bg-[#111113]/90 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-normal text-[#f5f5f7]">Discounted cumulative payoff</h2>
                  <p className="mt-1 text-sm leading-6 text-[#86868b]">
                    Present-value payoff in AUD. Year 0 includes upfront costs.
                  </p>
                </div>
                <div className="rounded-md bg-[#0a84ff]/15 px-3 py-2 text-sm font-medium text-[#9fd0ff]">
                  V2G hardware at start: {formatAud(result.v2gHardwareCostAtStart)}
                </div>
              </div>
              <PayoffChart data={result.years} v2gStartYear={result.v2gStartYear} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SummaryCard label="Battery-now end value" value={formatAud(result.batteryNowEndValue)} />
              <SummaryCard label="Wait-for-V2G end value" value={formatAud(result.waitForV2gEndValue)} />
              <SummaryCard label="Gap at horizon" value={formatAud(result.valueGap)} detail={gapDetail} />
              <SummaryCard
                label="Crossover year"
                value={result.crossoverYear ? `Year ${result.crossoverYear}` : "None"}
                detail="Based on discounted payoff."
              />
            </div>

            <div className="rounded-lg border border-white/10 bg-[#111113]/90 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-xl">
              <h2 className="text-xl font-semibold tracking-normal text-[#f5f5f7]">Assumptions</h2>
              <div className="mt-3 grid gap-3 text-sm leading-6 text-[#a1a1a6] md:grid-cols-2">
                <p>
                  This is a simplified directional model. It treats costs and benefits as annual cash flows and discounts
                  them back to today.
                </p>
                <p>
                  Real outcomes depend on tariffs, export limits, driving behaviour, V2G availability, battery
                  degradation, and the household load shape.
                </p>
                <p>
                  The wait-for-V2G path keeps the home battery spend available on day 1 and earns HISA interest on that
                  preserved capital until V2G hardware is purchased.
                </p>
                <p>
                  Energy benefits grow at the chosen annual rate. V2G hardware cost declines each year until the selected
                  start year.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

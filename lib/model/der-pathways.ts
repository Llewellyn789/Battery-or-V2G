export type DerPathwayInputs = {
  solarCost: number;
  batteryCostNow: number;
  batteryAnnualBenefit: number;
  batteryLifeYears: number;
  futureReplacementBatteryCost: number;
  v2gHardwareCostToday: number;
  v2gStartYear: number;
  v2gAnnualBenefit: number;
  evBatteryWearCostPerYear: number;
  hisaRate: number;
  discountRate: number;
  solarAnnualBenefit: number;
  annualBenefitGrowthRate: number;
  v2gHardwareDeclineRate: number;
  horizonYears: number;
};

export type DerPathwayYear = {
  year: number;
  batteryNowNominal: number;
  waitForV2gNominal: number;
  batteryNowDiscounted: number;
  waitForV2gDiscounted: number;
  v2gHardwareCost: number;
};

export type DerPathwayResult = {
  years: DerPathwayYear[];
  batteryNowEndValue: number;
  waitForV2gEndValue: number;
  valueGap: number;
  crossoverYear: number | null;
  v2gStartYear: number;
  v2gHardwareCostAtStart: number;
};

export const defaultDerPathwayInputs: DerPathwayInputs = {
  solarCost: 12000,
  batteryCostNow: 11000,
  batteryAnnualBenefit: 1400,
  batteryLifeYears: 11,
  futureReplacementBatteryCost: 9000,
  v2gHardwareCostToday: 3500,
  v2gStartYear: 5,
  v2gAnnualBenefit: 1800,
  evBatteryWearCostPerYear: 250,
  hisaRate: 0.05,
  discountRate: 0.05,
  solarAnnualBenefit: 1800,
  annualBenefitGrowthRate: 0.02,
  v2gHardwareDeclineRate: 0.08,
  horizonYears: 15,
};

function clampYear(value: number) {
  return Math.min(15, Math.max(1, Math.round(value)));
}

function discount(value: number, year: number, rate: number) {
  return value / (1 + rate) ** year;
}

function grownBenefit(base: number, year: number, growthRate: number) {
  return base * (1 + growthRate) ** Math.max(0, year - 1);
}

export function calculateDerPathways(rawInputs: DerPathwayInputs): DerPathwayResult {
  const inputs = {
    ...rawInputs,
    horizonYears: clampYear(rawInputs.horizonYears),
    v2gStartYear: clampYear(rawInputs.v2gStartYear),
    batteryLifeYears: Math.max(1, Math.round(rawInputs.batteryLifeYears)),
  };

  const v2gStartYear = Math.min(inputs.v2gStartYear, inputs.horizonYears);
  const v2gHardwareCostAtStart =
    inputs.v2gHardwareCostToday * (1 - inputs.v2gHardwareDeclineRate) ** v2gStartYear;

  let batteryNowNominal = -(inputs.solarCost + inputs.batteryCostNow);
  let waitForV2gNominal = -inputs.solarCost;
  let batteryNowDiscounted = batteryNowNominal;
  let waitForV2gDiscounted = waitForV2gNominal;

  const years: DerPathwayYear[] = [
    {
      year: 0,
      batteryNowNominal,
      waitForV2gNominal,
      batteryNowDiscounted,
      waitForV2gDiscounted,
      v2gHardwareCost: inputs.v2gHardwareCostToday,
    },
  ];

  for (let year = 1; year <= inputs.horizonYears; year += 1) {
    const solarBenefit = grownBenefit(inputs.solarAnnualBenefit, year, inputs.annualBenefitGrowthRate);
    const batteryBenefit = grownBenefit(inputs.batteryAnnualBenefit, year, inputs.annualBenefitGrowthRate);
    const v2gBenefit = grownBenefit(inputs.v2gAnnualBenefit, year, inputs.annualBenefitGrowthRate);

    let batteryNowCashflow = solarBenefit + batteryBenefit;
    if (year === inputs.batteryLifeYears) {
      batteryNowCashflow -= inputs.futureReplacementBatteryCost;
    }

    let waitForV2gCashflow = solarBenefit;

    // Path B preserves the home battery spend and earns HISA interest until V2G hardware is bought.
    if (year < v2gStartYear) {
      waitForV2gCashflow += inputs.batteryCostNow * inputs.hisaRate;
    }

    if (year === v2gStartYear) {
      waitForV2gCashflow -= v2gHardwareCostAtStart;
    }

    if (year >= v2gStartYear) {
      waitForV2gCashflow += v2gBenefit - inputs.evBatteryWearCostPerYear;
    }

    batteryNowNominal += batteryNowCashflow;
    waitForV2gNominal += waitForV2gCashflow;
    batteryNowDiscounted += discount(batteryNowCashflow, year, inputs.discountRate);
    waitForV2gDiscounted += discount(waitForV2gCashflow, year, inputs.discountRate);

    years.push({
      year,
      batteryNowNominal,
      waitForV2gNominal,
      batteryNowDiscounted,
      waitForV2gDiscounted,
      v2gHardwareCost: inputs.v2gHardwareCostToday * (1 - inputs.v2gHardwareDeclineRate) ** year,
    });
  }

  const crossoverYear =
    years.find((point, index) => {
      if (index === 0) {
        return false;
      }

      const previousGap = years[index - 1].waitForV2gDiscounted - years[index - 1].batteryNowDiscounted;
      const currentGap = point.waitForV2gDiscounted - point.batteryNowDiscounted;
      return previousGap <= 0 && currentGap > 0;
    })?.year ?? null;

  const finalYear = years[years.length - 1];
  const valueGap = finalYear.waitForV2gDiscounted - finalYear.batteryNowDiscounted;

  return {
    years,
    batteryNowEndValue: finalYear.batteryNowDiscounted,
    waitForV2gEndValue: finalYear.waitForV2gDiscounted,
    valueGap,
    crossoverYear,
    v2gStartYear,
    v2gHardwareCostAtStart,
  };
}

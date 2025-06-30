"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calculator, Car, DollarSign, Percent, Calendar } from "lucide-react";

interface LeaseInputs {
  vehiclePrice: number;
  dealerIncentives: number;
  sellingPrice: number;
  downPayment: number;
  tradeInValue: number;
  tradeInPayoff: number;
  interestRate: number;
  leaseTerm: number;
  taxRate: number;
  taxesAndFees: number;
  residualValue: number;
}

interface LeaseCalculation {
  netCapitalizedCost: number;
  residualValue: number;
  depreciationFee: number;
  financeFee: number;
  monthlyPayment: number;
}

export function LeaseCalculator() {
  const [inputs, setInputs] = useState<LeaseInputs>({
    vehiclePrice: 30000,
    dealerIncentives: 2000,
    sellingPrice: 28000,
    downPayment: 3000,
    tradeInValue: 0,
    tradeInPayoff: 0,
    interestRate: 4.5,
    leaseTerm: 36,
    taxRate: 8.5,
    taxesAndFees: 1500,
    residualValue: 16500, // 55% of 30000
  });

  const [calculation, setCalculation] = useState<LeaseCalculation>({
    netCapitalizedCost: 0,
    residualValue: 0,
    depreciationFee: 0,
    financeFee: 0,
    monthlyPayment: 0,
  });

  const calculateSellingPrice = (msrp: number, incentives: number) => {
    return msrp - incentives;
  };

  const calculatePercentageOff = (msrp: number, sellingPrice: number) => {
    if (msrp === 0) return 0;
    return ((msrp - sellingPrice) / msrp) * 100;
  };

  const calculateTaxes = (
    sellingPrice: number,
    downPayment: number,
    tradeInValue: number,
    tradeInPayoff: number,
    taxRate: number
  ) => {
    // Calculate taxable amount (selling price - down payment - trade equity)
    const tradeEquity = tradeInValue - tradeInPayoff;
    const taxableAmount = sellingPrice - downPayment - tradeEquity;
    return (taxableAmount * taxRate) / 100;
  };

  const calculateEstimatedResidual = (msrp: number, leaseTerm: number) => {
    const residualPercentage = leaseTerm <= 36 ? 0.55 : 0.45;
    return msrp * residualPercentage;
  };

  const calculateLease = (inputs: LeaseInputs): LeaseCalculation => {
    // Calculate taxes based on taxable amount
    const calculatedTaxes = calculateTaxes(
      inputs.sellingPrice,
      inputs.downPayment,
      inputs.tradeInValue,
      inputs.tradeInPayoff,
      inputs.taxRate
    );

    // Calculate net capitalized cost using selling price and calculated taxes
    const netCapitalizedCost =
      inputs.sellingPrice -
      inputs.downPayment -
      inputs.tradeInValue +
      inputs.tradeInPayoff +
      calculatedTaxes +
      inputs.taxesAndFees;

    // Use the input residual value instead of calculating it
    const residualValue = inputs.residualValue;
    const depreciationFee =
      (netCapitalizedCost - residualValue) / inputs.leaseTerm;
    const monthlyInterestRate = inputs.interestRate / 100 / 12;
    const financeFee =
      (netCapitalizedCost + residualValue) * monthlyInterestRate;
    const monthlyPayment = depreciationFee + financeFee;

    return {
      netCapitalizedCost,
      residualValue,
      depreciationFee,
      financeFee,
      monthlyPayment,
    };
  };

  useEffect(() => {
    const result = calculateLease(inputs);
    setCalculation(result);
  }, [inputs]);

  const handleInputChange = (field: keyof LeaseInputs, value: string) => {
    const numericValue = Number.parseFloat(value) || 0;

    if (field === "vehiclePrice" || field === "dealerIncentives") {
      // Auto-calculate selling price when MSRP or incentives change
      const newInputs = { ...inputs, [field]: numericValue };
      if (field === "vehiclePrice") {
        newInputs.sellingPrice = calculateSellingPrice(
          numericValue,
          inputs.dealerIncentives
        );
        // Also update estimated residual value when MSRP changes
        newInputs.residualValue = calculateEstimatedResidual(
          numericValue,
          inputs.leaseTerm
        );
      } else {
        newInputs.sellingPrice = calculateSellingPrice(
          inputs.vehiclePrice,
          numericValue
        );
      }
      setInputs(newInputs);
    } else if (field === "leaseTerm") {
      // Auto-calculate residual when lease term changes
      const newInputs = { ...inputs, [field]: numericValue };
      newInputs.residualValue = calculateEstimatedResidual(
        inputs.vehiclePrice,
        numericValue
      );
      setInputs(newInputs);
    } else {
      setInputs((prev) => ({
        ...prev,
        [field]: numericValue,
      }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyDetailed = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="mx-auto max-w-6xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white">
          <Calculator className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-3xl font-bold text-foreground">
          Vehicle Lease Calculator
        </h2>
        <p className="text-muted-foreground">
          Calculate your estimated monthly lease payment with detailed breakdown
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Lease Details
              </CardTitle>
              <CardDescription>
                Enter your vehicle and financing information to calculate your
                monthly lease payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vehicle Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Vehicle Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="vehiclePrice"
                      className="flex items-center gap-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      Vehicle Price (MSRP)
                    </Label>
                    <Input
                      id="vehiclePrice"
                      type="number"
                      value={inputs.vehiclePrice}
                      onChange={(e) =>
                        handleInputChange("vehiclePrice", e.target.value)
                      }
                      placeholder="30000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dealerIncentives">Dealer Incentives</Label>
                    <Input
                      id="dealerIncentives"
                      type="number"
                      value={inputs.dealerIncentives}
                      onChange={(e) =>
                        handleInputChange("dealerIncentives", e.target.value)
                      }
                      placeholder="2000"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="sellingPrice"
                      className="flex items-center gap-2"
                    >
                      Selling Price
                      <span className="text-sm text-green-600 font-medium dark:text-green-400">
                        (
                        {calculatePercentageOff(
                          inputs.vehiclePrice,
                          inputs.sellingPrice
                        ).toFixed(1)}
                        % off MSRP)
                      </span>
                    </Label>
                    <Input
                      id="sellingPrice"
                      type="number"
                      value={inputs.sellingPrice}
                      onChange={(e) =>
                        handleInputChange("sellingPrice", e.target.value)
                      }
                      placeholder="28000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="downPayment">Down Payment</Label>
                    <Input
                      id="downPayment"
                      type="number"
                      value={inputs.downPayment}
                      onChange={(e) =>
                        handleInputChange("downPayment", e.target.value)
                      }
                      placeholder="3000"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Trade-in Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Trade-in Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="tradeInValue">Trade-in Value</Label>
                    <Input
                      id="tradeInValue"
                      type="number"
                      value={inputs.tradeInValue}
                      onChange={(e) =>
                        handleInputChange("tradeInValue", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tradeInPayoff">Trade-in Payoff</Label>
                    <Input
                      id="tradeInPayoff"
                      type="number"
                      value={inputs.tradeInPayoff}
                      onChange={(e) =>
                        handleInputChange("tradeInPayoff", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Financing Terms */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Financing Terms
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="interestRate"
                      className="flex items-center gap-2"
                    >
                      <Percent className="h-4 w-4" />
                      Interest Rate (APR %)
                    </Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      value={inputs.interestRate}
                      onChange={(e) =>
                        handleInputChange("interestRate", e.target.value)
                      }
                      placeholder="4.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="leaseTerm"
                      className="flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Lease Term (Months)
                    </Label>
                    <Input
                      id="leaseTerm"
                      type="number"
                      value={inputs.leaseTerm}
                      onChange={(e) =>
                        handleInputChange("leaseTerm", e.target.value)
                      }
                      placeholder="36"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="residualValue"
                      className="flex items-center gap-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      Residual Value
                      <span className="text-sm text-blue-600 font-medium dark:text-blue-400">
                        (
                        {(
                          (inputs.residualValue / inputs.vehiclePrice) *
                          100
                        ).toFixed(1)}
                        % of MSRP)
                      </span>
                    </Label>
                    <Input
                      id="residualValue"
                      type="number"
                      value={inputs.residualValue}
                      onChange={(e) =>
                        handleInputChange("residualValue", e.target.value)
                      }
                      placeholder="16500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="taxRate"
                      className="flex items-center gap-2"
                    >
                      <Percent className="h-4 w-4" />
                      Tax Rate (%)
                    </Label>
                    <Input
                      id="taxRate"
                      type="number"
                      step="0.1"
                      value={inputs.taxRate}
                      onChange={(e) =>
                        handleInputChange("taxRate", e.target.value)
                      }
                      placeholder="8.5"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="taxesAndFees">Additional Fees</Label>
                    <Input
                      id="taxesAndFees"
                      type="number"
                      value={inputs.taxesAndFees}
                      onChange={(e) =>
                        handleInputChange("taxesAndFees", e.target.value)
                      }
                      placeholder="1500"
                    />
                  </div>
                  <div></div> {/* Empty div for alignment */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Monthly Payment */}
          <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-900 dark:border-blue-800 gap-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-blue-900 dark:text-blue-100">
                Monthly Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(calculation.monthlyPayment)}
              </div>
              <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                Estimated monthly lease payment
              </p>
            </CardContent>
          </Card>

          {/* Payment Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Depreciation Fee:</span>
                <span className="font-medium">
                  {formatCurrencyDetailed(calculation.depreciationFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Finance Fee:</span>
                <span className="font-medium">
                  {formatCurrencyDetailed(calculation.financeFee)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Monthly:</span>
                <span>
                  {formatCurrencyDetailed(calculation.monthlyPayment)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Calculation Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Calculation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle MSRP:</span>
                <span>{formatCurrency(inputs.vehiclePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Dealer Incentives:
                </span>
                <span>-{formatCurrency(inputs.dealerIncentives)}</span>
              </div>
              <div className="flex justify-between font-medium text-green-700 dark:text-green-400">
                <span>Selling Price:</span>
                <span>
                  {formatCurrency(inputs.sellingPrice)} (
                  {calculatePercentageOff(
                    inputs.vehiclePrice,
                    inputs.sellingPrice
                  ).toFixed(1)}
                  % off)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Calculated Taxes ({inputs.taxRate}%):
                </span>
                <span>
                  +
                  {formatCurrency(
                    calculateTaxes(
                      inputs.sellingPrice,
                      inputs.downPayment,
                      inputs.tradeInValue,
                      inputs.tradeInPayoff,
                      inputs.taxRate
                    )
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Additional Fees:</span>
                <span>+{formatCurrency(inputs.taxesAndFees)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Down Payment:</span>
                <span>-{formatCurrency(inputs.downPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trade-in Value:</span>
                <span>-{formatCurrency(inputs.tradeInValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trade-in Payoff:</span>
                <span>+{formatCurrency(inputs.tradeInPayoff)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Net Capitalized Cost:</span>
                <span>{formatCurrency(calculation.netCapitalizedCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Residual Value:</span>
                <span>
                  {formatCurrency(calculation.residualValue)} (
                  {((inputs.residualValue / inputs.vehiclePrice) * 100).toFixed(
                    1
                  )}
                  % of MSRP)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lease Term:</span>
                <span>{inputs.leaseTerm} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest Rate:</span>
                <span>{inputs.interestRate}% APR</span>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900 dark:border-amber-800">
            <CardContent>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                <strong>Disclaimer:</strong> This calculator provides estimates
                only. Actual lease terms may vary based on credit approval,
                dealer incentives, and other factors. Consult with your dealer
                for accurate pricing.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

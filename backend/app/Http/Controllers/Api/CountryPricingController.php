<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CountryPricing;
use Illuminate\Http\Request;

class CountryPricingController extends Controller
{
    public function index()
    {
        return CountryPricing::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'country' => 'required|string|max:255|unique:country_pricing',
            'country_code' => 'required|string|size:2',
            'currency_code' => 'required|string|size:3',
            'consultation_fee' => 'nullable|numeric|min:0',
            'package_markup_percent' => 'nullable|numeric|min:0|max:100',
            'is_active' => 'boolean',
        ]);
        return CountryPricing::create($validated);
    }

    public function show(CountryPricing $countryPricing)
    {
        return $countryPricing;
    }

    public function update(Request $request, CountryPricing $countryPricing)
    {
        $validated = $request->validate([
            'country' => 'sometimes|string|max:255|unique:country_pricing,country,' . $countryPricing->id,
            'country_code' => 'sometimes|string|size:2',
            'currency_code' => 'sometimes|string|size:3',
            'consultation_fee' => 'nullable|numeric|min:0',
            'package_markup_percent' => 'nullable|numeric|min:0|max:100',
            'is_active' => 'boolean',
        ]);
        $countryPricing->update($validated);
        return $countryPricing;
    }

    public function destroy(CountryPricing $countryPricing)
    {
        $countryPricing->delete();
        return response()->noContent();
    }
}

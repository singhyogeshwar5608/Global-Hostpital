<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    public function index()
    {
        return Currency::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'country' => 'required|string|max:255|unique:currencies',
            'country_code' => 'required|string|size:2',
            'currency_name' => 'required|string|max:255',
            'currency_code' => 'required|string|size:3',
            'currency_symbol' => 'required|string|max:10',
            'exchange_rate' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);
        return Currency::create($validated);
    }

    public function show(Currency $currency)
    {
        return $currency;
    }

    public function update(Request $request, Currency $currency)
    {
        $validated = $request->validate([
            'country' => 'sometimes|string|max:255|unique:currencies,country,' . $currency->id,
            'country_code' => 'sometimes|string|size:2',
            'currency_name' => 'sometimes|string|max:255',
            'currency_code' => 'sometimes|string|size:3',
            'currency_symbol' => 'sometimes|string|max:10',
            'exchange_rate' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
        ]);
        $currency->update($validated);
        return $currency;
    }

    public function destroy(Currency $currency)
    {
        $currency->delete();
        return response()->noContent();
    }

    public function detectByCountry($countryCode)
    {
        $currency = Currency::where('country_code', strtoupper($countryCode))->first();
        if (!$currency) {
            return response()->json(['currency_code' => 'USD', 'currency_symbol' => '$', 'currency_name' => 'US Dollar']);
        }
        return response()->json($currency);
    }
}

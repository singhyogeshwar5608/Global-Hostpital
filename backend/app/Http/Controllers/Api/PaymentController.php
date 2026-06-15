<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        return Payment::with('patient')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'payable_type' => 'required|string',
            'payable_id' => 'required|integer',
            'patient_id' => 'nullable|exists:patients,id',
            'payment_type' => 'required|in:consultation,package,medicine',
            'amount' => 'required|numeric|min:0',
            'currency_code' => 'required|string|size:3',
            'payment_method' => 'nullable|string',
            'payment_status' => 'nullable|in:pending,completed,failed,refunded',
            'transaction_id' => 'nullable|string|unique:payments',
            'payment_details' => 'nullable|json',
            'paid_at' => 'nullable|date',
        ]);
        $validated['payment_details'] = $request->input('payment_details');
        return Payment::create($validated);
    }

    public function show(Payment $payment)
    {
        return $payment->load('patient');
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'payment_status' => 'nullable|in:pending,completed,failed,refunded',
            'payment_method' => 'nullable|string',
            'transaction_id' => 'nullable|string|unique:payments,transaction_id,' . $payment->id,
            'payment_details' => 'nullable|json',
            'paid_at' => 'nullable|date',
        ]);
        $payment->update($validated);
        return $payment;
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return response()->noContent();
    }

    public function byPatient($patientId)
    {
        return Payment::where('patient_id', $patientId)->with('patient')->get();
    }
}

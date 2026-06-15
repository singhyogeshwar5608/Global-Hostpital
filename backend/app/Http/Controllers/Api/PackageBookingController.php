<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PackageBooking;
use Illuminate\Http\Request;

class PackageBookingController extends Controller
{
    public function index() { return PackageBooking::all(); }
    public function store(Request $r) { return PackageBooking::create($r->all()); }
    public function show(PackageBooking $packageBooking) { return $packageBooking; }
    public function update(Request $r, PackageBooking $packageBooking) { $packageBooking->update($r->all()); return $packageBooking; }
    public function destroy(PackageBooking $packageBooking) { $packageBooking->delete(); return response()->noContent(); }
}

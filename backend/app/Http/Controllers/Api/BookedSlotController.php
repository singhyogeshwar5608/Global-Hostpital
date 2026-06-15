<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookedSlot;
use Illuminate\Http\Request;

class BookedSlotController extends Controller
{
    public function index() { return BookedSlot::all(); }
    public function store(Request $r) { return BookedSlot::create($r->all()); }
    public function show(BookedSlot $bookedSlot) { return $bookedSlot; }
    public function update(Request $r, BookedSlot $bookedSlot) { $bookedSlot->update($r->all()); return $bookedSlot; }
    public function destroy(BookedSlot $bookedSlot) { $bookedSlot->delete(); return response()->noContent(); }
}

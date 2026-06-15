<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\PatientReportController;
use App\Http\Controllers\Api\PatientBookingController;
use App\Http\Controllers\Api\HospitalController;
use App\Http\Controllers\Api\LabController;
use App\Http\Controllers\Api\LabCertificateController;
use App\Http\Controllers\Api\LabDocumentController;
use App\Http\Controllers\Api\LabWorkflowController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\MedicineOrderController;
use App\Http\Controllers\Api\HealthPackageController;
use App\Http\Controllers\Api\PackageBookingController;
use App\Http\Controllers\Api\DoctorScheduleController;
use App\Http\Controllers\Api\BookedSlotController;
use App\Http\Controllers\Api\DoctorAuditLogController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\CurrencyController;
use App\Http\Controllers\Api\CountryPricingController;
use App\Http\Controllers\Api\PrescriptionController;
use App\Http\Controllers\Api\AdvertisementController;
use App\Http\Controllers\Api\PatientGeoLocationController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ReelController;
use App\Http\Controllers\Api\SpecialtyController;
use App\Http\Controllers\Api\SpecialtyQuestionController;
use App\Http\Controllers\Api\CaseSubmissionController;

// Public auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

// Public read-only
Route::get('/public/specialties', [SpecialtyController::class, 'index']);
Route::get('/public/specialties/{specialty}/questions', [SpecialtyQuestionController::class, 'bySpecialty']);
Route::get('/public/doctors', [DoctorController::class, 'index']);
Route::get('/public/hospitals', [HospitalController::class, 'index']);
Route::get('/public/labs', [LabController::class, 'index']);
Route::get('/public/medicines', [MedicineController::class, 'index']);
Route::get('/public/health-packages', [HealthPackageController::class, 'index']);
Route::get('/public/services', [ServiceController::class, 'index']);
Route::get('/public/reels', [ReelController::class, 'index']);
Route::get('/public/advertisements', [AdvertisementController::class, 'public']);
Route::get('/public/currencies', [CurrencyController::class, 'index']);
Route::get('/public/currency/detect/{countryCode}', [CurrencyController::class, 'detectByCountry']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {

    // Super Admin only
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('specialties', SpecialtyController::class);
        Route::apiResource('specialty-questions', SpecialtyQuestionController::class);
        Route::get('specialty-questions/by-specialty/{specialtyId}', [SpecialtyQuestionController::class, 'bySpecialty']);
        Route::apiResource('doctors', DoctorController::class);
        Route::apiResource('labs', LabController::class);
        Route::apiResource('lab-certificates', LabCertificateController::class);
        Route::apiResource('lab-documents', LabDocumentController::class);
        Route::apiResource('currencies', CurrencyController::class);
        Route::apiResource('country-pricing', CountryPricingController::class);
        Route::apiResource('advertisements', AdvertisementController::class);
        Route::apiResource('hospitals', HospitalController::class);
        Route::apiResource('services', ServiceController::class);
        Route::apiResource('reels', ReelController::class);
    });

    // Admin + Doctor
    Route::middleware('role:admin,doctor')->group(function () {
        Route::apiResource('patients', PatientController::class);
        Route::apiResource('patient-reports', PatientReportController::class);
        Route::apiResource('prescriptions', PrescriptionController::class);
        Route::get('prescriptions/patient/{patientId}', [PrescriptionController::class, 'byPatient']);
        Route::get('prescriptions/doctor/{doctorId}', [PrescriptionController::class, 'byDoctor']);
        Route::get('payments/patient/{patientId}', [PaymentController::class, 'byPatient']);
        Route::apiResource('patient-bookings', PatientBookingController::class);
        Route::apiResource('booked-slots', BookedSlotController::class);
        Route::apiResource('doctor-schedules', DoctorScheduleController::class);
        Route::apiResource('doctor-audit-logs', DoctorAuditLogController::class);
    });

    // Admin + Doctor + Lab
    Route::middleware('role:admin,doctor,lab')->group(function () {
        Route::apiResource('lab-workflows', LabWorkflowController::class);
        Route::get('lab-workflows/lab/{labId}', [LabWorkflowController::class, 'byLab']);
        Route::get('lab-workflows/patient/{patientId}', [LabWorkflowController::class, 'byPatient']);
        Route::post('lab-workflows/assign-nearest', [LabWorkflowController::class, 'assignNearestLab']);
    });

    // Case Submissions (patients, doctors, admin)
    Route::apiResource('case-submissions', CaseSubmissionController::class);
    Route::get('case-submissions/patient/{patientId}', [CaseSubmissionController::class, 'byPatient']);
    Route::patch('case-submissions/{id}/status', [CaseSubmissionController::class, 'updateStatus']);
    Route::patch('case-submissions/{id}/assign-doctor', [CaseSubmissionController::class, 'assignDoctor']);

    // All authenticated users
    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('medicines', MedicineController::class);
    Route::apiResource('medicine-orders', MedicineOrderController::class);
    Route::apiResource('health-packages', HealthPackageController::class);
    Route::apiResource('package-bookings', PackageBookingController::class);
    Route::post('geo-location', [PatientGeoLocationController::class, 'store']);
    Route::get('geo-location/patient/{patientId}', [PatientGeoLocationController::class, 'byPatient']);
});

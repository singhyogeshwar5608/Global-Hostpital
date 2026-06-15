<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\PatientReport;
use App\Models\PatientBooking;
use App\Models\Hospital;
use App\Models\Lab;
use App\Models\Medicine;
use App\Models\MedicineOrder;
use App\Models\HealthPackage;
use App\Models\PackageBooking;
use App\Models\DoctorSchedule;
use App\Models\BookedSlot;
use App\Models\DoctorAuditLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@globalclinic.com',
            'password' => Hash::make('Admin@123'),
            'role' => 'admin',
        ]);

        Doctor::create([
            'photo' => 'https://api.dicebear.com/9.x/avataaars/svg?seed=sarah&backgroundColor=b6e3f4',
            'name' => 'Dr. Sarah Johnson',
            'qualification' => 'MBBS, MD',
            'degree' => 'Cardiology',
            'specialty' => 'Cardiologist',
            'experience' => '15 years',
            'mobile' => '+1 (555) 101-2001',
            'email' => 'sarah.johnson@hospital.com',
            'hospital_name' => 'City Heart Center',
            'district' => 'Manhattan',
            'state' => 'New York',
            'country' => 'USA',
            'address' => '456 Cardiology Lane, Manhattan, NY 10001',
            'consultancy_fee' => 500,
            'status' => 'active',
            'password' => Hash::make('temp123'),
            'is_online' => true,
            'rating' => 4.9,
            'total_consultations' => 342,
            'total_revenue' => 171000,
            'assigned_patient_ids' => ['PAT-1001', 'PAT-1002'],
            'assigned_lab_ids' => ['LAB-1001'],
            'assigned_countries' => ['USA'],
            'assigned_states' => ['New York'],
            'assigned_districts' => ['Manhattan'],
            'permissions' => json_encode([
                'viewPatients' => true, 'editPatients' => true, 'createPrescription' => true,
                'editPrescription' => true, 'assignLabTests' => true, 'viewLabReports' => true,
                'downloadReports' => true, 'generateMeetingLinks' => true, 'videoConsultation' => true,
                'viewPayments' => false, 'viewRevenue' => false, 'manageSchedule' => true,
                'manageFollowUps' => true, 'chatSystem' => true, 'uploadMedicalDocuments' => true,
            ]),
            'profile_visibility' => json_encode([
                'mobile' => true, 'email' => true, 'qualification' => true, 'degree' => true,
                'specialty' => true, 'experience' => true, 'hospitalName' => true,
                'consultancyFee' => true, 'address' => true, 'certificates' => true, 'reviewsRatings' => true,
            ]),
            'patient_access' => json_encode(['type' => 'all', 'assignedPatientIds' => [], 'allowedCountries' => [], 'allowedHospitals' => [], 'allowedDepartments' => []]),
        ]);

        Doctor::create([
            'photo' => 'https://api.dicebear.com/9.x/avataaars/svg?seed=michael&backgroundColor=c0aede',
            'name' => 'Dr. Michael Chen',
            'qualification' => 'MBBS, MS',
            'degree' => 'Neurology',
            'specialty' => 'Neurologist',
            'experience' => '12 years',
            'mobile' => '+1 (555) 202-3002',
            'email' => 'michael.chen@hospital.com',
            'hospital_name' => 'Metro Neuro Institute',
            'district' => 'Brooklyn',
            'state' => 'New York',
            'country' => 'USA',
            'address' => '789 Brain Street, Brooklyn, NY 11201',
            'consultancy_fee' => 600,
            'status' => 'active',
            'password' => Hash::make('temp123'),
            'is_online' => false,
            'rating' => 4.8,
            'total_consultations' => 256,
            'total_revenue' => 153600,
            'assigned_patient_ids' => ['PAT-1003'],
            'assigned_lab_ids' => ['LAB-1002'],
            'assigned_countries' => ['USA'],
            'assigned_states' => ['New York'],
            'assigned_districts' => ['Brooklyn'],
            'permissions' => json_encode([
                'viewPatients' => true, 'editPatients' => true, 'createPrescription' => true,
                'editPrescription' => true, 'assignLabTests' => true, 'viewLabReports' => true,
                'downloadReports' => true, 'generateMeetingLinks' => true, 'videoConsultation' => true,
                'viewPayments' => true, 'viewRevenue' => true, 'manageSchedule' => true,
                'manageFollowUps' => true, 'chatSystem' => true, 'uploadMedicalDocuments' => true,
            ]),
            'profile_visibility' => json_encode([
                'mobile' => true, 'email' => true, 'qualification' => true, 'degree' => true,
                'specialty' => true, 'experience' => true, 'hospitalName' => true,
                'consultancyFee' => true, 'address' => true, 'certificates' => true, 'reviewsRatings' => true,
            ]),
            'patient_access' => json_encode(['type' => 'hospitalWise', 'assignedPatientIds' => [], 'allowedCountries' => [], 'allowedHospitals' => ['City Heart Center'], 'allowedDepartments' => ['Neurology']]),
        ]);

        Doctor::create([
            'photo' => 'https://api.dicebear.com/9.x/avataaars/svg?seed=emily&backgroundColor=ffd5dc',
            'name' => 'Dr. Emily Williams',
            'qualification' => 'MBBS, MD',
            'degree' => 'Dermatology',
            'specialty' => 'Dermatologist',
            'experience' => '10 years',
            'mobile' => '+1 (555) 303-4003',
            'email' => 'emily.williams@hospital.com',
            'hospital_name' => 'Skin Care Hospital',
            'district' => 'Queens',
            'state' => 'New York',
            'country' => 'USA',
            'address' => '321 Skin Avenue, Queens, NY 11375',
            'consultancy_fee' => 400,
            'status' => 'suspended',
            'password' => Hash::make('temp123'),
            'is_online' => false,
            'rating' => 4.7,
            'total_consultations' => 189,
            'total_revenue' => 75600,
            'assigned_patient_ids' => [],
            'assigned_lab_ids' => [],
            'assigned_countries' => ['USA'],
            'assigned_states' => ['New York'],
            'assigned_districts' => ['Queens'],
            'permissions' => json_encode([
                'viewPatients' => true, 'editPatients' => false, 'createPrescription' => true,
                'editPrescription' => true, 'assignLabTests' => true, 'viewLabReports' => true,
                'downloadReports' => true, 'generateMeetingLinks' => true, 'videoConsultation' => true,
                'viewPayments' => false, 'viewRevenue' => false, 'manageSchedule' => false,
                'manageFollowUps' => true, 'chatSystem' => true, 'uploadMedicalDocuments' => true,
            ]),
            'profile_visibility' => json_encode([
                'mobile' => false, 'email' => false, 'qualification' => true, 'degree' => true,
                'specialty' => true, 'experience' => true, 'hospitalName' => true,
                'consultancyFee' => true, 'address' => true, 'certificates' => true, 'reviewsRatings' => true,
            ]),
            'patient_access' => json_encode(['type' => 'assigned', 'assignedPatientIds' => ['PAT-1004'], 'allowedCountries' => [], 'allowedHospitals' => [], 'allowedDepartments' => []]),
        ]);

        Patient::create([
            'full_name' => 'John Doe',
            'mobile_number' => '+1 (555) 101-2001',
            'email' => 'john.doe@email.com',
            'gender' => 'male',
            'date_of_birth' => '1985-03-15',
            'blood_group' => 'O+',
            'address' => '123 Main Street, Apt 4B',
            'country' => 'United States',
            'state' => 'New York',
            'district' => 'Manhattan',
            'city' => 'New York City',
            'pin_code' => '10001',
            'latitude' => '40.7128',
            'longitude' => '-74.0060',
            'disease_details' => 'Chronic migraine with aura',
            'symptoms' => 'Severe headache, nausea, sensitivity to light',
            'complaint' => 'Recurring migraines 3-4 times per week for the last 6 months',
            'medical_history' => 'Hypertension (2019), Seasonal allergies',
            'allergies' => 'Penicillin, Sulfa drugs',
            'current_medications' => 'Amlodipine 5mg daily, Sumatriptan as needed',
            'emergency_contact_name' => 'Jane Doe',
            'emergency_contact_number' => '+1 (555) 101-2002',
            'emergency_relationship' => 'Spouse',
            'is_active' => true,
            'registration_date' => '2024-01-10T09:00:00Z',
        ]);

        Patient::create([
            'full_name' => 'Emily Johnson',
            'mobile_number' => '+1 (555) 303-4003',
            'email' => 'emily.j@email.com',
            'gender' => 'female',
            'date_of_birth' => '1992-07-22',
            'blood_group' => 'A-',
            'address' => '456 Oak Avenue',
            'country' => 'United States',
            'state' => 'California',
            'district' => 'Santa Clara',
            'city' => 'San Jose',
            'pin_code' => '95101',
            'latitude' => '37.3382',
            'longitude' => '-121.8863',
            'disease_details' => 'Type 2 Diabetes Mellitus',
            'symptoms' => 'Increased thirst, frequent urination, fatigue',
            'complaint' => 'Difficulty managing blood sugar levels despite medication',
            'medical_history' => 'Gestational diabetes (2020), PCOS (2018)',
            'allergies' => 'Latex, Shellfish',
            'current_medications' => 'Metformin 500mg twice daily',
            'emergency_contact_name' => 'Robert Johnson',
            'emergency_contact_number' => '+1 (555) 303-4004',
            'emergency_relationship' => 'Father',
            'is_active' => true,
            'registration_date' => '2024-02-05T10:30:00Z',
        ]);

        Patient::create([
            'full_name' => 'Michael Smith',
            'mobile_number' => '+1 (555) 202-3002',
            'email' => 'michael.s@email.com',
            'gender' => 'male',
            'date_of_birth' => '1978-11-08',
            'blood_group' => 'B+',
            'address' => '789 Pine Street',
            'country' => 'United States',
            'state' => 'Texas',
            'district' => 'Harris',
            'city' => 'Houston',
            'pin_code' => '77001',
            'latitude' => '29.7604',
            'longitude' => '-95.3698',
            'disease_details' => 'Lower back pain - Lumbar disc herniation',
            'symptoms' => 'Chronic lower back pain, numbness in left leg',
            'complaint' => 'Severe back pain for 3 months, difficulty walking',
            'medical_history' => 'Sports injury (2015), Sciatica (2020)',
            'allergies' => 'Aspirin',
            'current_medications' => 'Ibuprofen 400mg as needed, Muscle relaxants',
            'emergency_contact_name' => 'Sarah Smith',
            'emergency_contact_number' => '+1 (555) 202-3003',
            'emergency_relationship' => 'Spouse',
            'is_active' => true,
            'registration_date' => '2024-03-15T08:45:00Z',
        ]);

        Patient::create([
            'full_name' => 'Sarah Williams',
            'mobile_number' => '+1 (555) 404-5004',
            'email' => 'sarah.w@email.com',
            'gender' => 'female',
            'date_of_birth' => '1995-05-30',
            'blood_group' => 'AB+',
            'address' => '321 Elm Drive, Suite 12',
            'country' => 'United States',
            'state' => 'Illinois',
            'district' => 'Cook',
            'city' => 'Chicago',
            'pin_code' => '60601',
            'latitude' => '41.8781',
            'longitude' => '-87.6298',
            'disease_details' => 'General health checkup',
            'symptoms' => 'Occasional fatigue, mild joint pain',
            'complaint' => 'Routine annual health checkup and wellness evaluation',
            'medical_history' => 'No significant medical history',
            'allergies' => 'None known',
            'current_medications' => 'Multivitamin, Vitamin D3 1000IU',
            'emergency_contact_name' => 'David Williams',
            'emergency_contact_number' => '+1 (555) 404-5005',
            'emergency_relationship' => 'Brother',
            'is_active' => true,
            'registration_date' => '2024-04-20T13:00:00Z',
        ]);

        Patient::create([
            'full_name' => 'Robert Chen',
            'mobile_number' => '+1 (555) 505-6005',
            'email' => 'robert.c@email.com',
            'gender' => 'male',
            'date_of_birth' => '1988-09-12',
            'blood_group' => 'O-',
            'address' => '567 Maple Court',
            'country' => 'United States',
            'state' => 'Washington',
            'district' => 'King',
            'city' => 'Seattle',
            'pin_code' => '98101',
            'latitude' => '47.6062',
            'longitude' => '-122.3321',
            'disease_details' => 'Seasonal allergic rhinitis and mild asthma',
            'symptoms' => 'Sneezing, runny nose, wheezing during exercise',
            'complaint' => 'Allergies worsen in spring, occasional breathing difficulty',
            'medical_history' => 'Childhood asthma, Eczema',
            'allergies' => 'Pollen, Dust mites, Peanuts',
            'current_medications' => 'Cetirizine 10mg daily, Albuterol inhaler PRN',
            'emergency_contact_name' => 'Linda Chen',
            'emergency_contact_number' => '+1 (555) 505-6006',
            'emergency_relationship' => 'Mother',
            'is_active' => false,
            'registration_date' => '2024-04-25T15:30:00Z',
        ]);

        Hospital::create([
            'name' => 'City Heart Center',
            'logo' => '🏥',
            'address' => '456 Cardiology Lane, Manhattan',
            'city' => 'New York',
            'state' => 'New York',
            'country' => 'USA',
            'pin_code' => '10001',
            'phone' => '+1 (212) 555-0101',
            'email' => 'info@cityheartcenter.com',
            'website' => 'www.cityheartcenter.com',
            'emergency_number' => '+1 (212) 911-0101',
            'registration_number' => 'REG-NYC-2019-4521',
            'type' => 'private',
            'specialty' => json_encode(['Cardiology', 'Cardiac Surgery', 'Interventional Cardiology']),
            'bed_capacity' => 200,
            'is_active' => true,
        ]);

        Hospital::create([
            'name' => 'Metro General Hospital',
            'logo' => '🏥',
            'address' => '789 Health Boulevard, Brooklyn',
            'city' => 'New York',
            'state' => 'New York',
            'country' => 'USA',
            'pin_code' => '11201',
            'phone' => '+1 (718) 555-0202',
            'email' => 'admin@metrogeneral.com',
            'website' => 'www.metrogeneral.com',
            'emergency_number' => '+1 (718) 911-0202',
            'registration_number' => 'REG-NYC-2018-3210',
            'type' => 'government',
            'specialty' => json_encode(['General Medicine', 'Emergency Medicine', 'Orthopedics', 'Pediatrics']),
            'bed_capacity' => 500,
            'is_active' => true,
        ]);

        Hospital::create([
            'name' => 'Sunrise Skin & Eye Clinic',
            'logo' => '🏥',
            'address' => '321 Wellness Avenue, Queens',
            'city' => 'New York',
            'state' => 'New York',
            'country' => 'USA',
            'pin_code' => '11375',
            'phone' => '+1 (347) 555-0303',
            'email' => 'contact@sunriseclinic.com',
            'website' => 'www.sunriseclinic.com',
            'emergency_number' => '+1 (347) 911-0303',
            'registration_number' => 'REG-NYC-2020-7890',
            'type' => 'private',
            'specialty' => json_encode(['Dermatology', 'Ophthalmology', 'Cosmetology']),
            'bed_capacity' => 80,
            'is_active' => true,
        ]);

        Hospital::create([
            'name' => 'NeuroCare Institute',
            'logo' => '🏥',
            'address' => '567 Brain Street, Manhattan',
            'city' => 'New York',
            'state' => 'New York',
            'country' => 'USA',
            'pin_code' => '10022',
            'phone' => '+1 (212) 555-0404',
            'email' => 'info@neurocareinstitute.com',
            'website' => 'www.neurocareinstitute.com',
            'emergency_number' => '+1 (212) 911-0404',
            'registration_number' => 'REG-NYC-2021-5678',
            'type' => 'private',
            'specialty' => json_encode(['Neurology', 'Neurosurgery', 'Psychiatry']),
            'bed_capacity' => 150,
            'is_active' => true,
        ]);

        Hospital::create([
            'name' => 'Community Health Trust',
            'logo' => '🏥',
            'address' => '890 Service Road, Bronx',
            'city' => 'New York',
            'state' => 'New York',
            'country' => 'USA',
            'pin_code' => '10451',
            'phone' => '+1 (718) 555-0505',
            'email' => 'help@communityhealthtrust.org',
            'website' => 'www.communityhealthtrust.org',
            'emergency_number' => '+1 (718) 911-0505',
            'registration_number' => 'REG-NYC-2017-1234',
            'type' => 'trust',
            'specialty' => json_encode(['General Medicine', 'Pediatrics', 'Gynecology', 'Dental']),
            'bed_capacity' => 300,
            'is_active' => false,
        ]);

        Lab::create([
            'lab_name' => 'City Diagnostic Center',
            'district' => 'Manhattan',
            'state' => 'New York',
            'country' => 'USA',
            'owner_name' => 'Dr. Robert Anderson',
            'owner_qualification' => 'MBBS, MD Pathology',
            'technician' => json_encode(['name' => 'James Wilson', 'photo' => 'https://api.dicebear.com/9.x/avataaars/svg?seed=james&backgroundColor=b6e3f4', 'qualification' => 'DMLT, BSc MLT']),
            'pathologist' => json_encode(['name' => 'Dr. Sarah Mitchell', 'photo' => 'https://api.dicebear.com/9.x/avataaars/svg?seed=sarahm&backgroundColor=c0aede', 'qualification' => 'MBBS, MD Pathology']),
            'is_active' => true,
            'password' => Hash::make('LabPass2k24'),
        ]);

        Lab::create([
            'lab_name' => 'Metro Pathology Lab',
            'district' => 'Brooklyn',
            'state' => 'New York',
            'country' => 'USA',
            'owner_name' => 'Dr. Linda Carter',
            'owner_qualification' => 'MBBS, DCP',
            'technician' => json_encode(['name' => 'Mark Thompson', 'photo' => 'https://api.dicebear.com/9.x/avataaars/svg?seed=mark&backgroundColor=ffd5dc', 'qualification' => 'BSc MLT, DMLT']),
            'pathologist' => json_encode(['name' => 'Dr. Emily Ross', 'photo' => 'https://api.dicebear.com/9.x/avataaars/svg?seed=emilyr&backgroundColor=ffeaa7', 'qualification' => 'MBBS, MD Pathology, FRCPath']),
            'is_active' => true,
            'password' => Hash::make('MedLab2024!'),
        ]);

        Lab::create([
            'lab_name' => 'Queens Bio-Medical Lab',
            'district' => 'Queens',
            'state' => 'New York',
            'country' => 'USA',
            'owner_name' => 'Dr. Alan Price',
            'owner_qualification' => 'MBBS, PhD Microbiology',
            'technician' => json_encode(['name' => 'Lisa Park', 'photo' => 'https://api.dicebear.com/9.x/avataaars/svg?seed=lisap&backgroundColor=ffdfba', 'qualification' => 'MSc MLT, DMLT']),
            'pathologist' => json_encode(['name' => 'Dr. David Kim', 'photo' => 'https://api.dicebear.com/9.x/avataaars/svg?seed=davidk&backgroundColor=d1d4f9', 'qualification' => 'MBBS, MD Pathology']),
            'is_active' => false,
            'password' => Hash::make('BioLabSecure'),
        ]);

        Medicine::create(['name' => 'Paracetamol 500mg', 'price' => 2.50, 'stock' => 500, 'description' => 'Common pain reliever and fever reducer.', 'quantity' => 10, 'category' => 'Pain Relief', 'image' => '💊', 'is_active' => true]);
        Medicine::create(['name' => 'Amoxicillin 250mg', 'price' => 8.99, 'stock' => 200, 'description' => 'Broad-spectrum antibiotic.', 'quantity' => 30, 'category' => 'Antibiotics', 'image' => '💊', 'is_active' => true]);
        Medicine::create(['name' => 'Omeprazole 20mg', 'price' => 5.75, 'stock' => 350, 'description' => 'Proton pump inhibitor for acid reflux.', 'quantity' => 14, 'category' => 'Gastrointestinal', 'image' => '💊', 'is_active' => true]);
        Medicine::create(['name' => 'Cetirizine 10mg', 'price' => 3.25, 'stock' => 450, 'description' => 'Antihistamine for allergy relief.', 'quantity' => 10, 'category' => 'Allergy', 'image' => '💊', 'is_active' => true]);
        Medicine::create(['name' => 'Metformin 500mg', 'price' => 4.50, 'stock' => 300, 'description' => 'First-line medication for type 2 diabetes.', 'quantity' => 30, 'category' => 'Diabetes', 'image' => '💊', 'is_active' => true]);
        Medicine::create(['name' => 'Amlodipine 5mg', 'price' => 6.00, 'stock' => 250, 'description' => 'Calcium channel blocker for blood pressure.', 'quantity' => 30, 'category' => 'Cardiovascular', 'image' => '💊', 'is_active' => true]);
        Medicine::create(['name' => 'Azithromycin 500mg', 'price' => 12.50, 'stock' => 150, 'description' => 'Macrolide antibiotic.', 'quantity' => 3, 'category' => 'Antibiotics', 'image' => '💊', 'is_active' => true]);
        Medicine::create(['name' => 'Vitamin D3 1000IU', 'price' => 7.99, 'stock' => 600, 'description' => 'Essential vitamin supplement.', 'quantity' => 30, 'category' => 'Supplements', 'image' => '💊', 'is_active' => true]);

        HealthPackage::create([
            'name' => 'Basic Health Checkup', 'description' => 'Comprehensive basic health screening package.',
            'benefits' => json_encode(['Complete Blood Count (CBC)', 'Blood Sugar (Fasting)', 'Lipid Profile', 'Liver Function Test', 'Kidney Function Test', 'Urine Analysis', 'Chest X-Ray', 'ECG', 'General Physician Consultation']),
            'price' => 49.99, 'original_price' => 79.99, 'category' => 'Basic', 'duration' => '4-6 hours',
            'tests_included' => json_encode(['CBC', 'Fasting Sugar', 'Lipid Profile', 'LFT', 'KFT', 'Urine Routine', 'Chest X-Ray', 'ECG']),
            'image' => '🩺', 'is_active' => true,
        ]);
        HealthPackage::create([
            'name' => 'Cardiac Health Package', 'description' => 'Specialized cardiac assessment package.',
            'benefits' => json_encode(['All Basic Checkup Tests', 'Troponin T & I', 'BNP', '2D Echo Cardiography', 'Stress Test (TMT)', 'Homocysteine Levels', 'HS-CRP', 'Cardiologist Consultation', 'Diet & Lifestyle Counseling']),
            'price' => 149.99, 'original_price' => 219.99, 'category' => 'Cardiac', 'duration' => '6-8 hours',
            'tests_included' => json_encode(['CBC', 'Lipid Profile', 'Troponin T', 'BNP', '2D Echo', 'TMT', 'HS-CRP', 'ECG']),
            'image' => '❤️', 'is_active' => true,
        ]);
        HealthPackage::create([
            'name' => 'Diabetes Care Package', 'description' => 'Complete diabetes management package.',
            'benefits' => json_encode(['Fasting & Post-Prandial Blood Sugar', 'HbA1c', 'Fructosamine', 'Lipid Profile', 'Kidney Function Test', 'Urine Microalbumin', 'Fundoscopy', 'Diabetologist Consultation', 'Diet Plan by Nutritionist']),
            'price' => 99.99, 'original_price' => 149.99, 'category' => 'Diabetes', 'duration' => '5-7 hours',
            'tests_included' => json_encode(['FBS', 'PPBS', 'HbA1c', 'Fructosamine', 'Lipid Profile', 'KFT', 'Urine Microalbumin']),
            'image' => '🩸', 'is_active' => true,
        ]);
        HealthPackage::create([
            'name' => "Women's Wellness Package", 'description' => 'Specially curated health package for women.',
            'benefits' => json_encode(['Complete Blood Count', 'Thyroid Profile', 'Vitamin D & B12', 'Calcium & Bone Markers', 'Iron Studies', 'Pap Smear', 'Mammogram', 'Gynecologist Consultation', 'Bone Density Assessment']),
            'price' => 129.99, 'original_price' => 189.99, 'category' => 'Women', 'duration' => '5-6 hours',
            'tests_included' => json_encode(['CBC', 'Thyroid Profile', 'Vitamin D', 'Vitamin B12', 'Calcium', 'Iron Studies', 'Pap Smear']),
            'image' => '👩', 'is_active' => true,
        ]);
        HealthPackage::create([
            'name' => 'Executive Health Package', 'description' => 'Premium health package for executives.',
            'benefits' => json_encode(['All Basic & Advanced Blood Tests', 'Full Body MRI Screening', 'CT Coronary Angiography', 'Advanced Cardiac Assessment', 'Pulmonary Function Test', 'Audiometry & Vision Test', 'Stress Management Consultation', 'Nutritionist Session', 'Personal Health Report Card', '1-Year Follow-Up Plan']),
            'price' => 399.99, 'original_price' => 599.99, 'category' => 'Premium', 'duration' => 'Full Day',
            'tests_included' => json_encode(['All Blood Tests', 'MRI', 'CT Coronary', 'PFT', 'Audiometry', 'Vision Test', 'ECG', '2D Echo']),
            'image' => '🏆', 'is_active' => true,
        ]);
        HealthPackage::create([
            'name' => 'Senior Citizen Package', 'description' => 'Tailored health assessment for senior citizens.',
            'benefits' => json_encode(['Complete Blood Count & ESR', 'Blood Sugar & HbA1c', 'Lipid & Liver Profile', 'Kidney Function & Electrolytes', 'Vitamin D, B12 & Calcium', 'Thyroid Profile', 'Prostate Screening (PSA)', 'Bone Density Scan', 'Geriatrician Consultation', 'Mobility & Balance Assessment']),
            'price' => 179.99, 'original_price' => 249.99, 'category' => 'Senior', 'duration' => '6-8 hours',
            'tests_included' => json_encode(['CBC', 'ESR', 'FBS', 'HbA1c', 'Lipid Profile', 'LFT', 'KFT', 'Vitamin D', 'B12', 'PSA']),
            'image' => '👴', 'is_active' => true,
        ]);

        DoctorAuditLog::create(['doctor_id' => 1, 'doctor_name' => 'Dr. Sarah Johnson', 'action' => 'login', 'details' => 'Logged in successfully', 'date' => '2024-06-15', 'time' => '09:30:00', 'ip_address' => '192.168.1.101', 'device' => 'Chrome / Windows', 'location' => 'New York, USA']);
        DoctorAuditLog::create(['doctor_id' => 1, 'doctor_name' => 'Dr. Sarah Johnson', 'action' => 'patientViewed', 'details' => 'Viewed patient John Doe (PAT-1001)', 'date' => '2024-06-15', 'time' => '09:35:00', 'ip_address' => '192.168.1.101', 'device' => 'Chrome / Windows', 'location' => 'New York, USA']);
        DoctorAuditLog::create(['doctor_id' => 2, 'doctor_name' => 'Dr. Michael Chen', 'action' => 'login', 'details' => 'Logged in successfully', 'date' => '2024-06-14', 'time' => '14:20:00', 'ip_address' => '10.0.0.55', 'device' => 'Safari / macOS', 'location' => 'Brooklyn, USA']);
        DoctorAuditLog::create(['doctor_id' => 3, 'doctor_name' => 'Dr. Emily Williams', 'action' => 'statusChanged', 'details' => 'Account suspended by Super Admin', 'date' => '2024-06-10', 'time' => '12:00:00', 'ip_address' => '192.168.1.1', 'device' => 'Chrome / Windows', 'location' => 'Admin Panel']);
    }
}

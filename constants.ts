export const MEDICAL_CONTEXT = `[COMPREHENSIVE ELECTRONIC HEALTH RECORD (EHR) - HIGH RISK / ACUTE ENCOUNTER]
Patient ID: 899-44-MRN
Name: Jonathan Elias Doe
DOB: 04/12/1978 (Age: 45)
Gender: Male
Date of Encounter: October 15, 2023 | Time: 13:45 EST
Facility: Creíble General Hospital, Emergency Department
Attending Physician: Dr. Alistair Smith, MD, FACC (Cardiology)
Triage Level: 2 (Emergent)

### 1. CHIEF COMPLAINT & HISTORY OF PRESENT ILLNESS (HPI)
Patient presents via EMS with a 3-day progressive history of intermittent chest tightness, described as a "heavy, crushing pressure" located substernally. Pain severity is 8/10 at peak. Pain radiates to the left shoulder and medial aspect of the left arm. He denies nausea, vomiting, or diaphoresis, but reports marked dyspnea upon mild exertion (e.g., walking up one flight of stairs). Symptoms have worsened over the last 12 hours. Nitroglycerin 0.4mg SL was administered by EMS en route with partial relief (pain reduced to 4/10). No history of syncope.

### 2. PAST MEDICAL & SURGICAL HISTORY
- Hypertension (HTN): Diagnosed in 2018. Poorly controlled due to reported medication non-adherence.
- Hyperlipidemia (HLD): Diagnosed in 2020.
- Type 2 Diabetes Mellitus (T2DM): Diagnosed in 2021. Latest HbA1c 7.8% (Sept 2023).
- Surgeries: Appendectomy (1995), Right Knee Arthroscopy (2010).

### 3. MEDICATIONS & ALLERGIES
- Lisinopril 20mg PO daily (Patient states he frequently misses doses)
- Atorvastatin 40mg PO daily
- Metformin 500mg PO BID
- ALLERGIES: Penicillin (Anaphylaxis), Sulfa drugs (Rash)

### 4. SOCIAL & FAMILY HISTORY
- Social: Smokes 1 pack per day (25 pack-year history). Occasional alcohol consumption (1-2 drinks/week). Denies illicit drug use.
- Family: Father died of Acute Myocardial Infarction at age 52. Mother alive (Age 70) with severe osteoporosis and HTN.

### 5. OBJECTIVE FINDINGS & TRIAGE VITALS
- BP: 165/95 mmHg (Elevated)
- HR: 92 bpm (Regular)
- Temp: 98.6°F (37.0°C)
- RR: 20 breaths/min
- SpO2: 95% on Room Air
- Weight: 215 lbs | BMI: 29.2

### 6. PHYSICAL EXAMINATION
- General: Anxious, mildly diaphoretic, lying in bed holding chest.
- HEENT: Normocephalic, atraumatic. Pupils PERRLA. No JVD.
- Lungs: Clear to auscultation bilaterally. No rales, rhonchi, or wheezing.
- Cardiovascular: Regular rate and rhythm. Normal S1 and S2. No S3, S4, murmurs, rubs, or gallops appreciated. Capillary refill < 2 seconds.
- Abdomen: Soft, non-tender, non-distended. Bowel sounds positive in all 4 quadrants.
- Extremities: No lower extremity edema. Peripheral pulses 2+ bilaterally.

### 7. DIAGNOSTIC RESULTS
- ECG (13:55 EST): Normal sinus rhythm at 90 bpm. Non-specific ST-T wave segment depressions in contiguous leads V4-V6 (>0.5mm). No acute ST-segment elevation.
- Cardiac Biomarkers (14:15 EST):
   - High-Sensitivity Troponin I (hs-cTnI): 85 ng/L (Reference: < 14 ng/L) - CRITICAL VALUE FLAGGED.
   - CK-MB: 8.5 ng/mL (Reference: < 5.0 ng/mL)
   - BNP: 150 pg/mL (Reference: < 100 pg/mL)
- Complete Blood Count (CBC): WBC 11.2, Hgb 14.5, Hct 44%, Plt 250k.
- Comprehensive Metabolic Panel (CMP): Na 140, K 4.2, Cl 102, CO2 24, BUN 18, Cr 1.1, Glucose 185 mg/dL.

### 8. ASSESSMENT & DIFFERENTIAL DIAGNOSIS
1. Primary Assessment: Non-ST Elevation Myocardial Infarction (NSTEMI) - Suspected based on acute chest pain presentation, ischemic ECG changes in lateral leads, and significantly elevated hs-cTnI. High TIMI risk score.
2. Secondary Assessment: Uncontrolled Essential Hypertension.
3. Secondary Assessment: Uncontrolled Type 2 Diabetes Mellitus.
Differential Diagnoses ruled down: Unstable Angina (ruled down due to positive troponins), Aortic Dissection (no tearing pain / wide mediastinum on recent CXR), Pulmonary Embolism (clear lungs, no hypoxia).

### 9. PLAN & ORDERS
1. Admission: Admit to Cardiac Intensive Care Unit (CICU) for continuous telemetry and hemodynamic monitoring.
2. Anti-Ischemic Therapy:
   - Nitroglycerin drip initiated at 5 mcg/min, titrate up to 200 mcg/min for pain relief, holding for Systolic BP < 90.
   - Metoprolol succinate 25mg PO daily.
3. Antiplatelet/Anticoagulant Protocol:
   - Aspirin 325mg chewed immediately (Administered at 14:00 - completed).
   - Clopidogrel 300mg loading dose, then 75mg daily.
   - Intravenous Unfractionated Heparin (UFH) drip initiated per weight-based acute coronary syndrome protocol.
4. Procedures: Consult Interventional Cardiology. Schedule urgent Left Heart Catheterization / Coronary Angiography within 24 hours.
5. Strict bed rest. NPO past midnight for anticipated catheterization.
6. Consult Dietary for cardiac ADA guidelines and smoking cessation education.

[LEGAL & HIPAA DISCLAIMER]
This EHR extract is highly confidential protected health information (PHI) governed by HIPAA. Unauthorized disclosure, duplication, or transmission is strictly prohibited and subject to federal penalties.`;

export const LEGAL_CONTEXT = `[CONFIDENTIAL MASTER CLOUD SERVICES & DATA PROCESSING AGREEMENT - EXCERPT]
Document ID: MSA-2023-ALPHA-OMEGA-992
Effective Date: November 1, 2023
Governing Law: State of Delaware, United States
Parties: 
1. Alpha Corporation, a Delaware C-Corporation ("Client" or "Data Controller")
2. Omega Infrastructure Solutions LLC, a California Limited Liability Company ("Provider" or "Data Processor")

### SECTION 4: CONFIDENTIALITY & PROPRIETARY RIGHTS
4.1. Designation of Confidential Information. "Confidential Information" shall mean any and all non-public, proprietary information disclosed by either Party ("Disclosing Party") to the other Party ("Receiving Party"), whether disclosed directly or indirectly, in writing, orally, electronically, or by inspection of tangible objects. This explicitly includes, but is not limited to, trade secrets, source code, algorithmic training data, customer lists, financial projections, PII (Personally Identifiable Information), and security audit logs, provided that such information is conspicuously marked as "Confidential," "Proprietary," or, given the nature of the information or the circumstances surrounding its disclosure, a reasonable person would deem it confidential.
4.2. Exclusions from Confidentiality. The strictures of Section 4.1 shall not apply to information that the Receiving Party can prove by documentary evidence: 
    (a) was already entirely in the public domain at the time of disclosure; 
    (b) became publicly available after disclosure through no breach of this Agreement by the Receiving Party; 
    (c) was lawfully received from a third party without restriction and without breach of any underlying confidentiality obligation; or 
    (d) was independently developed by the Receiving Party without access to or utilization of the Disclosing Party’s Confidential Information.
4.3. Standard of Care. The Receiving Party agrees to protect the Confidential Information with the same degree of care it uses to protect its own sensitive organizational data, but in no event less than a commercially reasonable standard of care. 

### SECTION 7: DATA PRIVACY, SECURITY, AND BREACH NOTIFICATION
7.1. Data Processing Addendum (DPA). Provider agrees to process all Client Data solely in accordance with the attached DPA (Exhibit B), ensuring compliance with the GDPR, CCPA, and CPRA.
7.2. Security Posture. Provider shall maintain organizational, physical, and technical safeguards in accordance with ISO/IEC 27001:2022 standards and SOC 2 Type II compliance.
7.3. Breach Notification Obligation. In the event of an unauthorized disclosure, access, or breach of Client Data ("Security Incident"), Provider must notify Client in writing (via email to security@alphacorp.com) without undue delay, and in absolutely no event later than forty-eight (48) hours after confirming the occurrence of the Security Incident.

### SECTION 8: TERM, TERMINATION, AND SURVIVAL
8.1. Term. The initial term of this Agreement shall be three (3) years from the Effective Date, automatically renewing for successive one (1) year periods unless either Party provides written notice of non-renewal at least sixty (60) days prior to the expiration of the current term.
8.2. Termination for Material Breach. Either Party may terminate this Agreement immediately upon definitive written notice if the other Party commits a material breach of its obligations herein and fails to wholly cure such breach within thirty (30) days of receiving detailed written notice specifying the breach. A breach of Section 4 (Confidentiality) or Section 7 (Security) shall be deemed an incurable material breach, allowing immediate termination without a cure period.
8.3. Effect of Termination & Data Extraction. Upon expiration or termination of this Agreement for any reason, Provider shall securely return all Client Data via an encrypted SFTP transfer within ten (10) business days. Following confirmation of successful transfer by Client, Provider must cryptographically shred all remaining instances of Client Data across all live and backup systems within an additional five (5) business days, providing a Certificate of Destruction signed by its CISO.
8.4. Survival. Sections 4, 7, 8.3, 9 (Indemnification), and 10 (Limitation of Liability) shall survive any termination or expiration of this Agreement.

[END OF LEGAL EXCERPT]`;

export const DEFAULT_CONTEXT = MEDICAL_CONTEXT;
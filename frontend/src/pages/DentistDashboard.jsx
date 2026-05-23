import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { apiRequest } from '../api/http.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function DentistDashboard() {
  const { language } = useLanguage();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [treatments, setTreatments] = useState([]);
  const [form, setForm] = useState({
    diagnosis: '',
    procedure: '',
    notes: '',
    treatmentDate: new Date().toISOString().slice(0, 10)
  });
  const [message, setMessage] = useState('');

  const labels = language === 'en'
    ? {
      title: 'Dentist Dashboard',
      summary: 'Dentists can view appointments, select patients and keep treatment history in one place.',
      overview: 'Overview', appointments: 'My Appointments', treatmentEntry: 'Treatment Entry', history: 'Treatment History',
      myAppointments: 'My Appointments', patientRecords: 'Patient Records', selectedTreatments: 'Selected Patient Records', date: 'Date', time: 'Time', patient: 'Patient', phone: 'Phone', service: 'Service', status: 'Status', action: 'Action',
      selectPatient: 'Select patient', addTreatmentTitle: 'Select Patient and Add Treatment Record', emailMissing: 'No email', noteMissing: 'No note', diagnosis: 'Diagnosis', procedure: 'Procedure', treatmentNotes: 'Treatment notes', saveTreatment: 'Add Treatment Record', emptyHistory: 'There is no treatment record for this patient yet.', additionalNote: 'No additional note.', dentist: 'Dentist'
    }
    : {
      title: 'Dentist Dashboard',
      summary: 'Diş hekimleri randevuları, hasta seçimini ve tedavi geçmişini tek panelden yönetir.',
      overview: 'Genel Bakış', appointments: 'Randevularım', treatmentEntry: 'Tedavi Kaydı', history: 'Tedavi Geçmişi',
      myAppointments: 'Kendi Randevularım', patientRecords: 'Hasta Kayıtları', selectedTreatments: 'Seçili Hastanın Tedavi Kaydı', date: 'Tarih', time: 'Saat', patient: 'Hasta', phone: 'Telefon', service: 'Hizmet', status: 'Durum', action: 'İşlem',
      selectPatient: 'Hasta seç', addTreatmentTitle: 'Hasta Seç ve Tedavi Kaydı Ekle', emailMissing: 'E-posta yok', noteMissing: 'Not yok', diagnosis: 'Tanı / Diagnosis', procedure: 'Uygulanan işlem / Procedure', treatmentNotes: 'Tedavi notları', saveTreatment: 'Tedavi Kaydı Ekle', emptyHistory: 'Bu hasta için henüz tedavi kaydı yok.', additionalNote: 'Ek not yok.', dentist: 'Diş hekimi'
    };

  const navItems = [
    { href: '#dentist-overview', label: labels.overview, code: '01' },
    { href: '#dentist-appointments', label: labels.appointments, code: '02' },
    { href: '#dentist-treatment-entry', label: labels.treatmentEntry, code: '03' },
    { href: '#dentist-treatment-history', label: labels.history, code: '04' }
  ];

  const selectedPatient = useMemo(
    () => patients.find((patient) => String(patient.id) === String(selectedPatientId)),
    [patients, selectedPatientId]
  );

  async function loadInitial() {
    const [appointmentsData, patientsData] = await Promise.all([
      apiRequest('/appointments'),
      apiRequest('/patients')
    ]);

    setAppointments(appointmentsData.appointments);
    setPatients(patientsData.patients);

    if (!selectedPatientId && patientsData.patients[0]) {
      setSelectedPatientId(String(patientsData.patients[0].id));
    }
  }

  async function loadTreatments(patientId) {
    if (!patientId) return;
    const data = await apiRequest(`/treatments/patient/${patientId}`);
    setTreatments(data.treatments);
  }

  useEffect(() => {
    loadInitial().catch((err) => setMessage(err.message));
  }, []);

  useEffect(() => {
    loadTreatments(selectedPatientId).catch((err) => setMessage(err.message));
  }, [selectedPatientId]);

  function updateForm(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function addTreatment(event) {
    event.preventDefault();
    setMessage('');

    try {
      await apiRequest('/treatments', {
        method: 'POST',
        body: JSON.stringify({
          patientId: Number(selectedPatientId),
          diagnosis: form.diagnosis,
          procedure: form.procedure,
          notes: form.notes,
          treatmentDate: form.treatmentDate
        })
      });

      setForm({
        diagnosis: '',
        procedure: '',
        notes: '',
        treatmentDate: new Date().toISOString().slice(0, 10)
      });
      setMessage(language === 'en' ? 'Treatment record was added.' : 'Tedavi kaydı eklendi.');
      await loadTreatments(selectedPatientId);
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function updateAppointmentStatus(id, status) {
    await apiRequest(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    await loadInitial();
  }

  return (
    <DashboardLayout title={labels.title} navItems={navItems} summary={labels.summary}>
      {message && <div className="alert">{message}</div>}

      <section className="dash-stats" id="dentist-overview">
        <div className="dash-stat-card"><span>{labels.myAppointments}</span><strong>{appointments.length}</strong></div>
        <div className="dash-stat-card"><span>{labels.patientRecords}</span><strong>{patients.length}</strong></div>
        <div className="dash-stat-card"><span>{labels.selectedTreatments}</span><strong>{treatments.length}</strong></div>
      </section>

      <section className="panel-card" id="dentist-appointments">
        <h2>{labels.myAppointments}</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>{labels.date}</th><th>{labels.time}</th><th>{labels.patient}</th><th>{labels.phone}</th><th>{labels.service}</th><th>{labels.status}</th><th>{labels.action}</th></tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.appointment_date?.slice(0, 10)}</td>
                  <td>{appointment.appointment_time?.slice(0, 5)}</td>
                  <td>{appointment.patient_name}</td>
                  <td>{appointment.patient_phone}</td>
                  <td>{appointment.service}</td>
                  <td><span className={`status ${appointment.status.toLowerCase()}`}>{appointment.status}</span></td>
                  <td>
                    <select value={appointment.status} onChange={(event) => updateAppointmentStatus(appointment.id, event.target.value)}>
                      <option>SCHEDULED</option>
                      <option>COMPLETED</option>
                      <option>CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dash-grid two">
        <article className="panel-card" id="dentist-treatment-entry">
          <h2>{labels.addTreatmentTitle}</h2>
          <form onSubmit={addTreatment} className="compact-form">
            <select value={selectedPatientId} onChange={(event) => setSelectedPatientId(event.target.value)} required>
              <option value="">{labels.selectPatient}</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name} — {patient.phone}
                </option>
              ))}
            </select>

            {selectedPatient && (
              <div className="patient-summary">
                <strong>{selectedPatient.first_name} {selectedPatient.last_name}</strong>
                <span>{selectedPatient.email || labels.emailMissing}</span>
                <span>{selectedPatient.notes || labels.noteMissing}</span>
              </div>
            )}

            <input name="treatmentDate" value={form.treatmentDate} onChange={updateForm} type="date" required />
            <input name="diagnosis" value={form.diagnosis} onChange={updateForm} placeholder={labels.diagnosis} required />
            <input name="procedure" value={form.procedure} onChange={updateForm} placeholder={labels.procedure} required />
            <textarea name="notes" value={form.notes} onChange={updateForm} placeholder={labels.treatmentNotes} />
            <button className="btn-primary full">{labels.saveTreatment}</button>
          </form>
        </article>

        <article className="panel-card" id="dentist-treatment-history">
          <h2>{labels.history}</h2>
          <div className="timeline">
            {treatments.length === 0 && <p className="empty-text">{labels.emptyHistory}</p>}

            {treatments.map((treatment) => (
              <div className="timeline-item" key={treatment.id}>
                <div className="timeline-date">{treatment.treatment_date?.slice(0, 10)}</div>
                <h3>{treatment.procedure}</h3>
                <p><strong>{labels.diagnosis}:</strong> {treatment.diagnosis}</p>
                <p>{treatment.notes || labels.additionalNote}</p>
                <small>{labels.dentist}: {treatment.dentist_name}</small>
              </div>
            ))}
          </div>
        </article>
      </section>
    </DashboardLayout>
  );
}

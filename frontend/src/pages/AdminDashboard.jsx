import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { apiRequest } from '../api/http.js';

export default function DentistDashboard() {
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
      setMessage('Tedavi kaydı eklendi.');
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
    <DashboardLayout title="Dentist Dashboard">
      {message && <div className="alert">{message}</div>}

      <section className="dash-stats">
        <div className="dash-stat-card"><span>Benim Randevularım</span><strong>{appointments.length}</strong></div>
        <div className="dash-stat-card"><span>Hasta Kayıtları</span><strong>{patients.length}</strong></div>
        <div className="dash-stat-card"><span>Seçili Hastanın Tedavi Kaydı</span><strong>{treatments.length}</strong></div>
      </section>

      <section className="panel-card">
        <h2>Kendi Randevularım</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Tarih</th><th>Saat</th><th>Hasta</th><th>Telefon</th><th>Hizmet</th><th>Durum</th><th>İşlem</th></tr>
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
        <article className="panel-card">
          <h2>Hasta Seç ve Tedavi Kaydı Ekle</h2>
          <form onSubmit={addTreatment} className="compact-form">
            <select value={selectedPatientId} onChange={(event) => setSelectedPatientId(event.target.value)} required>
              <option value="">Hasta seç</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name} — {patient.phone}
                </option>
              ))}
            </select>

            {selectedPatient && (
              <div className="patient-summary">
                <strong>{selectedPatient.first_name} {selectedPatient.last_name}</strong>
                <span>{selectedPatient.email || 'E-posta yok'}</span>
                <span>{selectedPatient.notes || 'Not yok'}</span>
              </div>
            )}

            <input name="treatmentDate" value={form.treatmentDate} onChange={updateForm} type="date" required />
            <input name="diagnosis" value={form.diagnosis} onChange={updateForm} placeholder="Tanı / Diagnosis" required />
            <input name="procedure" value={form.procedure} onChange={updateForm} placeholder="Uygulanan işlem / Procedure" required />
            <textarea name="notes" value={form.notes} onChange={updateForm} placeholder="Tedavi notları" />
            <button className="btn-primary full">Tedavi Kaydı Ekle</button>
          </form>
        </article>

        <article className="panel-card">
          <h2>Tedavi Geçmişi</h2>
          <div className="timeline">
            {treatments.length === 0 && <p className="empty-text">Bu hasta için henüz tedavi kaydı yok.</p>}

            {treatments.map((treatment) => (
              <div className="timeline-item" key={treatment.id}>
                <div className="timeline-date">{treatment.treatment_date?.slice(0, 10)}</div>
                <h3>{treatment.procedure}</h3>
                <p><strong>Tanı:</strong> {treatment.diagnosis}</p>
                <p>{treatment.notes || 'Ek not yok.'}</p>
                <small>{treatment.dentist_name}</small>
              </div>
            ))}
          </div>
        </article>
      </section>
    </DashboardLayout>
  );
}

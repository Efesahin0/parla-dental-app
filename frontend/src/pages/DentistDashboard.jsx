import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { apiRequest } from '../api/http.js';

const appointmentStatusLabels = {
  SCHEDULED: 'Planlandı',
  COMPLETED: 'Tamamlandı',
  CANCELLED: 'İptal Edildi'
};

const dentistMenuItems = [
  { id: 'hekim-ozeti', label: 'Hekim Özeti' },
  { id: 'randevularim', label: 'Randevularım' },
  { id: 'tedavi-kaydi', label: 'Tedavi Kaydı Ekle' },
  { id: 'tedavi-gecmisi', label: 'Tedavi Geçmişi' }
];

function getPatientIdFromAppointment(appointment) {
  return appointment.patient_id || appointment.patientId || appointment.patient?.id || '';
}

function buildPatientsFromAppointments(appointments) {
  const patientMap = new Map();

  appointments.forEach((appointment) => {
    const patientId = getPatientIdFromAppointment(appointment);

    if (!patientId || patientMap.has(String(patientId))) {
      return;
    }

    const fullName = appointment.patient_name || 'Hasta';
    const [firstName = '', ...lastNameParts] = String(fullName).split(' ');
    const lastName = lastNameParts.join(' ');

    patientMap.set(String(patientId), {
      id: patientId,
      first_name: firstName || fullName,
      last_name: lastName,
      full_name: fullName,
      phone: appointment.patient_phone || '-',
      email: appointment.patient_email || '',
      notes: appointment.patient_notes || ''
    });
  });

  return Array.from(patientMap.values());
}

export default function DentistDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [treatments, setTreatments] = useState([]);
  const [form, setForm] = useState({
    diagnosis: '',
    procedure: '',
    notes: '',
    treatmentDate: new Date().toISOString().slice(0, 10)
  });
  const [message, setMessage] = useState('');

  const patients = useMemo(
    () => buildPatientsFromAppointments(appointments),
    [appointments]
  );

  const selectedPatient = useMemo(
    () => patients.find((patient) => String(patient.id) === String(selectedPatientId)),
    [patients, selectedPatientId]
  );

  const completedAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.status === 'COMPLETED').length,
    [appointments]
  );

  async function loadInitial() {
    const appointmentsData = await apiRequest('/appointments');
    const loadedAppointments = appointmentsData.appointments || [];

    setAppointments(loadedAppointments);

    const patientList = buildPatientsFromAppointments(loadedAppointments);

    if (!selectedPatientId && patientList[0]) {
      setSelectedPatientId(String(patientList[0].id));
    }
  }

  async function loadTreatments(patientId) {
    if (!patientId) {
      setTreatments([]);
      return;
    }

    const data = await apiRequest(`/treatments/patient/${patientId}`);
    setTreatments(data.treatments || []);
  }

  useEffect(() => {
    loadInitial().catch((err) => setMessage(err.message));
  }, []);

  useEffect(() => {
    loadTreatments(selectedPatientId).catch((err) => setMessage(err.message));
  }, [selectedPatientId]);

  function updateForm(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
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

      setMessage('Tedavi kaydı başarıyla eklendi.');
      await loadTreatments(selectedPatientId);
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function updateAppointmentStatus(id, status) {
    setMessage('');

    try {
      await apiRequest(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });

      setMessage('Randevu durumu güncellendi.');
      await loadInitial();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <DashboardLayout title="Diş Hekimi Paneli" menuItems={dentistMenuItems}>
      {message && <div className="alert">{message}</div>}

      <section id="hekim-ozeti" className="dash-stats">
        <div className="dash-stat-card">
          <span>Benim Randevularım</span>
          <strong>{appointments.length}</strong>
        </div>

        <div className="dash-stat-card">
          <span>Tamamlanan Randevu</span>
          <strong>{completedAppointments}</strong>
        </div>

        <div className="dash-stat-card">
          <span>Seçili Hastanın Tedavi Kaydı</span>
          <strong>{treatments.length}</strong>
        </div>
      </section>

      <section id="randevularim" className="panel-card">
        <h2>Kendi Randevularım</h2>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Saat</th>
                <th>Hasta</th>
                <th>Telefon</th>
                <th>Hizmet</th>
                <th>Durum</th>
                <th>İşlem</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.appointment_date?.slice(0, 10)}</td>
                  <td>{appointment.appointment_time?.slice(0, 5)}</td>
                  <td>{appointment.patient_name}</td>
                  <td>{appointment.patient_phone}</td>
                  <td>{appointment.service}</td>
                  <td>
                    <span className={`status ${appointment.status.toLowerCase()}`}>
                      {appointmentStatusLabels[appointment.status] || appointment.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={appointment.status}
                      onChange={(event) => updateAppointmentStatus(appointment.id, event.target.value)}
                    >
                      <option value="SCHEDULED">Planlandı</option>
                      <option value="COMPLETED">Tamamlandı</option>
                      <option value="CANCELLED">İptal Edildi</option>
                    </select>
                  </td>
                </tr>
              ))}

              {appointments.length === 0 && (
                <tr>
                  <td colSpan="7">Henüz randevu kaydı bulunmuyor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dash-grid two">
        <article id="tedavi-kaydi" className="panel-card">
          <h2>Hasta Seç ve Tedavi Kaydı Ekle</h2>

          <form onSubmit={addTreatment} className="compact-form">
            <select
              value={selectedPatientId}
              onChange={(event) => setSelectedPatientId(event.target.value)}
              required
            >
              <option value="">Hasta seç</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.full_name || `${patient.first_name} ${patient.last_name}`} — {patient.phone}
                </option>
              ))}
            </select>

            {selectedPatient && (
              <div className="patient-summary">
                <strong>
                  {selectedPatient.full_name || `${selectedPatient.first_name} ${selectedPatient.last_name}`}
                </strong>
                <span>{selectedPatient.phone || '-'}</span>
                <span>{selectedPatient.email || 'E-posta bilgisi yok'}</span>
                <span>{selectedPatient.notes || 'Hasta notu yok'}</span>
              </div>
            )}

            {!selectedPatient && (
              <p className="empty-text">
                Tedavi kaydı eklemek için önce bir hasta randevusu bulunmalıdır.
              </p>
            )}

            <input
              name="treatmentDate"
              value={form.treatmentDate}
              onChange={updateForm}
              type="date"
              required
            />

            <input
              name="diagnosis"
              value={form.diagnosis}
              onChange={updateForm}
              placeholder="Tanı"
              required
            />

            <input
              name="procedure"
              value={form.procedure}
              onChange={updateForm}
              placeholder="Uygulanan işlem"
              required
            />

            <textarea
              name="notes"
              value={form.notes}
              onChange={updateForm}
              placeholder="Tedavi notları"
            />

            <button className="btn-primary full" disabled={!selectedPatientId}>
              Tedavi Kaydı Ekle
            </button>
          </form>
        </article>

        <article id="tedavi-gecmisi" className="panel-card">
          <h2>Tedavi Geçmişi</h2>

          <div className="timeline">
            {treatments.length === 0 && (
              <p className="empty-text">
                Bu hasta için henüz tedavi kaydı yok.
              </p>
            )}

            {treatments.map((treatment) => (
              <div className="timeline-item" key={treatment.id}>
                <div className="timeline-date">
                  {treatment.treatment_date?.slice(0, 10)}
                </div>

                <h3>{treatment.procedure}</h3>

                <p>
                  <strong>Tanı:</strong> {treatment.diagnosis}
                </p>

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
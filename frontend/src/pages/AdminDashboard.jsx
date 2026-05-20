import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { apiRequest } from '../api/http.js';

const emptyPatient = {
  firstName: '',
  lastName: '',
  nationalId: '',
  phone: '',
  email: '',
  birthDate: '',
  gender: '',
  address: '',
  notes: ''
};

const emptyAppointment = {
  patientId: '',
  dentistId: '',
  appointmentDate: '',
  appointmentTime: '09:00',
  service: 'Genel Muayene',
  notes: ''
};

export default function AdminDashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [requests, setRequests] = useState([]);
  const [patientForm, setPatientForm] = useState(emptyPatient);
  const [appointmentForm, setAppointmentForm] = useState(emptyAppointment);
  const [message, setMessage] = useState('');

  const stats = useMemo(() => ({
    patients: patients.length,
    appointments: appointments.length,
    requests: requests.filter((item) => item.status === 'NEW').length
  }), [patients, appointments, requests]);

  async function loadAll() {
    const [patientsData, appointmentsData, dentistsData, requestsData] = await Promise.all([
      apiRequest('/patients'),
      apiRequest('/appointments'),
      apiRequest('/appointments/dentists'),
      apiRequest('/appointment-requests')
    ]);

    setPatients(patientsData.patients);
    setAppointments(appointmentsData.appointments);
    setDentists(dentistsData.dentists);
    setRequests(requestsData.requests);
  }

  useEffect(() => {
    loadAll().catch((err) => setMessage(err.message));
  }, []);

  function updatePatient(event) {
    setPatientForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function updateAppointment(event) {
    setAppointmentForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function createPatient(event) {
    event.preventDefault();
    setMessage('');

    try {
      await apiRequest('/patients', {
        method: 'POST',
        body: JSON.stringify(patientForm)
      });

      setPatientForm(emptyPatient);
      setMessage('Hasta başarıyla eklendi.');
      await loadAll();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function createAppointment(event) {
    event.preventDefault();
    setMessage('');

    try {
      await apiRequest('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          ...appointmentForm,
          patientId: Number(appointmentForm.patientId),
          dentistId: Number(appointmentForm.dentistId)
        })
      });

      setAppointmentForm(emptyAppointment);
      setMessage('Randevu başarıyla oluşturuldu.');
      await loadAll();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function updateRequestStatus(id, status) {
    await apiRequest(`/appointment-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    await loadAll();
  }

  async function updateAppointmentStatus(id, status) {
    await apiRequest(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    await loadAll();
  }

  return (
    <DashboardLayout title="Admin / Receptionist Dashboard">
      {message && <div className="alert">{message}</div>}

      <section className="dash-stats">
        <div className="dash-stat-card"><span>Hasta Sayısı</span><strong>{stats.patients}</strong></div>
        <div className="dash-stat-card"><span>Randevu Sayısı</span><strong>{stats.appointments}</strong></div>
        <div className="dash-stat-card"><span>Yeni Talep</span><strong>{stats.requests}</strong></div>
      </section>

      <section className="dash-grid two">
        <article className="panel-card">
          <h2>Yeni Hasta Ekle</h2>
          <form onSubmit={createPatient} className="compact-form">
            <div className="form-row">
              <input name="firstName" value={patientForm.firstName} onChange={updatePatient} required placeholder="Ad" />
              <input name="lastName" value={patientForm.lastName} onChange={updatePatient} required placeholder="Soyad" />
            </div>
            <div className="form-row">
              <input name="nationalId" value={patientForm.nationalId} onChange={updatePatient} placeholder="TC / Kimlik No" />
              <input name="phone" value={patientForm.phone} onChange={updatePatient} required placeholder="Telefon" />
            </div>
            <div className="form-row">
              <input name="email" value={patientForm.email} onChange={updatePatient} type="email" placeholder="E-posta" />
              <input name="birthDate" value={patientForm.birthDate} onChange={updatePatient} type="date" />
            </div>
            <div className="form-row">
              <select name="gender" value={patientForm.gender} onChange={updatePatient}>
                <option value="">Cinsiyet</option>
                <option value="Female">Kadın</option>
                <option value="Male">Erkek</option>
                <option value="Other">Diğer</option>
              </select>
              <input name="address" value={patientForm.address} onChange={updatePatient} placeholder="Adres" />
            </div>
            <textarea name="notes" value={patientForm.notes} onChange={updatePatient} placeholder="Notlar" />
            <button className="btn-primary full">Hasta Ekle</button>
          </form>
        </article>

        <article className="panel-card">
          <h2>Randevu Oluştur</h2>
          <form onSubmit={createAppointment} className="compact-form">
            <select name="patientId" value={appointmentForm.patientId} onChange={updateAppointment} required>
              <option value="">Hasta seç</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name}
                </option>
              ))}
            </select>

            <select name="dentistId" value={appointmentForm.dentistId} onChange={updateAppointment} required>
              <option value="">Diş hekimi seç</option>
              {dentists.map((dentist) => (
                <option key={dentist.id} value={dentist.id}>
                  {dentist.name} — {dentist.specialization}
                </option>
              ))}
            </select>

            <div className="form-row">
              <input name="appointmentDate" value={appointmentForm.appointmentDate} onChange={updateAppointment} type="date" required />
              <input name="appointmentTime" value={appointmentForm.appointmentTime} onChange={updateAppointment} type="time" required />
            </div>

            <input name="service" value={appointmentForm.service} onChange={updateAppointment} placeholder="Hizmet" required />
            <textarea name="notes" value={appointmentForm.notes} onChange={updateAppointment} placeholder="Randevu notu" />
            <button className="btn-primary full">Randevu Oluştur</button>
          </form>
        </article>
      </section>

      <section className="panel-card">
        <h2>Hastalar</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Ad Soyad</th><th>Telefon</th><th>E-posta</th><th>Not</th></tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.first_name} {patient.last_name}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.email || '-'}</td>
                  <td>{patient.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel-card">
        <h2>Randevular</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Tarih</th><th>Saat</th><th>Hasta</th><th>Dentist</th><th>Hizmet</th><th>Durum</th><th>İşlem</th></tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.appointment_date?.slice(0, 10)}</td>
                  <td>{appointment.appointment_time?.slice(0, 5)}</td>
                  <td>{appointment.patient_name}</td>
                  <td>{appointment.dentist_name}</td>
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

      <section className="panel-card">
        <h2>Web Sitesinden Gelen Randevu Talepleri</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Tarih</th><th>Ad Soyad</th><th>Telefon</th><th>Hizmet</th><th>Tercih</th><th>Durum</th><th>İşlem</th></tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.created_at?.slice(0, 10)}</td>
                  <td>{request.full_name}</td>
                  <td>{request.phone}</td>
                  <td>{request.service}</td>
                  <td>{request.preferred_date?.slice(0, 10) || '-'} / {request.preferred_time || '-'}</td>
                  <td><span className={`status ${request.status.toLowerCase()}`}>{request.status}</span></td>
                  <td>
                    <select value={request.status} onChange={(event) => updateRequestStatus(request.id, event.target.value)}>
                      <option>NEW</option>
                      <option>CONTACTED</option>
                      <option>CLOSED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}

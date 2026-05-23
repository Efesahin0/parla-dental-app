import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { apiRequest } from '../api/http.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

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
  const { language } = useLanguage();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [requests, setRequests] = useState([]);
  const [patientForm, setPatientForm] = useState(emptyPatient);
  const [appointmentForm, setAppointmentForm] = useState(emptyAppointment);
  const [message, setMessage] = useState('');

  const labels = language === 'en'
    ? {
      title: 'Admin / Receptionist Dashboard',
      summary: 'Patient intake, appointment planning and website requests are managed from this panel.',
      overview: 'Overview', addPatient: 'Add Patient', createAppointment: 'Create Appointment', patientList: 'Patients', appointmentList: 'Appointments', requestList: 'Website Requests',
      patientCount: 'Patients', appointmentCount: 'Appointments', newRequests: 'New Requests', newPatient: 'New Patient', firstName: 'First Name', lastName: 'Last Name', id: 'ID Number', phone: 'Phone', email: 'Email', gender: 'Gender', female: 'Female', male: 'Male', other: 'Other', address: 'Address', notes: 'Notes', savePatient: 'Save Patient',
      selectPatient: 'Select patient', selectDentist: 'Select dentist', service: 'Service', appointmentNote: 'Appointment note', saveAppointment: 'Create Appointment',
      fullName: 'Full Name', dentist: 'Dentist', status: 'Status', action: 'Action', date: 'Date', time: 'Time', preference: 'Preference', noValue: '-'
    }
    : {
      title: 'Admin / Receptionist Dashboard',
      summary: 'Hasta kabul, randevu planlama ve web talepleri bu panelden yönetilir.',
      overview: 'Genel Bakış', addPatient: 'Hasta Ekle', createAppointment: 'Randevu Oluştur', patientList: 'Hastalar', appointmentList: 'Randevular', requestList: 'Web Talepleri',
      patientCount: 'Hasta Sayısı', appointmentCount: 'Randevu Sayısı', newRequests: 'Yeni Talep', newPatient: 'Yeni Hasta Ekle', firstName: 'Ad', lastName: 'Soyad', id: 'TC / Kimlik No', phone: 'Telefon', email: 'E-posta', gender: 'Cinsiyet', female: 'Kadın', male: 'Erkek', other: 'Diğer', address: 'Adres', notes: 'Notlar', savePatient: 'Hasta Ekle',
      selectPatient: 'Hasta seç', selectDentist: 'Diş hekimi seç', service: 'Hizmet', appointmentNote: 'Randevu notu', saveAppointment: 'Randevu Oluştur',
      fullName: 'Ad Soyad', dentist: 'Dentist', status: 'Durum', action: 'İşlem', date: 'Tarih', time: 'Saat', preference: 'Tercih', noValue: '-'
    };

  const navItems = [
    { href: '#admin-overview', label: labels.overview, code: '01' },
    { href: '#admin-patient-form', label: labels.addPatient, code: '02' },
    { href: '#admin-appointment-form', label: labels.createAppointment, code: '03' },
    { href: '#admin-patients', label: labels.patientList, code: '04' },
    { href: '#admin-appointments', label: labels.appointmentList, code: '05' },
    { href: '#admin-requests', label: labels.requestList, code: '06' }
  ];

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
      setMessage(language === 'en' ? 'Patient was added successfully.' : 'Hasta başarıyla eklendi.');
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
      setMessage(language === 'en' ? 'Appointment was created successfully.' : 'Randevu başarıyla oluşturuldu.');
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
    <DashboardLayout title={labels.title} navItems={navItems} summary={labels.summary}>
      {message && <div className="alert">{message}</div>}

      <section className="dash-stats" id="admin-overview">
        <div className="dash-stat-card"><span>{labels.patientCount}</span><strong>{stats.patients}</strong></div>
        <div className="dash-stat-card"><span>{labels.appointmentCount}</span><strong>{stats.appointments}</strong></div>
        <div className="dash-stat-card"><span>{labels.newRequests}</span><strong>{stats.requests}</strong></div>
      </section>

      <section className="dash-grid two">
        <article className="panel-card" id="admin-patient-form">
          <h2>{labels.newPatient}</h2>
          <form onSubmit={createPatient} className="compact-form">
            <div className="form-row">
              <input name="firstName" value={patientForm.firstName} onChange={updatePatient} required placeholder={labels.firstName} />
              <input name="lastName" value={patientForm.lastName} onChange={updatePatient} required placeholder={labels.lastName} />
            </div>
            <div className="form-row">
              <input name="nationalId" value={patientForm.nationalId} onChange={updatePatient} placeholder={labels.id} />
              <input name="phone" value={patientForm.phone} onChange={updatePatient} required placeholder={labels.phone} />
            </div>
            <div className="form-row">
              <input name="email" value={patientForm.email} onChange={updatePatient} type="email" placeholder={labels.email} />
              <input name="birthDate" value={patientForm.birthDate} onChange={updatePatient} type="date" />
            </div>
            <div className="form-row">
              <select name="gender" value={patientForm.gender} onChange={updatePatient}>
                <option value="">{labels.gender}</option>
                <option value="Female">{labels.female}</option>
                <option value="Male">{labels.male}</option>
                <option value="Other">{labels.other}</option>
              </select>
              <input name="address" value={patientForm.address} onChange={updatePatient} placeholder={labels.address} />
            </div>
            <textarea name="notes" value={patientForm.notes} onChange={updatePatient} placeholder={labels.notes} />
            <button className="btn-primary full">{labels.savePatient}</button>
          </form>
        </article>

        <article className="panel-card" id="admin-appointment-form">
          <h2>{labels.createAppointment}</h2>
          <form onSubmit={createAppointment} className="compact-form">
            <select name="patientId" value={appointmentForm.patientId} onChange={updateAppointment} required>
              <option value="">{labels.selectPatient}</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name}
                </option>
              ))}
            </select>

            <select name="dentistId" value={appointmentForm.dentistId} onChange={updateAppointment} required>
              <option value="">{labels.selectDentist}</option>
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

            <input name="service" value={appointmentForm.service} onChange={updateAppointment} placeholder={labels.service} required />
            <textarea name="notes" value={appointmentForm.notes} onChange={updateAppointment} placeholder={labels.appointmentNote} />
            <button className="btn-primary full">{labels.saveAppointment}</button>
          </form>
        </article>
      </section>

      <section className="panel-card" id="admin-patients">
        <h2>{labels.patientList}</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>{labels.fullName}</th><th>{labels.phone}</th><th>{labels.email}</th><th>{labels.notes}</th></tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.first_name} {patient.last_name}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.email || labels.noValue}</td>
                  <td>{patient.notes || labels.noValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel-card" id="admin-appointments">
        <h2>{labels.appointmentList}</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>{labels.date}</th><th>{labels.time}</th><th>{labels.fullName}</th><th>{labels.dentist}</th><th>{labels.service}</th><th>{labels.status}</th><th>{labels.action}</th></tr>
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

      <section className="panel-card" id="admin-requests">
        <h2>{labels.requestList}</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>{labels.date}</th><th>{labels.fullName}</th><th>{labels.phone}</th><th>{labels.service}</th><th>{labels.preference}</th><th>{labels.status}</th><th>{labels.action}</th></tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.created_at?.slice(0, 10)}</td>
                  <td>{request.full_name}</td>
                  <td>{request.phone}</td>
                  <td>{request.service}</td>
                  <td>{request.preferred_date?.slice(0, 10) || labels.noValue} / {request.preferred_time || labels.noValue}</td>
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

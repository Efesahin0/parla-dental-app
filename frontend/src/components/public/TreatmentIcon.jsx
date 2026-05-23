import {
  FaBaby,
  FaRegSmile,
  FaShieldAlt,
  FaSyringe,
  FaTeethOpen,
  FaTooth,
  FaUserMd
} from 'react-icons/fa';

function getTreatmentIcon(title = '') {
  const normalizedTitle = title.toLocaleLowerCase('tr-TR');

  if (normalizedTitle.includes('estetik')) {
    return <FaRegSmile />;
  }

  if (normalizedTitle.includes('implant')) {
    return <FaTooth />;
  }

  if (normalizedTitle.includes('protetik')) {
    return <FaTeethOpen />;
  }

  if (normalizedTitle.includes('koruyucu') || normalizedTitle.includes('restoratif')) {
    return <FaShieldAlt />;
  }

  if (normalizedTitle.includes('cerrahi')) {
    return <FaSyringe />;
  }

  if (normalizedTitle.includes('ortodontik')) {
    return <FaUserMd />;
  }

  if (normalizedTitle.includes('çocuk')) {
    return <FaBaby />;
  }

  return <FaTooth />;
}

export default function TreatmentIcon({ title }) {
  return (
    <span className="treatment-icon" aria-hidden="true">
      {getTreatmentIcon(title)}
    </span>
  );
}
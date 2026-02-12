import Swal, { SweetAlertIcon } from 'sweetalert2';
import '../../styles/SolarAlert.css';

export const showSolarAlert = async (icon: SweetAlertIcon, title: string, message: string) => {
  await Swal.fire({
    icon,
    title,
    text: message,
    confirmButtonText: 'Aceptar',
    buttonsStyling: false,
    iconColor: '#f5a63f',
    // --- ESTO RECUPERA EL COLOR OSCURO ---
    background: '#1c1c1c', 
    color: '#ffffff',
    // -------------------------------------
    customClass: {
      popup: 'solar-popup',
      title: 'solar-title',
      htmlContainer: 'solar-content',
      confirmButton: 'solar-confirm-btn'
    },
    padding: '2.5rem'
  });
};
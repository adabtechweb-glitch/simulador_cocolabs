// figma/src/app/components/alert-custom.tsx
import Swal, { SweetAlertIcon } from 'sweetalert2';
import '../../styles/SolarAlert.css'; // Ruta corregida según tu tree

export const showSolarAlert = async (icon: SweetAlertIcon, title: string, message: string) => {
  await Swal.fire({
    icon,
    title,
    text: message,
    confirmButtonText: 'Aceptar',
    buttonsStyling: false,
    iconColor: '#f5a63f',
    customClass: {
      popup: 'solar-popup',
      title: 'solar-title',
      htmlContainer: 'solar-content',
      confirmButton: 'solar-confirm-btn'
    },
    // Opcional: Centrar el icono con el estilo del simulador
    padding: '2.5rem'
  });
};
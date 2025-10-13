// Paleta de colores de Senda Segura

export const colors = {
  orange1: '#BC6C25',        
  orange2: '#DDA15E',        
  beige: '#DAD7CD',        
  sage: '#A3B18A',         
  forest: '#588157',  
  forestDark1: '#3A5A40', 
  forestDark2: '#344E41',  
  
  // Colores principales
  primary: '#588157',        // Verde bosque principal
  primaryDark: '#344E41',    // Verde bosque más oscuro
  primaryLight: '#A3B18A',   // Verde sage claro
  
  // Colores secundarios
  secondary: '#BC6C25',      
  secondaryDark: '#BC6C25',  
  secondaryLight: '#DDA15E',

  
  // Colores de dificultad de rutas (por verse)
  rutaPrincipiante: '#588157',      
  rutaIntermedia: '#007AFF', 
  rutaExperto: '#363636ff',      
  
  // Grises y neutros
  dark: '#212529',           // Texto principal
  darkGray: '#495057',       // Texto secundario
  gray: '#6c757d',           // Texto auxiliar
  lightGray: '#adb5bd',      // Bordes
  light: '#f8f9fa',          // Fondo principal
  white: '#ffffff',          
  
  // Colores de fondo
  background: '#f8f9fa',     // Fondo principal de la app
  cardBackground: '#ffffff', // Fondo de tarjetas
  modalBackground: 'rgba(0, 0, 0, 0.5)', // Overlay de modales
  
  
  // Transparencias
  transparent: 'transparent',
  semiTransparent: 'rgba(255, 255, 255, 0.8)',
  darkSemiTransparent: 'rgba(0, 0, 0, 0.3)',
};

// Gradientes temáticos (por si acaso?)
export const gradients = {
  primaryGradient: ['#588157', '#A3B18A'],
  forestGradient: ['#344E41', '#3A5A40', '#588157'],
  sunsetGradient: ['#BC6C25', '#DDA15E'],
  emergencyGradient: ['#BC6C25', '#DDA15E'],
  naturalGradient: ['#DAD7CD', '#A3B18A', '#588157'],
};


export default colors;
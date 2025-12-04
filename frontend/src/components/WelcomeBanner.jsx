import { useState } from 'react';

const WelcomeBanner = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  
  const today = new Date();
  let formattedDate = '';
  try {
    formattedDate = today.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    formattedDate = today.toLocaleDateString('es-ES');
  }

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Feliz' },
    { id: 'neutral', emoji: '😐', label: 'Seria' },
    { id: 'tired', emoji: '😴', label: 'Cansada' },
    { id: 'anxious', emoji: '😰', label: 'Ansiosa' },
    { id: 'angry', emoji: '😠', label: 'Enojada' },
    { id: 'love', emoji: '🥰', label: 'Amorosa' },
  ];

  return (
    <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-xl shadow-lg p-6 mb-6 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Mensaje de bienvenida y fecha */}
        <div className="flex-1">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            ¡Bienvenida Camila! 👋
          </h2>
          <p className="text-green-100 text-sm md:text-base">
            {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
          </p>
        </div>

        {/* Selector de estado de ánimo */}
        <div className="flex flex-col items-start md:items-end gap-3">
          <p className="text-lg font-semibold text-white">
            ¿Cómo estamos hoy?
          </p>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => {
              const isSelected = selectedMood === mood.id;
              
              return (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200
                    ${isSelected 
                      ? 'bg-white text-green-600 shadow-lg scale-110' 
                      : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white'
                    }
                  `}
                  title={mood.label}
                >
                  <span className="text-xl">{mood.emoji}</span>
                  <span className="text-sm font-medium hidden sm:inline">
                    {mood.label}
                  </span>
                </button>
              );
            })}
          </div>
          {selectedMood && (
            <p className="text-sm text-green-100 animate-pulse">
              ¡Gracias por compartir cómo te sientes! 💙
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;


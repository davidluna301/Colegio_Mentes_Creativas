import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold text-orange-600">
        ¡Bienvenidos a Colegio Mentes Creativas! 🌈
      </h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
        Una plataforma educativa interactiva donde aprender es divertido.
        Explora nuestros programas, juegos y recursos para potenciar tu
        creatividad y aprendizaje.
      </p>
      <img
        src="https://cdn-icons-png.flaticon.com/512/201/201818.png"
        alt="Niños aprendiendo"
        className="mx-auto w-60 rounded-2xl shadow-lg hover:scale-105 transition-transform"
      />
    </div>
  );
};

export default HomePage;

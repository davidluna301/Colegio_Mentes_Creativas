import { useState } from "react";

export default function PasswordValidator() {
  const [password, setPassword] = useState("");

  // Funciones de validación
  const rules = [
    {
      label: "Al menos 8 caracteres",
      test: (pwd: string) => pwd.length >= 8,
    },
    {
      label: "Contiene un número",
      test: (pwd: string) => /\d/.test(pwd),
    },
    {
      label: "Contiene una letra mayúscula",
      test: (pwd: string) => /[A-Z]/.test(pwd),
    },
  ];

  return (
    <div className="h-full w-full p-6">
      <h1 className="text-2xl font-bold mb-4">Validador de Contraseña</h1>

      <div className="flex flex-col gap-4 max-w-sm">
        <label className="flex flex-col">
          <span className="mb-1 font-medium">Ingrese una contraseña:</span>
          <input
            type="password"
            className="border rounded-lg p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Escriba su contraseña"
          />
        </label>

        <div className="bg-gray-50 rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold mb-2">Requisitos:</h2>
          <ul className="space-y-1">
            {rules.map((rule, index) => {
              const valid = rule.test(password);
              console.log(valid);
              return (
                <li
                  key={index}
                  className={`flex items-center gap-2 ${
                    valid ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {valid ? "✔️" : "❌"} {rule.label}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

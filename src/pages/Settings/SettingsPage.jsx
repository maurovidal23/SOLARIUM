export default function SettingsPage() {
  return (
    <div className="flex-1 px-4 pt-6 pb-24 max-w-lg mx-auto w-full space-y-4">
      <header>
        <h1 className="text-xl font-bold">Ajustes</h1>
      </header>

      <div className="bg-slate-800/50 rounded-xl p-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-300">Sobre Solarium</h3>
          <p className="text-xs text-slate-500 mt-1">
            App para monitorizar tu exposición solar diaria. Versión 1.0.0
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-300">Próximas funciones</h3>
          <ul className="text-xs text-slate-500 mt-1 space-y-1 list-disc list-inside">
            <li>Selector de partes del cuerpo</li>
            <li>Integración con índice UV</li>
            <li>Objetivos diarios personalizados</li>
            <li>Alertas y recomendaciones</li>
            <li>Exportación de datos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

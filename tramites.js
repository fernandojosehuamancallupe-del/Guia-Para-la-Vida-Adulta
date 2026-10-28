// Bloques nuevos de trámites. Para agregar uno: copia una fila y edítala.
// Formato: [icono, color, título, descripción, modalidad(o/p/m), [["Etiqueta","texto"],...], link, textoLink]
(function () {
  const M = { o: '<span class="pill pill-online"><i class="fas fa-wifi"></i> Online</span>',
              p: '<span class="pill pill-presencial"><i class="fas fa-building"></i> Presencial</span>',
              m: '<span class="pill pill-online"><i class="fas fa-wifi"></i> Online</span> <span class="pill pill-presencial"><i class="fas fa-building"></i> Presencial</span>' };
  const G = 'https://www.gob.pe/';
  const BLOQUES = [
    { id: 'documentos', icono: 'fa-folder-open', titulo: 'Documentos y antecedentes', sub: 'Los papeles que te piden para casi todo.', items: [
      ['fa-baby', 'rojo', 'Partida de nacimiento', 'Tu documento base: te lo piden para DNI, pasaporte, matrimonio y más.', 'm',
        [['Dónde', 'RENIEC (agencias o en línea) o la municipalidad donde te inscribieron.'], ['Qué pedir', 'Copia certificada del acta de nacimiento.'], ['Tip', 'Pídela con tiempo si te la solicitan para un trámite en el extranjero.']], G + 'reniec', 'RENIEC en gob.pe'],
      ['fa-user-shield', 'terracota', 'Antecedentes policiales', 'Certificado de la PNP que muestra si tienes denuncias o requisitorias.', 'm',
        [['Necesitas', 'DNI y pago de la tasa vigente.'], ['Dónde', 'Policía Nacional del Perú; hay solicitud en línea.'], ['Usos', 'Trabajo, becas, brevete y viajes.']], G + 'pnp', 'Policía Nacional (PNP)'],
      ['fa-gavel', 'marron', 'Antecedentes penales', 'Certificado del Poder Judicial que indica si tienes condenas registradas.', 'm',
        [['Necesitas', 'DNI y pago de la tasa vigente.'], ['Dónde', 'Poder Judicial, en línea o en sus oficinas.'], ['Tip', 'Revisa la vigencia que exige la entidad que te lo pide.']], 'https://www.pj.gob.pe', 'Poder Judicial'],
      ['fa-stamp', 'dorado', 'Apostilla de documentos', 'Valida tus documentos peruanos para usarlos en otros países.', 'm',
        [['Sirve para', 'Países del Convenio de La Haya (estudios, trabajo o residencia afuera).'], ['Dónde', 'Ministerio de Relaciones Exteriores.'], ['Ojo', 'Si el país destino no es parte del convenio, se hace legalización.']], G + 'rree', 'Cancillería (RREE)']
    ]},
    { id: 'trabajo', icono: 'fa-briefcase', titulo: 'Trabajo y emprendimiento', sub: 'Tu primer empleo, tus derechos y tu propio negocio.', items: [
      ['fa-file-circle-check', 'verde', 'Certijoven (Certificado Único Laboral)', 'Reúne tus antecedentes y datos laborales en un solo documento gratuito.', 'o',
        [['Para qué', 'Postular a empleos sin tramitar cada certificado por separado.'], ['Dónde', 'Ministerio de Trabajo (MTPE), en línea.'], ['Costo', 'Gratuito.']], G + 'mtpe', 'Ministerio de Trabajo'],
      ['fa-piggy-bank', 'rojo', 'AFP / ONP (pensiones)', 'Al trabajar en planilla se descuenta un aporte para tu jubilación.', 'm',
        [['ONP', 'Sistema público, aporte fijo.'], ['AFP', 'Cuenta individual que administra una AFP.'], ['Tip', 'Compara comisiones y rentabilidad en la SBS antes de elegir.']], 'https://www.sbs.gob.pe', 'SBS'],
      ['fa-sack-dollar', 'dorado', 'CTS', 'Un ahorro que el empleador te deposita por tiempo trabajado, útil ante un despido.', 'p',
        [['Depósitos', 'Dos veces al año: mayo y noviembre.'], ['Tú eliges', 'El banco o entidad donde se deposita.'], ['Ojo', 'Pregunta si tu tipo de contrato la incluye.']], G + 'mtpe', 'Ministerio de Trabajo'],
      ['fa-file-signature', 'terracota', 'Contrato de trabajo', 'Lo que firmas define tu sueldo, horario y beneficios. Léelo completo.', 'p',
        [['Revisa', 'Sueldo, duración, horario, funciones y periodo de prueba.'], ['Derechos', 'Boleta de pago, gratificaciones (julio y diciembre) y vacaciones.'], ['Reclamos', 'SUNAFIL atiende denuncias laborales.']], G + 'sunafil', 'SUNAFIL'],
      ['fa-lightbulb', 'marron', 'Registro de marca (INDECOPI)', 'Protege el nombre o logo de tu emprendimiento para que nadie más lo use.', 'm',
        [['Paso 1', 'Busca que no exista una marca igual o parecida.'], ['Paso 2', 'Presenta la solicitud y elige la clase de productos o servicios.'], ['Vigencia', '10 años, renovable.']], G + 'indecopi', 'INDECOPI']
    ]},
    { id: 'movilidad', icono: 'fa-car-side', titulo: 'Movilidad y transporte', sub: 'Todo para manejar legal y seguro.', items: [
      ['fa-id-card-clip', 'rojo', 'Licencia de conducir (brevete)', 'Autoriza a manejar según la categoría que obtengas.', 'm',
        [['Requisitos', 'Ser mayor de edad, DNI y certificado médico y psicológico de un centro autorizado.'], ['Pruebas', 'Examen de conocimientos y de manejo.'], ['Dónde', 'MTC o escuelas de conductores autorizadas.']], G + 'mtc', 'MTC'],
      ['fa-shield-heart', 'verde', 'SOAT', 'Seguro obligatorio para todo vehículo: cubre a las víctimas de un accidente.', 'o',
        [['Dónde', 'Aseguradoras autorizadas, con opción digital.'], ['Vigencia', 'Normalmente un año.'], ['Ojo', 'Circular sin SOAT vigente trae multa.']], 'https://www.apeseg.org.pe', 'APESEG'],
      ['fa-screwdriver-wrench', 'terracota', 'Revisión técnica', 'Inspección que certifica que tu vehículo es seguro y no contamina.', 'p',
        [['Cuándo', 'En vehículos particulares, la primera a los 3 años y luego cada año.'], ['Dónde', 'Centros de inspección autorizados por el MTC.'], ['Resultado', 'Certificado (CITV) vigente.']], G + 'mtc', 'MTC'],
      ['fa-handshake', 'marron', 'Compra-venta de vehículo', 'Cómo comprar o vender sin que te estafen.', 'p',
        [['Antes', 'Revisa gravámenes y propietario en SUNARP, y papeletas pendientes.'], ['Firma', 'Contrato de compra-venta con firmas legalizadas ante notario.'], ['Final', 'Inscribe la transferencia en SUNARP para que sea oficial.']], G + 'sunarp', 'SUNARP']
    ]},
    { id: 'educacion', icono: 'fa-graduation-cap', titulo: 'Educación y formación', sub: 'Tus estudios, validados y con apoyo para seguir.', items: [
      ['fa-scroll', 'dorado', 'Certificado de estudios (secundaria)', 'Documento que acredita que terminaste el colegio.', 'm',
        [['Dónde', 'Tu colegio o la UGEL; revisa si Minedu lo ofrece en línea.'], ['Sirve para', 'Postular a universidades, institutos y trabajos.']], G + 'minedu', 'Minedu'],
      ['fa-arrows-rotate', 'verde', 'Convalidación de estudios', 'Que te reconozcan cursos o grados ya estudiados.', 'p',
        [['Entre instituciones peruanas', 'La universidad o instituto evalúa tus cursos y sílabos.'], ['Grados del extranjero', 'Se reconocen ante SUNEDU.'], ['Secundaria extranjera', 'Se convalida vía UGEL/Minedu.']], G + 'sunedu', 'SUNEDU'],
      ['fa-award', 'rojo', 'Beca 18 / Pronabec', 'Becas completas para estudiar con buen rendimiento y pocos recursos.', 'o',
        [['Postulas', 'En línea, cuando Pronabec abre la convocatoria.'], ['Revisa en las bases', 'Promedio mínimo, edad y condición socioeconómica.'], ['Tip', 'Prepara tus documentos antes de que abra.']], G + 'pronabec', 'Pronabec']
    ]},
    { id: 'vivienda', icono: 'fa-house', titulo: 'Vivienda y servicios', sub: 'Independízate sin llevarte sorpresas.', items: [
      ['fa-key', 'terracota', 'Contrato de alquiler', 'Protege a inquilino y arrendador. Nunca alquiles solo de palabra.', 'p',
        [['Inquilino', 'Paga a tiempo, cuida el inmueble y devuélvelo en buen estado.'], ['Arrendador', 'Entrega el inmueble en condiciones y respeta lo pactado.'], ['Tip', 'Pide recibos, fotos del estado inicial y legaliza firmas ante notario.']], G + 'sunarp', 'SUNARP'],
      ['fa-bolt', 'dorado', 'Servicios básicos (luz, agua, internet)', 'Instalación y cambio de titularidad en tu nuevo hogar.', 'm',
        [['Luz y agua', 'Con la empresa de tu zona: DNI y documento que acredite que puedes habitar el inmueble.'], ['Titularidad', 'Pide que no haya deudas pendientes.'], ['Reclamos', 'OSIPTEL (internet), Osinergmin (luz), SUNASS (agua).']], G + 'osiptel', 'OSIPTEL'],
      ['fa-fire-flame-simple', 'rojo', 'Gas natural / balón de gas', 'Cómo conectarte o comprar el balón de forma segura.', 'm',
        [['Gas natural', 'Solo en zonas con red; consulta con el distribuidor local.'], ['Balón (GLP)', 'Compra en puntos autorizados y revisa sello y estado.'], ['Descuento', 'Pregunta por el vale FISE si tu hogar califica.']], G + 'osinergmin', 'Osinergmin']
    ]},
    { id: 'salud', icono: 'fa-hand-holding-heart', titulo: 'Salud e inclusión', sub: 'Cobertura y derechos para todos.', items: [
      ['fa-wheelchair', 'verde', 'Certificado de discapacidad (CONADIS)', 'Te permite acceder a beneficios y protección del Estado.', 'p',
        [['Paso 1', 'Evaluación y certificado en un establecimiento de salud autorizado.'], ['Paso 2', 'Inscripción en el registro de CONADIS.'], ['Beneficios', 'Cuotas de empleo y otros derechos según ley.']], G + 'conadis', 'CONADIS'],
      ['fa-hospital-user', 'marron', 'Seguro privado (EPS)', 'Opciones si no usas SIS ni EsSalud.', 'm',
        [['Qué es', 'Plan de clínicas y aseguradoras, solo o complementando EsSalud.'], ['Compara', 'Red de clínicas, deducibles, carencias y preexistencias.'], ['Supervisa', 'SUSALUD protege tus derechos como asegurado.']], G + 'susalud', 'SUSALUD']
    ]}
  ];
  const nav = document.getElementById('navLinks'), cont = document.getElementById('bloques');
  if (!cont) return;
  let n = 100;
  const COL = ['water','wisp','primrose','derby','water','melanie'];
  const card = (c) => { const id = 'detalle' + (++n);
    return `<div class="tramite-card" data-color="${c[1]}">
    <div class="icon"><i class="fas ${c[0]}"></i></div>
    <button class="btn-escuchar-tramite" aria-label="Escuchar información del trámite">
      <i class="fas fa-volume-up"></i> Escuchar
    </button>
    <h3>${c[2]}</h3><p>${c[3]}</p>
    <div class="modalidad">${M[c[4]]}</div>
    <button class="btn-ver-mas" data-target="${id}"><span>Ver pasos</span> <i class="fas fa-chevron-down"></i></button>
    <div class="detalle" id="${id}"><ul>${c[5].map(b => `<li><strong>${b[0]}:</strong> ${b[1]}</li>`).join('')}</ul>
    <a href="${c[6]}" target="_blank" rel="noopener noreferrer" class="btn-mas-info"><i class="fas fa-external-link-alt"></i> ${c[7]}</a></div></div>`; };
  cont.innerHTML = BLOQUES.map((b, i) => `<section class="bloque box" id="${b.id}" style="--z:${17 - i};--bg:var(--${COL[i]})"><div class="bloque-head"><span class="bloque-ico"><i class="fas ${b.icono}"></i></span><div><h2>${b.titulo}</h2><p>${b.sub}</p></div></div><div class="tramites-grid">${b.items.map(card).join('')}</div></section>`).join('');
  if (nav) nav.innerHTML = '<a href="#basico">Lo básico</a>' + BLOQUES.map(b => `<a href="#${b.id}"><i class="fas ${b.icono}"></i> ${b.titulo.split(' y ')[0]}</a>`).join('');
})();

# Medición: configurar, leer y decidir

Contenido:

1. Configuración inicial (Search Console, GA4, Clarity)
2. Preguntas → dato → acción
3. Ciclo de mejora

## 1. Configuración inicial

### Search Console (posicionamiento)

1. Verifica el dominio (registro DNS) o con `metadata.verification.google` en el root layout.
2. Envía `https://<dominio>/sitemap.xml`.
3. Revisa **Rendimiento** (consultas, impresiones, CTR y posición media) e **Indexación de páginas** (el inicio indexado; las
   rutas de v1 figuran como redirección).
4. **Core Web Vitals** muestra datos de campo de usuarios reales; Lighthouse solo da datos de laboratorio.

### GA4 (eventos de negocio)

1. Crea una propiedad y un flujo web. El ID `G-…` va en la variable `GA_MEASUREMENT_ID`, solo en producción.
2. Deja activa la **medición mejorada**: vistas de página con cambios de historial, clics salientes y descargas de
   archivos.
3. Registra las **dimensiones personalizadas** de ámbito evento: `cta`, `location`, `project`, `section` (Admin →
   Definiciones personalizadas). Sin ese registro, los parámetros no aparecen en los informes.
4. Marca como **eventos clave**: `generate_lead` y `file_download` (el CV es el único PDF).
5. Prueba en **DebugView** antes de dar por buena la implementación.

### Clarity (comportamiento)

1. Crea el proyecto. Su ID va en la variable `CLARITY_PROJECT_ID`, solo en producción.
2. Opcional: conecta Clarity con GA4 para cruzar segmentos.
3. `track` (lo usan `CtaTracker` y el formulario) también envía cada evento a Clarity
   (`clarity('event', nombre)`), así que puedes filtrar las grabaciones por `cta_click` o `generate_lead`.

## 2. Preguntas → dato → acción

| Pregunta                               | Dónde mirar                                                                                     | Si el dato es malo                                                             |
| -------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| ¿Me encuentran por mi nombre y rol?    | Search Console: consultas con el nombre, posición media                                         | Revisa `title`, `h1` y el JSON-LD `Person`                                     |
| ¿Hacen clic en el resultado de Google? | Search Console: CTR por página                                                                  | Reescribe `title` y `description` de esa página                                |
| ¿Llegan a Proyectos?                   | `section_view` de `projects` frente a las de `home`                                             | Refuerza `Ver proyectos` en el hero                                            |
| ¿Qué CTA del hero funciona?            | `cta_click` con `location=hero`, por `cta`                                                      | Cambia el texto o la jerarquía del que no recibe clics                         |
| ¿Qué casos interesan?                  | `cta_click` con `location=projects`, por `project`                                              | Ordena los casos por interés; reescribe el resumen de los que no reciben clics |
| ¿Los recruiters bajan el CV?           | `file_download` + `cta_click` con `cta=cv`, por `location`                                      | Si nadie lo baja, revisa su visibilidad en el header y en Experiencia          |
| ¿Dónde se frustran?                    | Clarity: dead clicks, rage clicks, quick backs                                                  | Convierte el elemento en enlace o quítale la apariencia de botón               |
| ¿El formulario convierte?              | `generate_lead` frente a los `section_view` de `contact`                                        | Reduce campos o destaca el email directo                                       |
| ¿De dónde vienen?                      | GA4: Adquisición (LinkedIn, Google, directo)                                                    | Ajusta el mensaje del hero a ese público                                       |

CTR de un CTA = `cta_click` de ese CTA ÷ `page_view` de la ruta donde está.

## 3. Ciclo de mejora

1. Una hipótesis y un cambio a la vez ("si `Ver caso` dice 'Ver caso: <proyecto>', sube el clic en casos").
2. Anota la fecha del cambio para poder correlacionarlo.
3. Mide al menos 2–4 semanas: un portfolio tiene poco tráfico y los porcentajes oscilan mucho.
4. Con poco tráfico, mira grabaciones de Clarity antes que porcentajes: 10 sesiones reales enseñan más que un 3 % de
   diferencia.
5. Si el cambio no mejora el dato, revierte. Lo que no se mide no se queda.

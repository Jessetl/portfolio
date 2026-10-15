import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

// EEE, Reino Unido y Suiza. No hay banner de consentimiento: ahí GA4 corre en
// Consent Mode sin cookies (pings anónimos) y Clarity, sin señal de
// consentimiento, tampoco usa cookies. Sin anuncios: ad_* denegado siempre.
const consentRegions = [
  'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES', 'FI', 'FR', 'GR', 'HR', 'HU',
  'IE', 'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK',
  'IS', 'LI', 'NO', 'GB', 'CH',
];

// Va antes de que GoogleAnalytics ejecute gtag('config'): corre al parsear el HTML.
const consentDefaults = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
var ads={ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'};
gtag('consent','default',Object.assign({analytics_storage:'denied',region:${JSON.stringify(consentRegions)}},ads));
gtag('consent','default',Object.assign({analytics_storage:'granted'},ads));`;

// Snippet oficial de Microsoft Clarity, sin modificar.
const clarityLoader = (projectId: string) => `
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", ${JSON.stringify(projectId)});`;

/**
 * GA4 después de hidratar (@next/third-parties) y Clarity en tiempo ocioso.
 * Solo se cargan con ID: las variables existen únicamente en producción.
 */
export const AnalyticsScripts = ({
  gaId,
  clarityId,
}: {
  gaId?: string;
  clarityId?: string;
}) => (
  <>
    {gaId && (
      <>
        <script dangerouslySetInnerHTML={{ __html: consentDefaults }} />
        <GoogleAnalytics gaId={gaId} />
      </>
    )}
    {clarityId && (
      <Script id='ms-clarity' strategy='lazyOnload'>
        {clarityLoader(clarityId)}
      </Script>
    )}
  </>
);

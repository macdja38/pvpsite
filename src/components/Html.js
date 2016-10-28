import React, { PropTypes } from 'react';
import { analytics, oauth } from '../config';

function Html({ title, description, style, script, children }) {
  return (
    <html className="no-js" lang="">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <title>{title}</title>
        <link
          rel="alternate"
          type="application/json+oembed"
          href={`${oauth.discord.url}/api/v1/oembed?type=photo&url=f&title=${title}&description=${description}`}
          title={title}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#102372" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />

        <style id="css" dangerouslySetInnerHTML={{ __html: style }} />
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: children }} />
        {script && <script src={script} />}
        {analytics.google.trackingId &&
          <script
            dangerouslySetInnerHTML={{ __html:
            'window.ga=function(){ga.q.push(arguments)};ga.q=[];ga.l=+new Date;' +
            'ga("create",(typeof(window)!=="undefined"&&window.self===window.top&&' +
            `"${analytics.google.embedTrackingId}")?"${analytics.google.trackingId}":` +
            `"${analytics.google.embedTrackingId}"` +
            ',"auto");ga("send","pageview")' }}
          />
        }
        {analytics.google.trackingId &&
          <script src="https://www.google-analytics.com/analytics.js" async defer />
        }
      </body>
    </html>
  );
}

/*
function inFrame() {
  console.log("Checked This");
  if (typeof(window) === 'undefined') {
    console.log("Cant Find Window");
    return false;
  }
  if (window.hasOwnProperty("frameElement")) {
    try {
      return !!window.frameElement
    } catch(e) {
      console.error("inFrame() Error", e);
    }
  }
  try {
    return window.self !== window.top;
  } catch (e) {
    console.error("inFrame() Error 2", e);
    return true;
  }
}
*/

Html.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  style: PropTypes.string.isRequired,
  script: PropTypes.string,
  children: PropTypes.string,
};

export default Html;

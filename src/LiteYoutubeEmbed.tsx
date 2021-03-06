import React, { useState } from 'react';

import './styles.css';
import { qs } from './utils';
import { ILiteYouTubeEmbedProps } from './types';

const LiteYouTubeEmbed = ({
  id,
  params = {},
  defaultPlay = false,
  adLinksPreconnect = true,
  isPlaylist = false,
  noCookie = true,
  mute = true,
}: ILiteYouTubeEmbedProps): JSX.Element => {
  const [isPreconnected, setIsPreconnected] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(defaultPlay);

  const muteParam = mute || defaultPlay ? '1' : '0'; // Default play must be mute
  const queryString = qs({ autoPlay: '1', mute: muteParam, ...params });
  const posterUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`; // * Lo, the youtube placeholder image!  (aka the thumbnail, poster image, etc)
  const ytUrl = noCookie ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com';
  const iframeSrc = isPlaylist ? `${ytUrl}/embed/videoseries?list=${id}` : `${ytUrl}/embed/${id}?${queryString}`;

  const warmConnections = () => {
    if (isPreconnected) return;
    setIsPreconnected(true);
  };

  const loadIframeFunc = () => {
    if (iframeLoaded) return;
    setIframeLoaded(true);
  };

  return (
    <>
      {/* Link is "body-ok" element. Reference: https://html.spec.whatwg.org/multipage/links.html#body-ok */}
      <link rel='preload' href={posterUrl} as='image' />
        {isPreconnected && (
          <>
            {/* The iframe document and most of its subresources come right off youtube.com */}
            <link rel='preconnect' href={ytUrl} />
            {/* The botguard script is fetched off from google.com */}
            <link rel='preconnect' href='https://www.google.com' />
          </>
        )}
        {isPreconnected && adLinksPreconnect && (
          <>
            {/* Not certain if these ad related domains are in the critical path. Could verify with domain-specific throttling. */}
            <link rel='preconnect' href='https://static.doubleclick.net' />
            <link rel='preconnect' href='https://googleads.g.doubleclick.net' />
          </>
        )}
      <div
        onClick={loadIframeFunc} 
        onPointerOver={warmConnections}
        className={`yt-lite ${iframeLoaded && 'lyt-activated'}`}
        style={{ backgroundImage: `url(${posterUrl})`}}
      >
        <div className={'lty-playbtn'}></div>
        {iframeLoaded && (
          <iframe
            width='560'
            height='315'
            frameBorder='0'
            allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            src={iframeSrc}
          ></iframe>
        )}
      </div>
    </>
  );
};

export default React.memo(LiteYouTubeEmbed);

import React from 'react';
import PropTypes from 'prop-types';
import { useStrapiApp } from '@strapi/strapi/admin';

// Deprecated in Strapi v5
// https://docs-next.strapi.io/dev-docs/migration/v4-to-v5/guides/helper-plugin#prefixfileurlwithbackendurl
// Original code:
// https://github.com/strapi/strapi/blob/v4.25.2/packages/core/helper-plugin/src/utils/prefixFileUrlWithBackendUrl.ts
function prefixFileUrlWithBackendUrl ( fileURL ) {
  return !!fileURL && fileURL.startsWith('/') ? `${ window.strapi.backendURL }${ fileURL }` : fileURL;
}

const MediaLib = ( { isOpen, onChange, onToggle } ) => {
  const { components } = useStrapiApp( 'library', app => app );
  const MediaLibraryDialog = components[ 'media-library' ];


  const handleSelectAssets = files => {
    const formattedFiles = files.map(f => {
      let mime = f.mime;
      let isMp4 = false;

      // This is a workaround to allow mp4 files to be considered as images.
      // CKE will add a markdown image syntax using the video url.
      // We can handle them later using the Markdown parser.
      if (f.mime === 'video/mp4') {
        mime = 'image/png';
        isMp4 = true;
      }

      return {
        alt: `${isMp4 ? '!videofile!' : ''}${f.alternativeText || f.name}`,
        url: prefixFileUrlWithBackendUrl(f.url),
        mime: mime
      };
    });

    onChange( formattedFiles );
  };

  if ( !isOpen ) {
    return null
  };

  return(
    <MediaLibraryDialog onClose={ onToggle } onSelectAssets={ handleSelectAssets } />
  );
};

MediaLib.propTypes = {
  isOpen: PropTypes.bool,
  onChange: PropTypes.func,
  onToggle: PropTypes.func,
};

export default MediaLib;

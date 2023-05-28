import React from 'react';
import { prefixFileUrlWithBackendUrl, useLibrary } from '@strapi/helper-plugin';
import PropTypes from 'prop-types';

const MediaLib = ( { isOpen, onChange, onToggle } ) => {
  const { components } = useLibrary();
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

MediaLib.defaultProps = {
  isOpen: false,
  onChange: () => {},
  onToggle: () => {},
};

MediaLib.propTypes = {
  isOpen: PropTypes.bool,
  onChange: PropTypes.func,
  onToggle: PropTypes.func,
};

export default MediaLib;

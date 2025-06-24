import React from 'react';
import { useContentRelease } from '../../hooks/useContentRelease.js';
import VideoContent from '../../components/video/VideoContent.js';
import { Video, Filter } from 'lucide-react';

const VideoLibrary = () => {
  const { availableContent, loading, error } = useContentRelease();

  // Filter only video content
  const videoContent = availableContent.filter(content => content.type === 'video');

  // Group videos by tier
  const videosByTier = videoContent.reduce((acc, video) => {
    if (!acc[video.tier]) {
      acc[video.tier] = [];
    }
    acc[video.tier].push(video);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg aspect-video"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Video className="w-8 h-8 text-indigo-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Video Library</h1>
      </div>

      {/* Video Categories */}
      <div className="space-y-12">
        {/* Basic Videos */}
        {videosByTier.basic && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Basic Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosByTier.basic.map(video => (
                <VideoContent key={video.contentId} contentId={video.contentId} />
              ))}
            </div>
          </section>
        )}

        {/* Premium Videos */}
        {videosByTier.premium && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Premium Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosByTier.premium.map(video => (
                <VideoContent key={video.contentId} contentId={video.contentId} />
              ))}
            </div>
          </section>
        )}

        {/* Elite Videos */}
        {videosByTier.elite && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Elite Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videosByTier.elite.map(video => (
                <VideoContent key={video.contentId} contentId={video.contentId} />
              ))}
            </div>
          </section>
        )}

        {/* No Videos Available */}
        {Object.keys(videosByTier).length === 0 && (
          <div className="text-center py-12">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Videos Available</h3>
            <p className="text-gray-500">
              Check back later for new video content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoLibrary; 
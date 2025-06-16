import React, { useState, useEffect } from 'react';
import { useContentRelease } from '../../hooks/useContentRelease';
import { useAuth } from '../../contexts/AuthContext';
import { Play, Lock, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const VideoContent = ({ contentId }) => {
  const { user } = useAuth();
  const { checkContentAvailability, availableContent } = useContentRelease();
  const [isAvailable, setIsAvailable] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        setLoading(true);
        const available = await checkContentAvailability(contentId);
        setIsAvailable(available);

        if (available) {
          // Find the video data in available content
          const content = availableContent.find(c => c.contentId === contentId);
          if (content) {
            setVideoData(content);
          }
        }
      } catch (err) {
        console.error('Error checking video availability:', err);
        setError('Failed to check video availability');
      } finally {
        setLoading(false);
      }
    };

    checkAvailability();
  }, [contentId, checkContentAvailability, availableContent]);

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!isAvailable) {
    // Find the content in the release schedule to show when it will be available
    const content = availableContent.find(c => c.contentId === contentId);
    const releaseDate = content?.releaseDate;
    
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Content Locked</h3>
        {releaseDate && (
          <div className="flex items-center justify-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>Available {formatDistanceToNow(new Date(releaseDate), { addSuffix: true })}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-video bg-gray-100 relative">
        {videoData?.thumbnailUrl ? (
          <img 
            src={videoData.thumbnailUrl} 
            alt={videoData.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <Play className="w-16 h-16 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <button className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-90 transition-opacity">
            <Play className="w-8 h-8 text-indigo-600" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{videoData?.name}</h3>
        {videoData?.description && (
          <p className="text-gray-600 mb-4">{videoData.description}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {videoData?.tags?.map(tag => (
            <span 
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        {videoData?.duration && (
          <div className="mt-4 text-sm text-gray-500">
            Duration: {Math.floor(videoData.duration / 60)}:{(videoData.duration % 60).toString().padStart(2, '0')}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoContent; 
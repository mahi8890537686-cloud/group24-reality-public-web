'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCw, Compass, Play, Pause } from 'lucide-react';

interface VirtualTour360ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tour360Url?: string;
  propertyType?: string;
}

// Curated high-res equirectangular 360° panorama images for different property types
const DEFAULT_PANORAMAS: Record<string, string> = {
  plot: '/images/fallback/tour-plot.jpg',
  villa: '/images/fallback/default-property.jpg',
  flat: '/images/fallback/tour-flat.jpg',
  default: '/images/fallback/tour-default.jpg',
};

export default function VirtualTour360Modal({
  isOpen,
  onClose,
  title,
  tour360Url,
  propertyType = 'plot',
}: VirtualTour360ModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isEmbed = tour360Url && (
    tour360Url.includes('embed') ||
    tour360Url.includes('kuula') ||
    tour360Url.includes('matterport') ||
    tour360Url.includes('youtube') ||
    tour360Url.includes('google.com/maps')
  );

  const activePanoUrl = (!isEmbed && tour360Url)
    ? tour360Url
    : (DEFAULT_PANORAMAS[propertyType] || DEFAULT_PANORAMAS.default);

  // Canvas rendering for 360 equirectangular image
  useEffect(() => {
    if (!isOpen || isEmbed) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = activePanoUrl;

    let currentPanX = pan.x;

    const render = () => {
      if (!canvas) return;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      if (img.complete && img.naturalWidth > 0) {
        if (autoRotate && !isDragging) {
          currentPanX += 0.3;
          setPan((p) => ({ ...p, x: currentPanX }));
        }

        // Draw seamless looping equirectangular panorama projection onto 2D canvas
        const scaledWidth = width * zoom * 2;
        const scaledHeight = height * zoom;
        const offsetX = ((-currentPanX * zoom) % scaledWidth + scaledWidth) % scaledWidth;
        const offsetY = (height - scaledHeight) / 2 + pan.y * zoom;

        ctx.drawImage(img, offsetX - scaledWidth, offsetY, scaledWidth, scaledHeight);
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
        ctx.drawImage(img, offsetX + scaledWidth, offsetY, scaledWidth, scaledHeight);
      } else {
        // Loading state placeholder on canvas
        ctx.fillStyle = '#0a1128';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#e2c070';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Loading 360° Interactive View…', width / 2, height / 2);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (canvas && containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    img.onload = render;
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, activePanoUrl, isEmbed, autoRotate, zoom, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setPan((p) => ({
      x: p.x - dx * 0.5,
      y: Math.max(-100, Math.min(100, p.y + dy * 0.5)),
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    setPan((p) => ({
      x: p.x - dx * 0.5,
      y: Math.max(-100, Math.min(100, p.y + dy * 0.5)),
    }));
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          ref={containerRef}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl h-[80vh] bg-ink rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-4 bg-ink border-b border-white/10 text-white z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center">
                <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg line-clamp-1">
                  360° Virtual Site Tour — {title}
                </h3>
                <p className="text-white/50 text-xs font-inter">
                  {isEmbed ? 'Interactive 360° Embed' : 'Drag or swipe in any direction to explore 360° view'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close 360 view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main 360 Viewer Canvas or Embed */}
          <div className="relative flex-1 bg-ink overflow-hidden select-none">
            {isEmbed ? (
              <iframe
                src={tour360Url}
                className="w-full h-full border-0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title={`360 tour for ${title}`}
              />
            ) : (
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
                className="w-full h-full cursor-grab active:cursor-grabbing"
              />
            )}

            {/* Instruction Overlay */}
            {!isEmbed && (
              <div className="absolute top-4 left-4 pointer-events-none bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-inter flex items-center gap-2 border border-white/10">
                <Compass className="w-3.5 h-3.5 text-gold" />
                <span>Drag to rotate 360°</span>
              </div>
            )}

            {/* Floating 360° Viewer Control Bar */}
            {!isEmbed && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-ink/90 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-3 text-white shadow-xl z-10">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`p-2 rounded-full transition-colors ${autoRotate ? 'bg-gold text-ink' : 'hover:bg-white/10 text-white'}`}
                  title={autoRotate ? 'Pause 360° Rotation' : 'Auto Rotate 360°'}
                >
                  {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <div className="w-px h-5 bg-white/20" />

                <button
                  onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setZoom((z) => Math.max(0.7, z - 0.2))}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>

                <button
                  onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                  title="Reset View"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <div className="w-px h-5 bg-white/20" />

                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

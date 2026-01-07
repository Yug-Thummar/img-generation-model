import { downloadImage } from '../utils/downloadImage'

function ImageCard({ image }) {
  const handleDownload = () => {
    downloadImage(image.cloudinaryUrl, `image-${image._id}.png`)
  }

  return (
    <div className="group relative bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-primary-blue/50 transition-all hover:shadow-2xl hover:shadow-primary-blue/20">
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-blue to-primary-blue-light rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
      
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image.cloudinaryUrl}
          alt={image.promptText}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      
      <div className="relative p-5">
        <p className="text-gray-300 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {image.promptText}
        </p>
        <button
          onClick={handleDownload}
          className="w-full bg-gradient-to-r from-primary-blue to-primary-blue-light text-white py-2.5 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-blue/50 transition-all transform hover:scale-105"
        >
          Download
        </button>
      </div>
    </div>
  )
}

export default ImageCard



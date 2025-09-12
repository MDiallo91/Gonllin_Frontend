interface PostImagesProps {
  images: string[];
}

const BASE_URL = import.meta.env.VITE_API_URL;

function PostImages({ images }: PostImagesProps) {
  if (images.length === 1) {
    return (
      <img
        src={`${BASE_URL}/${images[0]}`}
        alt="post"
        className="w-full h-48 rounded object-cover"
      />
    );
  }
  if (images.length === 2) {
    return (
      <div className="grid grid-cols-2 gap-1">
        {images.map((img, i) => (
          <img
            key={i}
            src={`${BASE_URL}/${img}`}
            alt="post"
            className="w-full h-64 object-cover rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="grid grid-rows-2 gap-1">
        <img
          src={`${BASE_URL}/${images[0]}`}
          alt="post"
          className="w-full h-64 object-cover rounded-lg row-span-1"
        />
        <div className="grid grid-cols-2 gap-1">
          {images.slice(1).map((img, i) => (
            <img
              key={i}
              src={img}
              alt="post"
              className="w-full h-48 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }



  // 4 images ou plus
  return (
    <div className="grid grid-cols-2 gap-1 relative">

      {images.slice(0, 4).map((img, i) => (
        <img
          key={i}
          src={`${BASE_URL}/${img}`}
          alt="post"
          className="w-full h-48 object-cover rounded"
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-lg font-bold px-3 py-1 rounded-lg">
          +{images.length - 4}
        </div>
      )}
    </div>
  );
}

export default PostImages;

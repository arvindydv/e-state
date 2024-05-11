import axios from "axios";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const imageUploadHandler = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("image upload failed");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can upload only 6 images");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const deleteImageHandler = (idx) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, i) => i != idx),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "offer" ||
      e.target.id === "furnished"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }

    if (
      e.target.type === "text" ||
      e.target.type === "number" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  //   submit data to database
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) {
        return setError("You must upload at least one image");
      }
      if (formData.regularPrice < formData.discountPrice) {
        return setError("Discount price must be lower than regular price");
      }
      setLoading(true);
      setError("");
      const res = await axios.post("/api/listing/listing", formData);

      if (res.data.statusCode === 201) {
        setLoading(false);
        setFormData({
          imageUrls: [],
          name: "",
          description: "",
          address: "",
          type: "rent",
          bedrooms: 1,
          bathrooms: 1,
          regularPrice: 0,
          discountPrice: 0,
          offer: false,
          parking: false,
          furnished: false,
        });
        navigate(`/listing/${res.data.data._id}`);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error.response.message);
    }
  };

  return (
    <div className="p-3 max-w-4xl mx-auto">
      <h1 className="text-center text-3xl font-semibold  my-7">
        {" "}
        Create Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            required
            maxLength="62"
            minLength="10"
            id="name"
            className="border p-3 rounded-lg"
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            required
            // maxLength="62"
            minLength="10"
            id="description"
            className="border p-3 rounded-lg"
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            required
            maxLength="62"
            minLength="10"
            id="address"
            className="border p-3 rounded-lg"
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>sale </span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent </span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot </span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished </span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="0"
                required
                className="p-3 border border-gray-300 rounded-lg w-20"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs"> (Rs / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  required
                  className="p-3 border border-gray-300 rounded-lg w-20"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs"> (Rs / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4 ">
          <p className="font-semibold">
            Images:{" "}
            <span className="text-gray-600 font-normal ml-2">
              The first image will be cover (max-6)
            </span>{" "}
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              id="image"
              required
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full"
              onChange={(e) => {
                setFiles(e.target.files);
              }}
            />
            <button
              onClick={imageUploadHandler}
              disabled={uploading}
              type="button"
              className=" p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:placeholder-opacity-80"
            >
              {uploading ? "Uploading" : "Upload"}{" "}
            </button>
          </div>
          {imageUploadError && (
            <p className="text-red-700 mt-3 text-sm">{imageUploadError}</p>
          )}
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, idx) => (
              <div
                key={idx}
                className="flex justify-between border p-3 items-center"
              >
                <img
                  src={url}
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  className="p-3 text-red-700 rounded-lg hover:placeholder-opacity-70 uppercase"
                  onClick={() => {
                    deleteImageHandler(idx);
                  }}
                >
                  delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="uppercase bg-slate-700 text-center p-3 text-white hover:placeholder-opacity-95 disabled:opacity-80 rounded-lg"
          >
            {loading ? "Loading..." : "create listing"}
          </button>
          {error && <p className="text-red-700 mt-2">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default CreateListing;

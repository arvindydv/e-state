import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
// cons;

const MyListing = () => {
  const [listings, setListings] = useState([]);

  const myListing = async () => {
    try {
      const res = await axios.get(`/api/listing/listing`);
      if (res.data.statusCode === 200) {
        console.log(res.data.data, "++++++_______");
        setListings(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteListingHaldler = async (listingId) => {
    try {
      const res = await axios.delete(`/api/listing/listing/${listingId}`);
      if (res.data.statusCode === 200) {
        console.log(res.data.data);
        setListings((prev) =>
          prev.filter((listing) => listing._id != listingId)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    myListing();
  }, []);

  return (
    <>
      <div className="flex flex-col my-7 max-w-6xl mx-auto">
        <h1 className="text-center text-3xl font-semibold mb-7">My Listing </h1>
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-center text-sm font-light">
                <thead className="border-b bg-neutral-50 font-medium dark:border-neutral-500 dark:text-neutral-800">
                  <tr>
                    <th scope="col" className=" px-6 py-4">
                      #
                    </th>

                    <th scope="col" className=" px-6 py-4">
                      Image
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Name
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Address
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Edit
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listings.length > 0 &&
                    listings.map((listing, idx) => {
                      return (
                        <tr
                          className="border-b dark:border-neutral-500"
                          key={listing._id}
                        >
                          <td className="whitespace-nowrap  px-6 py-4 font-medium">
                            {idx + 1}
                          </td>
                          <td className="whitespace-nowrap  px-6 py-4">
                            {" "}
                            <Link to={`/listing/${listing._id}`}>
                              <img
                                className="w-20 h-10 object-cover self-center mx-auto"
                                src={listing.imageUrls[0]}
                              />
                            </Link>
                          </td>
                          <td className="whitespace-nowrap  px-6 py-4">
                            {" "}
                            {listing.name}
                          </td>
                          <td className="whitespace-nowrap  px-6 py-4">
                            {listing.address}
                          </td>
                          <td className="whitespace-nowrap font-semibold hover:underline  px-6 py-4 text-green-700 cursor-pointer">
                            Edit
                          </td>
                          <td
                            className="whitespace-nowrap font-semibold hover:underline  px-6 py-4 text-red-700 cursor-pointer"
                            onClick={() => {
                              deleteListingHaldler(listing._id);
                            }}
                          >
                            Delete
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyListing;

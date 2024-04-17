import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { setListing } from "../redux/userSlice";
import { categories } from "../data/data";
import "../styles/Listings.scss";
import Loader from "./Loader";
import ListingCard from "./ListingCard";

const Listings = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const listings = useAppSelector((state) => state.listings);

  useEffect(() => {
    const getFeedListings = async () => {
      try {
        const res = await fetch(
          selectedCategory !== "All"
            ? `${
                import.meta.env.VITE_APP_SERVER_URL
              }/properties?category=${selectedCategory}`
            : `${import.meta.env.VITE_APP_SERVER_URL}/properties`
        );
        const data = await res.json();
        dispatch(setListing({ listings: data.listings }));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getFeedListings();
  }, [selectedCategory]);

  return (
    <>
      <section className="category-list">
        {categories?.map((category, index) => (
          <div
            className={`category ${
              category.label === selectedCategory ? "selected" : ""
            }`}
            key={index}
            onClick={() => setSelectedCategory(category.label)}
          >
            <div className="category_icon">{<category.icon />}</div>
            <p>{category.label}</p>
          </div>
        ))}
      </section>

      {loading ? (
        <Loader />
      ) : (
        <div className="listings">
          {listings?.map((listing, index) => (
            <ListingCard
              key={index}
              listingId={listing._id}
              listingPhotoPaths={listing.listingPhotoPaths}
              city={listing.city}
              province={listing.province}
              country={listing.country}
              category={listing.category}
              type={listing.type}
              price={listing.price}
              booking={false}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Listings;

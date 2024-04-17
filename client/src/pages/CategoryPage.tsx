import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { setListing } from "../redux/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const CategoryPage = () => {
  const [loading, setLoading] = useState(true);
  const { category } = useParams();
  const listings = useAppSelector((state) => state.listings);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getFeedListings = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_APP_SERVER_URL
          }/properties?category=${category}`
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
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">{category} listings</h1>
      <div className="list">
        {listings &&
          listings?.map(
            (
              {
                _id,
                listingPhotoPaths,
                city,
                province,
                country,
                category,
                type,
                price,
              },
              index
            ) => (
              <ListingCard
                listingId={_id}
                listingPhotoPaths={listingPhotoPaths}
                city={city}
                country={country}
                category={category}
                province={province}
                type={type}
                price={price}
                booking={false}
                key={index}
              />
            )
          )}
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;

import { useParams } from "react-router-dom";
import ListingCard from "../components/ListingCard";
import Navbar from "../components/Navbar";
import "../styles/List.scss";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { useEffect, useState } from "react";
import { setListing } from "../redux/userSlice";
import Loader from "../components/Loader";
import Footer from "../components/Footer";

const SearchPage = () => {
  const [loading, setLoading] = useState(true);
  const { search } = useParams();
  const listings = useAppSelector((state) => state.listings);

  const dispatch = useAppDispatch();

  const getSearchListings = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_SERVER_URL}/properties/search/${search}`
      );

      const data = await res.json();

      data && dispatch(setListing({ listings: data.listings }));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSearchListings();
  }, [search]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">{search?.toUpperCase()}</h1>
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

export default SearchPage;

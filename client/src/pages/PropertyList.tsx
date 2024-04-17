import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import "../styles/List.scss";
import ListingCard from "../components/ListingCard";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { setPropertyList } from "../redux/userSlice";
import Footer from "../components/Footer";

const PropertyList = () => {
  const [loading, setLoading] = useState(true);
  const user = useAppSelector((state) => state.user);
  const propertyList = user?.propertyList;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getPropertyList = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_APP_SERVER_URL}/users/${user?._id}/properties`
        );
        const data = await res.json();
        dispatch(setPropertyList({ properties: data.properties }));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getPropertyList();
  }, []);

  return (
    <>
      <Navbar />
      <h1 className="title-list">Your property list</h1>
      {loading ? (
        <Loader />
      ) : (
        <div className="list">
          {propertyList &&
            propertyList?.map(
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
      )}

      <Footer />
    </>
  );
};

export default PropertyList;

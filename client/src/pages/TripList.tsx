import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { setTripList } from "../redux/userSlice";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const TripList = () => {
  const [loading, setLoading] = useState(true);

  const user = useAppSelector((state) => state.user);
  const userId = user?._id;
  const tripList = user!.tripList;

  const dispatch = useAppDispatch();

  const getTripList = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_SERVER_URL}/users/${userId}/trips`
      );

      const data = await res.json();

      data && dispatch(setTripList(data));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTripList();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your trip list</h1>
      <div className="list">
        {tripList &&
          tripList?.map((trip, index) => (
            <ListingCard
              key={index}
              listingId={trip.listingId._id}
              listingPhotoPaths={trip.listingId.listingPhotoPaths}
              city={trip.listingId.city}
              province={trip.listingId.province}
              country={trip.listingId.country}
              category={trip.listingId.category}
              startDate={trip.startDate}
              endDate={trip.endDate}
              totalPrice={trip.totalPrice}
              booking={true}
            />
          ))}
      </div>

      <Footer />
    </>
  );
};

export default TripList;

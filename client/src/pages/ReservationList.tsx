import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import "../styles/List.scss";
import ListingCard from "../components/ListingCard";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { setReservationList } from "../redux/userSlice";
import Footer from "../components/Footer";

const ReservationList = () => {
  const [loading, setLoading] = useState(true);
  const user = useAppSelector((state) => state.user);
  const reservationList = user?.reservationList;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getReservationList = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_APP_SERVER_URL}/users/${
            user?._id
          }/reservations`
        );
        const data = await res.json();
        dispatch(setReservationList({ reservations: data.reservations }));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getReservationList();
  }, []);

  return (
    <>
      <Navbar />
      <h1 className="title-list">Your reservation list</h1>
      {loading ? (
        <Loader />
      ) : (
        <div className="list">
          {reservationList &&
            reservationList?.map(
              ({ listingId, startDate, endDate, totalPrice }, index) => (
                <ListingCard
                  listingId={listingId._id}
                  listingPhotoPaths={listingId.listingPhotoPaths}
                  city={listingId.city}
                  province={listingId.province}
                  country={listingId.country}
                  category={listingId.category}
                  startDate={startDate}
                  endDate={endDate}
                  totalPrice={totalPrice}
                  booking={true}
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

export default ReservationList;

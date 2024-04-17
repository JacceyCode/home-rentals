import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../redux/hook";
import { facilities } from "../data/data";
import "../styles/ListingDetails.scss";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange, RangeKeyDict } from "react-date-range";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

const ListingDetails = () => {
  const [loading, setLoading] = useState(false);
  const { listingId } = useParams();
  const user = useAppSelector((state) => state.user);

  const listings = useAppSelector((state) => state.listings);

  const listing = listings?.find((listing) => listing._id === listingId);

  //   booking calendar
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges: RangeKeyDict) => {
    // setDateRange([ranges.selection]);
    const { startDate, endDate, key } = ranges.selection;
    if (startDate && endDate && key) {
      setDateRange([{ startDate, endDate, key }]);
    }
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const now = new Date();

  const dayCount = Math.round(+end - +start) / (1000 * 60 * 60 * 24);

  // submit booking
  const customerId = useAppSelector((state) => state.user?._id);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Kindly login to create a booking.");
      return;
    }
    if (customerId === listing?.creator._id) {
      toast.error("You can't make a booking of your own listing.");
      return;
    }
    if (dayCount === 0) {
      toast.error("Please indicate your stay duration.");
      return;
    }
    if (+start - +now < -86000000) {
      toast.error("Wrong duration input. Please correct your stay duration.");
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        customerId,
        listingId,
        hostId: listing?.creator._id,
        startDate: dateRange[0].startDate,
        endDate: dateRange[0].endDate,
        totalPrice: listing!.price * dayCount,
      };

      const res = await fetch(
        `${import.meta.env.VITE_APP_SERVER_URL}/bookings/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!res.ok) throw Error();

      const data = await res.json();
      data && navigate(`/${customerId}/trips`);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return !listing ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div className="listing-details">
        <div className="title">
          <h1>{listing?.title}</h1>
        </div>
        <div className="photos">
          {listing?.listingPhotoPaths.map((photo, index) => (
            <img
              src={`${import.meta.env.VITE_APP_SERVER_URL}/${photo.replace(
                "public",
                ""
              )}`}
              alt="listing photo"
              key={index}
            />
          ))}
        </div>

        <h2>
          {listing?.type} in {listing?.city}, {listing?.province},{" "}
          {listing?.country}
        </h2>
        <p>
          {listing?.guestCount} guests - {listing?.bedroomCount} bedroom(s) -{" "}
          {listing?.bedCount} bed(s) - {listing?.bathroomCount} bathroom(s)
        </p>
        <hr />

        <div className="profile">
          <img
            src={`${
              import.meta.env.VITE_APP_SERVER_URL
            }/${listing?.creator.profileImagePath.replace("public", "")}`}
            alt=""
          />
          <h3>
            Hosted by {listing?.creator.firstName} {listing?.creator.lastName}
          </h3>
        </div>
        <hr />

        <h3>Description</h3>
        <p>{listing?.description}</p>
        <hr />

        <h3>{listing?.highlight}</h3>
        <p>{listing?.highlightDescription}</p>
        <hr />

        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {listing?.amenities[0].split(",").map((item, index) => (
                <div className="facility" key={index}>
                  <div className="facility_icon">
                    {facilities!.map((facility, index) => {
                      if (facility.name === item)
                        return <facility.icon key={index} />;
                    })}
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DateRange ranges={dateRange} onChange={handleSelect} />

              {dayCount > 1 ? (
                <h2>
                  ${listing?.price} x {dayCount} nights
                </h2>
              ) : (
                <h2>
                  ${listing?.price} x {dayCount} night
                </h2>
              )}

              <h2>Total price: ${listing!.price * dayCount}</h2>
              <p>Start Date: {dateRange[0].startDate.toDateString()}</p>
              <p>End Date: {dateRange[0].endDate.toDateString()}</p>

              <button
                className="button"
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                BOOKING
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListingDetails;

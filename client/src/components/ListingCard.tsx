import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import {
  ArrowBackIosNew,
  ArrowForwardIos,
  Favorite,
} from "@mui/icons-material";
import "../styles/ListingCard.scss";
import { ListingCardProps } from "../types/user-slice";
import { setWishList } from "../redux/userSlice";
import { toast } from "react-toastify";

const ListingCard = ({
  listingId,
  listingPhotoPaths,
  city,
  province,
  country,
  category,
  type,
  price,
  startDate,
  endDate,
  totalPrice,
  booking,
}: ListingCardProps) => {
  //   images slider
  const [curIndex, setCurIndex] = useState<number>(0);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const goToPrevSlide = () =>
    setCurIndex((prevIndex) =>
      prevIndex === 0 ? listingPhotoPaths!.length - 1 : --prevIndex
    );

  const goToNextSlide = () =>
    setCurIndex((prevIndex) =>
      prevIndex === listingPhotoPaths!.length - 1 ? 0 : ++prevIndex
    );

  // add to wishlist
  const user = useAppSelector((state) => state.user);
  // const token = useAppSelector((state) => state.token);
  const lists = useAppSelector((state) => state.listings);
  const wishList = user?.wishList || [];

  const isLiked = wishList?.find((item) => item?._id === listingId);

  const updateWishList = async () => {
    const list = lists?.find((item) => item._id === listingId);

    if (user?._id !== list?.creator._id) {
      const newWishList = isLiked
        ? wishList.filter((item) => item._id !== listingId)
        : [...wishList, list];

      const res = await fetch(
        `${import.meta.env.VITE_APP_SERVER_URL}/users/${
          user!._id
        }/${listingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newWishList),
        }
      );

      const data = await res.json();

      dispatch(setWishList(data));
      toast.success(
        `${
          isLiked ? "Item removed from wish list." : "Item added to wish list."
        }`
      );
    } else {
      toast.error("You can't like your own listing.");
    }
  };

  return (
    <div
      className="listing-card"
      onClick={() => navigate(`/properties/${listingId}`)}
    >
      <div className="slider-container">
        <div
          className="slider"
          style={{ transform: `translateX(-${curIndex * 100}%)` }}
        >
          {listingPhotoPaths?.map((photo, index) => {
            // const imgURL = `${import.meta.env.VITE_APP_SERVER_URL}/${photo}`;

            return (
              <div key={index} className="slide">
                <img
                  // src={`${import.meta.env.VITE_APP_SERVER_URL}/${photo.replace(
                  //   "public\\",
                  //   ""
                  // )}`}
                  src={photo}
                  alt={`photo ${index + 1}`}
                />
                <div
                  className="prev-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevSlide();
                  }}
                >
                  <ArrowBackIosNew sx={{ fontSize: "15px" }} />
                </div>
                <div
                  className="next-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextSlide();
                  }}
                >
                  <ArrowForwardIos sx={{ fontSize: "15px" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <h3>
        {city}, {province}, {country}
      </h3>
      <p>{category}</p>

      {!booking ? (
        <>
          <p>{type}</p>
          <p>
            {" "}
            <span>${price}</span> per night
          </p>
        </>
      ) : (
        <>
          {new Date(startDate!).toDateString()} -{" "}
          {new Date(endDate!).toDateString()}
          <p>
            {" "}
            <span>${totalPrice}</span> total
          </p>
        </>
      )}

      <button
        className="favorite"
        onClick={(e) => {
          e.stopPropagation();

          user
            ? updateWishList()
            : toast.error("Kindly sign in to add trip to wish list.");
        }}
      >
        {isLiked ? (
          <Favorite sx={{ color: "red" }} />
        ) : (
          <Favorite sx={{ color: "white" }} />
        )}
      </button>
    </div>
  );
};

export default ListingCard;

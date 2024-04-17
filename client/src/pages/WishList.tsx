import "../styles/List.scss";
import { useAppSelector } from "../redux/hook";
import ListingCard from "../components/ListingCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const WishList = () => {
  const wishList = useAppSelector((state) => state.user?.wishList);

  return (
    <>
      <Navbar />
      <h1 className="title-list">Your wish list</h1>
      <div className="list">
        {wishList &&
          wishList?.map(
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

export default WishList;

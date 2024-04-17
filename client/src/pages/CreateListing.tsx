import { FormEvent, useState } from "react";
import { useAppSelector } from "../redux/hook";
import "../styles/CreateListing.scss";
import Navbar from "../components/Navbar";

import { RemoveCircleOutline, AddCircleOutline } from "@mui/icons-material";
import { IoIosImages } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";

import { categories, facilities, types } from "../data/data";
import {
  DescriptionProps,
  ListingFormProps,
  LocationProp,
  PhotoProp,
  PhotosProp,
} from "../types/create-listing";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const CreateListing = () => {
  const [category, setCategory] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [photos, setPhotos] = useState([] as PhotosProp);
  const [amenities, setAmenities] = useState([] as string[]);
  //   BASIC COUNT LOGIC
  const [guestCount, setGuestCount] = useState<number>(1);
  const [bedroomCount, setBedroomCount] = useState<number>(1);
  const [bedCount, setBedCount] = useState<number>(1);
  const [bathroomCount, setBathroomCount] = useState<number>(1);
  const [formDescription, setFormDescription] = useState({
    title: "",
    description: "",
    highlight: "",
    highlightDescription: "",
    price: 0,
  } as DescriptionProps);

  //   LOCATION
  const [formLocation, setFormLocation] = useState<LocationProp>({
    streetAddress: "",
    aptSuite: "",
    city: "",
    province: "",
    country: "",
  });

  //   AMENITIES
  const handleSelectAmenities = (facility: string) => {
    if (amenities.includes(facility)) {
      setAmenities((prevAmenities) =>
        prevAmenities.filter((amenity) => amenity !== facility)
      );
    } else {
      setAmenities((prevAmenities) => [...prevAmenities, facility]);
    }
  };

  const handleChangeLocation = (e: FormEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormLocation({ ...formLocation, [name]: value });
  };

  // UPLOAD, DRAG & DROP, REMOVE PHOTOS

  const handleUploadPhotos = (e: FormEvent) => {
    const newPhotos: PhotoProp = (e.target as HTMLInputElement).files;

    if (newPhotos !== null) {
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    }
  };

  const handleDragPhoto = (result: DropResult) => {
    if (!result.destination) return;

    // re-order photos on drag & drop
    const items = Array.from(photos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPhotos(items);
  };

  const handleRemovePhoto = (indexToRemove: number) =>
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    );

  // DESCRIPTION

  const handleChangeDescription = (e: FormEvent) => {
    e.preventDefault();
    const { name, value } = e.target as HTMLInputElement;

    setFormDescription({ ...formDescription, [name]: value });
  };

  const creatorId = useAppSelector((state) => state.user?._id)!;

  const navigate = useNavigate();

  const handlePost = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // create a new form data object
      const listingForm: ListingFormProps = {
        creator: creatorId,
        category,
        type,
        streetAddress: formLocation.streetAddress,
        aptSuite: formLocation.aptSuite,
        city: formLocation.city,
        province: formLocation.province,
        country: formLocation.country,
        guestCount,
        bedroomCount,
        bedCount,
        bathroomCount,
        amenities,
        title: formDescription.title,
        description: formDescription.description,
        highlight: formDescription.highlight,
        highlightDescription: formDescription.highlightDescription,
        price: formDescription.price,
      };

      const listingFormData = new FormData();
      for (const key in listingForm) {
        listingFormData.append(key, listingForm[key]);
      }
      // Append each selected photos to the FormData object
      photos.map((photo) => listingFormData.append("listingPhotos", photo));

      // Send a post request to server

      const response = await fetch(
        `${import.meta.env.VITE_APP_SERVER_URL}/properties/create`,
        {
          method: "POST",
          body: listingFormData,
        }
      );
      if (!response.ok) throw Error();
      await response.json();
      if (response.ok) {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />

      <section className="create-listing">
        <h1>Publish Your Place</h1>
        <form onSubmit={handlePost}>
          <section className="create-listing_step1">
            <h2>Step 1: Tell us about your place.</h2>
            <hr />
            <h3>Which of these categories best describes your place?</h3>
            <section className="category-list">
              {categories?.map((item, index) => (
                <div
                  className={`category ${
                    category === item.label ? "selected" : ""
                  }`}
                  key={index}
                  onClick={() => setCategory(item.label)}
                >
                  <div className="category_icon">{<item.icon />}</div>
                  <p>{item.label}</p>
                </div>
              ))}
            </section>

            <h3>What type of place will guests have?</h3>
            <div className="type-list">
              {types?.map((item, index) => (
                <div
                  className={`type ${type === item.name ? "selected" : ""}`}
                  key={index}
                  onClick={() => setType(item.name)}
                >
                  <div className="type_text">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>

                  <div className="type_icon">{<item.icon />}</div>
                </div>
              ))}
            </div>

            <h3>Where's your place located?</h3>
            <div className="full">
              <div className="location">
                <p>Street Address</p>
                <input
                  type="text"
                  placeholder="Street address"
                  name="streetAddress"
                  value={formLocation.streetAddress}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>
            <div className="half">
              <div className="location">
                <p>Apartment, Suite, etc. (if applicable)</p>
                <input
                  type="text"
                  placeholder="Apt, Suite, etc. (if applicable)"
                  name="aptSuite"
                  value={formLocation.aptSuite}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
              <div className="location">
                <p>City</p>
                <input
                  type="text"
                  placeholder="City"
                  name="city"
                  value={formLocation.city}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>

            <div className="half">
              <div className="location">
                <p>Province</p>
                <input
                  type="text"
                  placeholder="Province"
                  name="province"
                  value={formLocation.province}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
              <div className="location">
                <p>Country</p>
                <input
                  type="text"
                  placeholder="Country"
                  name="country"
                  value={formLocation.country}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>

            <h3>Share some basics about your place</h3>
            <div className="basics">
              <div className="basic">
                <p>Guests</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() =>
                      guestCount > 1 &&
                      setGuestCount((guestCount) => --guestCount)
                    }
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: "#f8395a" },
                    }}
                  />
                  <p>{guestCount}</p>
                  <AddCircleOutline
                    onClick={() => setGuestCount((guestCount) => ++guestCount)}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: "#f8395a" },
                    }}
                  />
                </div>
              </div>
              <div className="basic">
                <p>Bedrooms</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() =>
                      bedroomCount > 1 &&
                      setBedroomCount((bedroomCount) => --bedroomCount)
                    }
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: "#f8395a" },
                    }}
                  />
                  <p>{bedroomCount}</p>
                  <AddCircleOutline
                    onClick={() =>
                      setBedroomCount((bedroomCount) => ++bedroomCount)
                    }
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: "#f8395a" },
                    }}
                  />
                </div>
              </div>
              <div className="basic">
                <p>Beds</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() =>
                      bedCount > 1 && setBedCount((bedCount) => --bedCount)
                    }
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: "#f8395a" },
                    }}
                  />
                  <p>{bedCount}</p>
                  <AddCircleOutline
                    onClick={() => setBedCount((bedCount) => ++bedCount)}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: "#f8395a" },
                    }}
                  />
                </div>
              </div>
              <div className="basic">
                <p>Bathrooms</p>
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() =>
                      bathroomCount > 1 &&
                      setBathroomCount((bathroomCount) => --bathroomCount)
                    }
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: "#f8395a" },
                    }}
                  />
                  <p>{bathroomCount}</p>
                  <AddCircleOutline
                    onClick={() =>
                      setBathroomCount((bathroomCount) => ++bathroomCount)
                    }
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: "#f8395a" },
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="create-listing_step2">
            <h2>Step 2: Make your place stand out</h2>
            <hr />

            <h3>Tell guests what your place has to offer</h3>

            <div className="amenities">
              {facilities?.map((item, index) => (
                <div
                  className={`facility ${
                    amenities.includes(item.name) ? "selected" : ""
                  }`}
                  key={index}
                  onClick={() => handleSelectAmenities(item.name)}
                >
                  <div className="facility_icon">{<item.icon />}</div>
                  <p>{item.name}</p>
                </div>
              ))}
            </div>

            <h3>Add some photos of your place</h3>

            <DragDropContext onDragEnd={handleDragPhoto}>
              <Droppable droppableId="photos" direction="horizontal">
                {(provided) => (
                  <div
                    className="photos"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {photos.length < 1 ? (
                      <>
                        <input
                          type="file"
                          id="image"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label htmlFor="image" className="alone">
                          <div className="icon">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    ) : (
                      <>
                        {photos.map((photo, index) => {
                          return (
                            <Draggable
                              key={index}
                              index={index}
                              draggableId={index.toString()}
                            >
                              {(provided) => (
                                <div
                                  className="photo"
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <img
                                    src={URL.createObjectURL(photo)}
                                    alt="place"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(index)}
                                  >
                                    <BiTrash />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        <input
                          type="file"
                          id="image"
                          style={{ display: "none" }}
                          accept="image/*"
                          onChange={handleUploadPhotos}
                          multiple
                        />
                        <label htmlFor="image" className="together">
                          <div className="icon">
                            <IoIosImages />
                          </div>
                          <p>Upload from your device</p>
                        </label>
                      </>
                    )}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <h3>What makes your place attractive and exciting?</h3>
            <div className="description">
              <p>Title</p>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formDescription.title}
                onChange={handleChangeDescription}
                required
              />
              <p>Description</p>
              <textarea
                name="description"
                placeholder="Description"
                value={formDescription.description}
                onChange={handleChangeDescription}
                required
              />
              <p>Highlight</p>
              <input
                type="text"
                name="highlight"
                placeholder="Highlight"
                value={formDescription.highlight}
                onChange={handleChangeDescription}
                required
              />
              <p>Highlight details</p>
              <textarea
                name="highlightDescription"
                placeholder="Highlight details"
                value={formDescription.highlightDescription}
                onChange={handleChangeDescription}
                required
              />
              <p>Now, set your PRICE</p>
              <span>$</span>
              <input
                type="number"
                name="price"
                placeholder="100"
                className="price"
                value={formDescription.price}
                onChange={handleChangeDescription}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit_btn">
            CREATE YOUR LISTING
          </button>
        </form>
      </section>

      <Footer />
    </>
  );
};

export default CreateListing;

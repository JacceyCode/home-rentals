import "../styles/Categories.scss";
import { categories } from "../data/data";
import { Link } from "react-router-dom";

const Categories = () => {
  return (
    <section className="categories">
      <h1>Explore Top Categories</h1>
      <p>
        Explre our wide range of vacation rentals that cater to all types of
        travellers. Immerse yourself in the local culture, enjoy the comfort of
        home, and create unforgettable memories in your dream destination.
      </p>

      <section className="categories_list">
        {categories?.slice(1, 7).map((category, index) => (
          <Link to={`/properties/category/${category.label}`} key={index}>
            <div className="category">
              <img src={category.img} alt={category.label} />
              <div className="overlay"></div>
              <div className="category_text">
                <div className="category_text_icon">{<category.icon />}</div>
                <p>{category.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </section>
  );
};

export default Categories;

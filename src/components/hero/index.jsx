import { Link } from "react-router-dom";

/** Served from `/public/hero` — luxury pool & architecture (Unsplash) */
const HERO_BG = "/hero/home-hero.jpg";

const Hero = () => {
  return (
    <section
      className="wpo-hero-slider wpo-hero-slider--home"
      style={{
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100vh",
      }}
    >
      <div className="slide-inner slide-bg-image">
        <div className="container-fluid">
          <div className="slide-content">
            <p className="slide-tagline">Curated stays · Effortless booking</p>
            <div data-swiper-parallax="300" className="slide-title">
              <h2>Arrive rested. Leave inspired.</h2>
            </div>
            <p className="slide-subtitle">
              Discover hand-picked rooms with the details that matter—crisp
              linens, thoughtful amenities, and spaces designed for real
              relaxation.
            </p>
            <div data-swiper-parallax="500" className="slide-btns">
              <Link to="/search-result" className="theme-btn">
                Browse rooms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

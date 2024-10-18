import React from "react";
import "./landing.css";
import two from "../../public/images/3.jpg";
import a from "../../public/images/20.jpg";
import b from "../../public/images/21.jpg";
import c from "../../public/images/22.jpg";
import d from "../../public/images/23.jpg";
import e from "../../public/images/24.jpg";
import f from "../../public/images/25.jpg";
import g from "../../public/images/26.jpg";
import h from "../../public/images/27.jpg";
import i from "../../public/images/28.jpg";
import j from "../../public/images/29.jpg";
import k from "../../public/images/30.jpg";
import l from "../../public/images/31.jpg";

// Array of images
const images = [a, b, c, d, e, f, g, h, i, j, k, l];

export default function Landing() {
  return (
    <>
      <div className="land">
        <div className="one">
          <h3>Welcome to Book Cafee</h3>
          <h2>
            Discover your next favorite read at Book Cafee, where we bring books
            to life. Whether you are into fiction, non-fiction, or digital
            reads, we have personalized recommendations just for you. Explore
            our vast collection of bookshelves tailored to your tastes. Let us
            help you find your next literary escape! Curated reading suggestions
            at your fingertips.
          </h2>
          <a href="#Form">
            <button className="gr"></button>{" "}
            <button className="Explor">Explore Now</button>
          </a>
        </div>

        <div className="two">
          <img src={two} alt="" />
        </div>
      </div>

      <div className="land2">
        <div className="info">
          <h3>Find Your Next Favorite Read</h3>
          <h4>
            At Book Cafee, we provide personalized book recommendations that
            match your unique reading style.
          </h4>
        </div>

        <div className="books">
          {images.map((img, index) => (
            <img key={index} src={img} alt={`Book ${index + 1}`} />
          ))}
        </div>
      </div>
    </>
  );
}

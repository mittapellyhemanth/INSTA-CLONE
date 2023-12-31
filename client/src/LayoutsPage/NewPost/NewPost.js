import React, { useState } from "react";

import axios from "axios";

import NavBar from "../NavBar/NavBar";
import { useNavigate } from "react-router";
import "./NewPost.css";

export default function NewPost() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    PostImage: null,
  });

  const { name, location, description, PostImage } = formData;
  const handle = (e) => {
    const { name, value, files } = e.target;
    if (name === "PostImage") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("location", location);
      formDataToSend.append("description", description);
      formDataToSend.append("PostImage", PostImage);

      const res = await axios.post(
        `${process.env.REACT_APP_PROXY_URL}/posts`,
        formDataToSend
      );

      if (res.status === 201) {
        navigate("/post/view");
      }
    } catch (err) {
      console.log(formData);
      console.log(err);
    }
  }
  return (
    <>
      <div>
        <NavBar />
      </div>
      <div className="form-container">
        {/*  encType="multipart/form-data" */}
        <form
          method="POST"
          action="/uploads"
          encType="multipart/form-data"
          onSubmit={submit}
        >
          <div className="file-input border">
            <input
              type="file"
              placeholder="No file chosen"
              name="PostImage"
              onChange={handle}
              required
            />
          </div>
          <div className="name-location">
            <div>
              <input
                type="text"
                placeholder="Author"
                name="name"
                value={name}
                onChange={handle}
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Location"
                name="location"
                value={location}
                onChange={handle}
                required
              />
            </div>
          </div>
          <div className="file-input pd-x">
            <input
              className="pd-x"
              type="text"
              placeholder="Description"
              name="description"
              value={description}
              onChange={handle}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Post
          </button>
        </form>
      </div>
    </>
  );
}

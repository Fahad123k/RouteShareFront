import React, { useState } from "react";

const Publish = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    city: "",
    state: "New Mexico",
    zip: "",
  });

  const [error, setError] = useState({
    firstName: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName) {
      setError((prev) => ({ ...prev, firstName: "Please fill out this field." }));
    } else {
      setError({ firstName: "" });
      console.log("Form Submitted", formData);
    }
  };

  return (
    <div className="flex items-center justify-center  min-h-[calc(100vh-200px)]  ">
    <form className="w-full max-w-lg bg-white  rounded-lg shadow-md p-6" onSubmit={handleSubmit}>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="firstName">
            First Name
          </label>
          <input
            className={`appearance-none block w-full bg-gray-200 text-gray-700 border ${
              error.firstName ? "border-red-500" : "border-gray-200"
            } rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white`}
            id="firstName"
            type="text"
            placeholder="Jane"
            value={formData.firstName}
            onChange={handleChange}
          />
          {error.firstName && <p className="text-red-500 text-xs italic">{error.firstName}</p>}
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="lastName">
            Last Name
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            id="lastName"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>
  
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="password"
            type="password"
            placeholder="******************"
            value={formData.password}
            onChange={handleChange}
          />
          <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
        </div>
      </div>
  
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            id="password"
            type="password"
            placeholder="******************"
            value={formData.password}
            onChange={handleChange}
          />
          <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
        </div>
      </div>
  
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="city">
            City
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            id="city"
            type="text"
            placeholder="Albuquerque"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="state">
            State
          </label>
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white"
            id="state"
            value={formData.state}
            onChange={handleChange}
          >
            <option>New Mexico</option>
            <option>Missouri</option>
            <option>Texas</option>
          </select>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="zip">
            Zip
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            id="zip"
            type="text"
            placeholder="90210"
            value={formData.zip}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="city">
            City
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            id="city"
            type="text"
            placeholder="Albuquerque"
            value={formData.city}
            onChange={handleChange}
          />
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="state">
            State
          </label>
          <select
            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white"
            id="state"
            value={formData.state}
            onChange={handleChange}
          >
            <option>New Mexico</option>
            <option>Missouri</option>
            <option>Texas</option>
          </select>
        </div>
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="zip">
            Zip
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            id="zip"
            type="text"
            placeholder="90210"
            value={formData.zip}
            onChange={handleChange}
          />
        </div>
      </div>
  
      <button type="submit" className="mt-4 bg-gray-700 text-white py-2 px-4 rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  </div>
  
  );
};

export default Publish;

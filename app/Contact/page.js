import React from "react";

export default function Contact() {
  return (
    <form className="max-w-lg mx-auto p-8 bg-queens-white">
      <div className="mb-6 flex items-center">
        <label
          htmlFor="name"
          className="text-queens-midnight font-medium w-1/3"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="w-2/3 px-3 py-2 border border-queens-emerald rounded-lg focus:outline-none focus:border-queens-blue"
          required
        />
      </div>
      <div className="mb-6 flex items-center">
        <label
          htmlFor="email"
          className="text-queens-midnight font-medium w-1/3"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="w-2/3 px-3 py-2 border border-queens-emerald rounded-lg focus:outline-none focus:border-queens-blue"
          required
        />
      </div>
      <div className="mb-6 flex items-center">
        <label
          htmlFor="message"
          className="text-queens-midnight font-medium w-1/3"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows="4"
          className="w-2/3 px-3 py-2 border border-queens-emerald rounded-lg focus:outline-none focus:border-queens-blue"
          required
        ></textarea>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-queens-green text-queens-white py-2 px-4 rounded-lg hover:bg-queens-midnight transition duration-300"
        >
          Send Message
        </button>
      </div>
    </form>
  );
}

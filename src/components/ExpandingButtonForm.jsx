import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import img1 from "../assets/noorder.png";
import api from "./helper/api";
import { useNavigate } from "react-router-dom";


const ExpandingButtonForm = () => {
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  const [form1Data, setForm1Data] = useState({
    bricklink_consumer_key: "",
    bricklink_secret_key: "",
    bricklink_token_key: "",
    bricklink_token_secret_key: ""
  });
  const [form2Data, setForm2Data] = useState({
    brickowl_api_key: "",
  });

  
  const handleForm1Change = (e) => {
    setForm1Data({ ...form1Data, [e.target.name]: e.target.value });
  };

  
  const handleForm2Change = (e) => {
    setForm2Data({ ...form2Data, [e.target.name]: e.target.value });
  };

  const handleSubmitForm1 = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        bricklink_consumer_key: form1Data.bricklink_consumer_key,
        bricklink_secret_key: form1Data.bricklink_secret_key,
        bricklink_token_key: form1Data.bricklink_token_key,
        bricklink_token_secret_key: form1Data.bricklink_token_secret_key,
      };

      const response = await api.post("/keys/store/bricklink", payload);

      navigate('/dashboard')

    } catch (error) {
      console.error("Error linking Bricklink API:", error);
      alert("Failed to link Bricklink API.");
    }
  };



  const handleSubmitForm2 = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        brickowl_api_key: form2Data.brickowl_api_key,
      };

      const response = await axios.post("/keys/store/brickowl", payload);
      navigate('/dashboard')
      
    } catch (error) {
      console.error("Error linking Brickowl API:", error);
      alert("Failed to link Brickowl API.");
    }
  };


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="absolute inset-0 bg-cover bg-center blur-lg" style={{ backgroundImage: `url(${img1})` }} />
      <div className="z-10 flex flex-col justify-center items-center h-full w-full p-6">

        {/* Form 1: Bricklink */}
        <motion.div
          initial={{ height: "64px" }}
          animate={{ height: expanded === "form1" ? "420px" : "64px" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden bg-white rounded-xl shadow-lg w-4/5 md:w-2/3 lg:w-1/2 mb-6 pb-6"
        >
          <motion.button
            initial={{ opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 border-b-4 border-[#bbe90b] text-xl bg-black text-white rounded-lg font-semibold transition duration-300"
            onClick={() => setExpanded(expanded === "form1" ? null : "form1")}
          >
            Set Keys For Bricklink (BL)
          </motion.button>

          {expanded === "form1" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="p-6 pb-2"
            >
              <form className="space-y-4" onSubmit={handleSubmitForm1}>
                <input
                  type="text"
                  name="bricklink_consumer_key"  // ✅ Correct key name
                  placeholder="Bricklink Consumer Key"
                  value={form1Data.bricklink_consumer_key}
                  onChange={handleForm1Change}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="bricklink_secret_key"  // ✅ Correct key name
                  placeholder="Bricklink Secret Key"
                  value={form1Data.bricklink_secret_key}
                  onChange={handleForm1Change}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="bricklink_token_key"  // ✅ Correct key name
                  placeholder="Bricklink Token Key"
                  value={form1Data.bricklink_token_key}
                  onChange={handleForm1Change}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="bricklink_token_secret_key"  // ✅ Correct key name
                  placeholder="Bricklink Token Secret Key"
                  value={form1Data.bricklink_token_secret_key}
                  onChange={handleForm1Change}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
                <button type="submit" className="w-full py-3 bg-black text-white rounded-lg mt-2 hover:bg-gray-800">
                  Submit
                </button>
              </form>

            </motion.div>
          )}
        </motion.div>

        {/* Form 2: Brickowl */}
        <motion.div
          initial={{ height: "64px" }}
          animate={{ height: expanded === "form2" ? "230px" : "64px" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden bg-white rounded-xl shadow-lg w-4/5 md:w-2/3 lg:w-1/2"
        >
          <motion.button
            initial={{ opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 text-xl border-b-4 border-[#bbe90b] bg-black text-white rounded-lg font-semibold transition duration-300"
            onClick={() => setExpanded(expanded === "form2" ? null : "form2")}
          >
            Set Keys For Brickowl (BO)
          </motion.button>

          {expanded === "form2" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="p-6"
            >
              <form className="space-y-4" onSubmit={handleSubmitForm2}>
                <input
                  type="text"
                  name="brickowl_api_key"  // ✅ Correct key name
                  placeholder="Brickowl API Key"
                  value={form2Data.brickowl_api_key}
                  onChange={handleForm2Change}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
                <button type="submit" className="w-full py-3 bg-black text-white rounded-lg mt-2 hover:bg-gray-800">
                  Submit
                </button>
              </form>

            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ExpandingButtonForm;

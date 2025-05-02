import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import img1 from "../assets/noorder.png";
import api from "./helper/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import React from 'react';

const PrimaryStoreModal = ({ isOpen, onClose, onSelectStore }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-60">
      <div className="bg-white rounded-lg shadow-xl p-8 w-96 max-w-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Choose Your Primary Store</h2>
        <p className="text-sm text-gray-600 mb-8 text-center">
          Select your preferred primary store.
        </p>
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => onSelectStore('BrickLink')}
            className="px-6 py-3 bg-yellow-600 text-white rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 transform hover:scale-105"
          >
            Bricklink
          </button>
          <button
            onClick={() => onSelectStore('BrickOwl')}
            className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 transform hover:scale-105"
          >
            Brickowl
          </button>
        </div>
        
      </div>
    </div>
  );
};

const ExpandingButtonForm = () => {
  const [expanded, setExpanded] = useState(null);
  const [form1Submitted, setForm1Submitted] = useState(false);
  const [form2Submitted, setForm2Submitted] = useState(false);
  const [redirectAfterForm1, setRedirectAfterForm1] = useState(false);

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const handleStoreSelection = async (store) => {
    setSelectedStore(store);
    try{
      const response = await api.post('/keys/set-primary-store', {
        primary_store: store
      });

      redirectToDashboard();

    }catch(e){
      toast.error("error to set primary store.")
    }finally{
      setIsModalOpen(false);
    }
  };

  const selectPrimaryStore = () => {
    setIsModalOpen(true);
  }

  const redirectToDashboard = () => {

    localStorage.setItem("isKeys", true);
    api.get("/order/sync");

    api.get("/inventory/first-sync")

    navigate('/dashboard', {
      state: {
        toasts: [
          {
            type: "success",
            message: "The Inventory and order Sync Started in Background and may take around half an hour to complete. you will get a notified via mail when it complete"
          },
          // {
          //   type: "success",
          //   message: "The Order Sync Started in Background and may take up to 20 minutes to complete. After that, you can view your orders."
          // }
        ]
      }
    });
  };

  const [loadingBL, setLoadingBL] = useState(false);
  const [loadingBO, setLoadingBO] = useState(false);


  const handleSubmitForm1 = async (e) => {
    e.preventDefault();
    setLoadingBL(true);
    try {
      const payload = {
        bricklink_consumer_key: form1Data.bricklink_consumer_key,
        bricklink_secret_key: form1Data.bricklink_secret_key,
        bricklink_token_key: form1Data.bricklink_token_key,
        bricklink_token_secret_key: form1Data.bricklink_token_secret_key,
      };

      const response = await api.post("/keys/store/bricklink", payload);
      if (response.status === 200) {
        toast.success(`Bricklink keys updated successfully!`);
        setForm1Submitted(true);
        setExpanded("form2");

        // Redirect if user had already submitted Form 2 before
        if (form2Submitted || redirectAfterForm1) {
          selectPrimaryStore();
        }
      } else {
        toast.error(`Failed to update Bricklink keys.`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went wrong");
    }
    finally{
      setLoadingBL(false);
    }
  };

  const handleSubmitForm2 = async (e) => {
    e.preventDefault();
    setLoadingBO(true);
    try {
      const payload = {
        brickowl_api_key: form2Data.brickowl_api_key,
      };

      const response = await api.post("/keys/store/brickowl", payload);
      if (response.status === 200) {
        toast.success(`Brickowl keys updated successfully!`);
        setForm2Submitted(true);

        if (form1Submitted) {
          selectPrimaryStore();
        } else {
          // Form 1 not submitted yet, so we wait
          toast.info("Please complete the Bricklink keys setup to proceed.");
          setRedirectAfterForm1(true);
          setExpanded("form1");
        }
      } else {
        toast.error(`Failed to update Brickowl keys.`);
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.error || "Something went wrong");
    }
    finally{
      setLoadingBO(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="absolute inset-0 bg-cover bg-center blur-lg" style={{ backgroundImage: `url(${img1})` }} />
      <div className="z-10 flex flex-col justify-center items-center h-full w-full p-6">

      <PrimaryStoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectStore={handleStoreSelection}
      />


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
                <button type="submit" className="w-full py-3 bg-black text-white rounded-lg mt-2 hover:bg-gray-800" disabled={loadingBL}>
                  {loadingBL ? <ClipLoader size={20} color={'#ffffff'}></ClipLoader> : 'Submit'}
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
                <button type="submit" className="w-full py-3 bg-black text-white rounded-lg mt-2 hover:bg-gray-800" disabled={loadingBO}>  
                  {loadingBO ? <ClipLoader size={20} color={'#ffffff'}></ClipLoader> : 'Submit'}
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

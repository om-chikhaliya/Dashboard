import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
import Header from "./Header";
import api from "./helper/api";
import { ClipLoader } from "react-spinners";

function Setting() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedOption, setSelectedOption] = useState("bricklink");
  const [submitloading, setSubmitloading] = useState(false);

  // Form states
  const [bricklinkForm, setBricklinkForm] = useState({
    bricklink_consumer_key: "",
    bricklink_secret_key: "",
    bricklink_token_key: "",
    bricklink_token_secret_key: "",
  });

  const [brickowlForm, setBrickowlForm] = useState({
    brickowl_api_key: "",
  });

  // Handle form input change
  const handleInputChange = (event, platform) => {
    const { name, value } = event.target;
    if (platform === "bricklink") {
      setBricklinkForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setBrickowlForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (event, platform) => {
    event.preventDefault();

    setSubmitloading(true);
    const url = platform === "bricklink" ? "/keys/store/bricklink" : "/keys/store/brickowl";
    const data = platform === "bricklink" ? bricklinkForm : brickowlForm;

    try {
      const response = await api.post(url,data);
        
      if (response.status === 200) {
        toast.success(`${platform} keys updated successfully!`);
      }
      else {
        toast.error(`Failed to update ${platform} keys.`);
      }
    } catch (error) {
      toast.error(`${error.response.data.error}`);
    } finally {
      setSubmitloading(false);
    }
  };

  return (
    <div className="">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className={isSidebarOpen ? "main-content sidebar-open" : " px-4 py-4"}>
        <ToastContainer position="top-right" autoClose={3000} />
        <Header />

        <div className="p-6 pt-2">
          <h2 className="text-2xl font-semibold mb-4">API Key Settings</h2>

          {/* Radio Buttons (Side by Side) */}
          <div className="mb-4 flex space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="apiSettings"
                value="bricklink"
                checked={selectedOption === "bricklink"}
                onChange={() => setSelectedOption("bricklink")}
                className="w-4 h-4 cursor-pointer accent-[#DFF51D]"
              />
              <span className={`font-medium ${selectedOption === "bricklink"}`}>
                Update BrickLink Keys
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="apiSettings"
                value="brickowl"
                checked={selectedOption === "brickowl"}
                onChange={() => setSelectedOption("brickowl")}
                className="w-4 h-4 cursor-pointer accent-[#DFF51D]"
              />
              <span className={`font-medium ${selectedOption === "brickowl"}`}>
                Update BrickOwl Keys
              </span>
            </label>
          </div>

          {/* BrickLink Form */}
          {selectedOption === "bricklink" && (
            <div className="mt-4 p-4 border border-gray-300 rounded-md bg-white shadow-sm">
              <h3 className="text-lg font-medium mb-2">BrickLink API Keys</h3>
              <form onSubmit={(e) => handleSubmit(e, "bricklink")}>
                <label className="block mb-2 text-sm font-medium">Consumer Key:</label>
                <input
                  type="text"
                  name="bricklink_consumer_key"
                  value={bricklinkForm.bricklink_consumer_key}
                  onChange={(e) => handleInputChange(e, "bricklink")}
                  className="w-full p-2 border rounded-md mb-3"
                  placeholder="Enter Consumer Key"
                />

                <label className="block mb-2 text-sm font-medium">Consumer Secret:</label>
                <input
                  type="text"
                  name="bricklink_secret_key"
                  value={bricklinkForm.bricklink_secret_key}
                  onChange={(e) => handleInputChange(e, "bricklink")}
                  className="w-full p-2 border rounded-md mb-3"
                  placeholder="Enter Consumer Secret"
                />

                <label className="block mb-2 text-sm font-medium">Token:</label>
                <input
                  type="text"
                  name="bricklink_token_key"
                  value={bricklinkForm.bricklink_token_key}
                  onChange={(e) => handleInputChange(e, "bricklink")}
                  className="w-full p-2 border rounded-md mb-3"
                  placeholder="Enter Token"
                />

                <label className="block mb-2 text-sm font-medium">Token Secret:</label>
                <input
                  type="text"
                  name="bricklink_token_secret_key"
                  value={bricklinkForm.bricklink_token_secret_key}
                  onChange={(e) => handleInputChange(e, "bricklink")}
                  className="w-full p-2 border rounded-md mb-3"
                  placeholder="Enter Token Secret"
                />

                <button type="submit" className="mt-2 bg-[#DFF51D] text-black px-4 py-2 rounded-md font-medium hover:bg-[#C4E200]" disabled={submitloading}>
                {submitloading ? <ClipLoader size={20} color={'#000000'}></ClipLoader> : 'Save'}
                </button>
              </form>
            </div>
          )}

          {/* BrickOwl Form */}
          {selectedOption === "brickowl" && (
            <div className="mt-4 p-4 border border-gray-300 rounded-md bg-white shadow-sm">
              <h3 className="text-lg font-medium mb-2">BrickOwl API Keys</h3>
              <form onSubmit={(e) => handleSubmit(e, "brickowl")}>
                <label className="block mb-2 text-sm font-medium">API Key:</label>
                <input
                  type="text"
                  name="brickowl_api_key"
                  value={brickowlForm.brickowl_api_key}
                  onChange={(e) => handleInputChange(e, "brickowl")}
                  className="w-full p-2 border rounded-md mb-3"
                  placeholder="Enter API Key"
                />

                <button type="submit" className="mt-2 bg-[#DFF51D] text-black px-4 py-2 rounded-md font-medium hover:bg-[#C4E200]" disabled={submitloading}>
                {submitloading ? <ClipLoader size={20} color={'#000000'}></ClipLoader> : 'Save'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Setting;

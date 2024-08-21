"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { AiFillCheckCircle, AiFillExclamationCircle } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";

type Service = {
  id: number;
  name: string;
  status: string;
  uptimePercentage: number | null;
  dots: string[];
};

export default function Dashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newService, setNewService] = useState({ name: "", url: "" });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get("/api/services");
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleAddService = async () => {
    if (!newService.name || !newService.url)
      return alert("Name and URL are required.");

    try {
      const { data } = await axios.post("/api/services", newService);
      setServices((prev) => [...prev, data]);
      setNewService({ name: "", url: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add service:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Service Status Dashboard</h1>
          <span className="flex items-center text-green-500 text-lg">
            <AiFillCheckCircle className="w-6 h-6 mr-2" />
            All systems operational
          </span>
        </header>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center my-4">
            <h2 className="text-xl font-semibold mb-4">Uptime Last 90 Days</h2>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <FiPlus className="w-5 h-5" />
              Add Service
            </button>
          </div>

          <div className="space-y-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 p-4 rounded-lg flex items-center justify-between shadow-md animate-pulse"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-24 h-4 bg-gray-600 rounded"></div>
                      <div className="w-12 h-4 bg-gray-600 rounded"></div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.from({ length: 30 }).map((_, index) => (
                          <div
                            key={index}
                            className="w-0.5 h-4 bg-gray-600 rounded"
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="w-16 h-4 bg-gray-600 rounded"></div>
                  </div>
                ))
              : services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-gray-700 p-4 rounded-lg flex items-center justify-between shadow-md"
                  >
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      <span className="text-sm text-gray-400">
                        {`${service.uptimePercentage}%` ?? "0%"}
                      </span>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="flex flex-wrap gap-1">
                        {service.dots.map((status, index) => (
                          <div
                            key={index}
                            className={`w-0.5 h-4 rounded-full ${
                              status === "up" ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span
                      className={`${
                        service.status === "up"
                          ? "text-green-500"
                          : "text-gray-500"
                      } flex items-center`}
                    >
                      {service.status === "up" ? (
                        <div className="text-green-500 flex items-center gap-2">
                          <AiFillCheckCircle className="w-5 h-5 mr-2" />
                          Up
                        </div>
                      ) : (
                        <div className="text-red-500 flex items-center gap-2">
                          <AiFillExclamationCircle className="w-5 h-5 mr-2" />
                          Down
                        </div>
                      )}
                    </span>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4">Add New Service</h2>
            <input
              type="text"
              placeholder="Service Name"
              value={newService.name}
              onChange={(e) =>
                setNewService({ ...newService, name: e.target.value })
              }
              className="w-full mb-4 p-2 bg-gray-700 text-white rounded-lg focus:outline-none"
            />
            <input
              type="text"
              placeholder="Service URL"
              value={newService.url}
              onChange={(e) =>
                setNewService({ ...newService, url: e.target.value })
              }
              className="w-full mb-4 p-2 bg-gray-700 text-white rounded-lg focus:outline-none"
            />
            <div className="flex justify-end gap-4">
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                onClick={handleAddService}
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

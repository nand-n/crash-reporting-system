"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { AiFillCheckCircle, AiFillExclamationCircle } from "react-icons/ai";

type Service = {
  id: number;
  name: string;
  status: string;
  uptimePercentage: number | null;
  dots: string[];
};

export default function Dashboard() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await axios.get("/api/services");
      setServices(data);
    };
    fetchServices();
  }, []);

  console.log(services);
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
          <h2 className="text-xl font-semibold mb-4">Uptime Last 30 Entries</h2>
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-gray-700 p-4 rounded-lg flex items-center justify-between shadow-md"
              >
                <div className="flex  items-center space-x-4">
                  <h3 className="text-lg font-semibold col-span-2 col-start-1">
                    {service.name}
                  </h3>
                  <span className="text-sm text-gray-400 ">
                    {`${service.uptimePercentage}%` ?? "0%"}
                  </span>
                </div>
                <div className="flex-1 mx-4">
                  <div className="flex flex-wrap gap-1">
                    {service.dots.map((status, index) => (
                      <div
                        key={index}
                        className={`w-0.5 h-4 rounded-full hover: ${
                          status === "up" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span
                  className={`${
                    service.status == "up" ? "text-green-500" : "text-gray-500"
                  } flex items-center`}
                >
                  {service.status == "up" ? (
                    <div className="text-green-500 flex items-center gap-2">
                      <AiFillCheckCircle className="w-5 h-5 mr-2" />
                      Up
                    </div>
                  ) : (
                    <div className="text-red-500 flex items-center gap-2">
                      {" "}
                      <AiFillExclamationCircle />
                      Down
                    </div>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

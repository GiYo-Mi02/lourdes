import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { getPatientRecords } from '../../services/patientService';
import { PatientRecord } from '../../types';

export const AdminAnalytics: React.FC = () => {
  const [records, setRecords] = useState<PatientRecord[]>([]);
  const d3Container = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
        const data = await getPatientRecords();
        setRecords(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (records.length > 0 && d3Container.current) {
      drawChart();
    }
  }, [records]);

  const drawChart = () => {
    // Clear previous
    d3.select(d3Container.current).selectAll("*").remove();

    // Mock data based on records time grouping (or just simulated for demo if records are sparse)
    // Group records by hour
    const hours = new Array(24).fill(0);
    records.forEach(r => {
        const h = new Date(r.checkInTime).getHours();
        hours[h]++;
    });

    // If no data, simulate some for the visual
    if (records.length === 0) {
        // [9, 10, 11, 12, 13, 14, 15, 16, 17]
        [0,0,0,0,0,0,0,0,0, 4, 8, 12, 6, 5, 9, 11, 3, 0].forEach((val, i) => hours[i] = val);
    }

    const data = hours.map((count, hour) => ({ hour, count }));

    // Dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(d3Container.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3.scaleLinear()
      .domain([0, 23])
      .range([0, width]);
    
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(12).tickFormat(d => `${d}:00`))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-35)");

    // Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count) || 10])
      .range([height, 0]);
    
    svg.append("g")
      .call(d3.axisLeft(y));

    // Bars
    svg.selectAll("mybar")
      .data(data)
      .join("rect")
      .attr("x", d => x(d.hour))
      .attr("y", d => y(d.count))
      .attr("width", width / 24 - 2)
      .attr("height", d => height - y(d.count))
      .attr("fill", "#2C5F8D")
      .attr("rx", 2);
  };

  const totalPatients = records.length;
  const avgWaitTime = "12m"; // Mock calculation
  const anomalies = records.filter(r => 
      Object.values(r.vitals).some(v => v?.status !== 'Normal')
  ).length;

  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-y-auto animate-fade-in">
      <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Daily Analytics</h2>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <p className="text-gray-500 text-sm font-medium uppercase">Total Check-ins</p>
                          <h3 className="text-3xl font-bold text-gray-800 mt-1">{totalPatients || 0}</h3>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-medical-blue">
                          <i className="fas fa-users text-xl"></i>
                      </div>
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                      <i className="fas fa-arrow-up mr-1"></i>
                      <span className="font-medium">12%</span>
                      <span className="text-gray-400 ml-1">vs yesterday</span>
                  </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <p className="text-gray-500 text-sm font-medium uppercase">Avg Wait Time</p>
                          <h3 className="text-3xl font-bold text-gray-800 mt-1">{avgWaitTime}</h3>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
                          <i className="fas fa-clock text-xl"></i>
                      </div>
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                      <i className="fas fa-arrow-down mr-1"></i>
                      <span className="font-medium">2m</span>
                      <span className="text-gray-400 ml-1">vs average</span>
                  </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <p className="text-gray-500 text-sm font-medium uppercase">Vital Anomalies</p>
                          <h3 className="text-3xl font-bold text-gray-800 mt-1">{anomalies}</h3>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                          <i className="fas fa-heartbeat text-xl"></i>
                      </div>
                  </div>
                  <p className="text-sm text-gray-400">Patients requiring nurse review</p>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Chart Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Patient Traffic (Hourly)</h3>
                  <div className="w-full overflow-hidden flex justify-center" ref={d3Container}></div>
              </div>

              {/* Recent Activity / Anomalies List */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                   <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Alerts</h3>
                   <div className="space-y-4">
                        {records.filter(r => Object.values(r.vitals).some(v => v?.status !== 'Normal')).slice(0, 5).map(record => (
                            <div key={record.id} className="flex items-start p-3 bg-red-50 rounded-lg border border-red-100">
                                <i className="fas fa-exclamation-circle text-red-500 mt-1 mr-3"></i>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">{record.lastName}, {record.firstName}</p>
                                    <p className="text-xs text-red-600 mt-1">
                                        {Object.entries(record.vitals)
                                            .filter(([_, v]) => v?.status !== 'Normal')
                                            .map(([k, v]) => `${k}: ${v?.value} ${v?.unit}`)
                                            .join(', ')
                                        }
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(record.checkInTime).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))}
                        {anomalies === 0 && (
                            <p className="text-gray-400 italic text-center py-8">No alerts reported today.</p>
                        )}
                   </div>
              </div>
          </div>
      </div>
    </div>
  );
};